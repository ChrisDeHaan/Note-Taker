const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require(path.join(__dirname, '/db/db.json'))

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json())
app.use(express.static('public'))

// HTML routes
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/index.html'))
)

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// API routes
app.get('/api/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/db/db.json'))
)

app.post('/api/notes', (req, res) => {
    let newNote = req.body
    newNote.id = uuidGenerator()
    db.push(newNote);
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(db, null, 2), () => console.log('New note saved!'))
    res.send('Added')
})

app.delete('/api/notes/:id', (req, res) => {
    for (let i=0; i < db.length; i++) {
        if (db[i].id === req.params.id) {
            db.splice(i,1)
        }
    }
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(db, null, 2), () => console.log('Note deleted!'))
    res.send('Deleted')
})

app.listen(PORT, () => console.log(`App is listening on Port: ${PORT}`))

function uuidGenerator () {
    let generatedUUID = crypto.randomUUID()
    return generatedUUID
}
