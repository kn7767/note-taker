const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util'); 

const db = require('./db/db.json');

const uuid = require('./helpers/uuid');
const { readFromFile, readAndAppend } = require ('./helpers/fsutils');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Notes page routes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data)));
});


app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json('New note');
    } else {
        res.error('Note was not saved');
    }
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});