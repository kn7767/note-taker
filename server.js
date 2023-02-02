const express = require('express');
const path = require('path');
const dataBase = require('./Develop/db/db.json');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
);

//Notes page routes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
);

//GET from notes route
app.get('/api/notes', (req, res) => {
    res.json(dataBase);
});

//POST or add new note
app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, dataBase);
    res.json(newNote);
})

//Creates new notes
const createNote = (body, notesArr) => {
    const newNote = body;
    if(!Array.isArray(notesArr))
        notesArr = []; //empty
    if (notesArr.length === 0) 
        notesArr.push(0);

    body.id = notesArr.length;
    notesArr[0]++;
    notesArr.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArr, null, 2)
    );
    return newNote;
};

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});