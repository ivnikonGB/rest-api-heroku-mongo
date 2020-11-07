const express = require('express');
const path = require('path');
const { v4 } = require('uuid');
const mongoose = require('mongoose');
const Contact = require('./models/contact');

let CONTACTS = [
  { id: v4(), name: "Test", value: "1234567", marked: false}
]
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.resolve(__dirname, 'client')));
app.use(express.json());

// GET
app.get('/api/contacts', (req,res) => {
  setTimeout( () => {
    res.status(200).json(CONTACTS);
  }, 1000)
});

// POST
app.post('/api/contacts', (req,res) => {
  const contact = {...req.body, id: v4(), marked: false}
  CONTACTS.push(contact);
  res.status(201).json(contact);
})

// DELETE
app.delete('/api/contacts/:id', (req,res) => {
  CONTACTS = CONTACTS.filter(c => c.id !== req.params.id);
  res.status(200).json({message: "Контакт был удалён."});
})

// PUT
app.put('/api/contacts/:id', (req,res) => {
  const idx = CONTACTS.findIndex(c => c.id === req.params.id);
  CONTACTS[idx] = req.body;
  res.json(CONTACTS[idx]);
})

app.get('/', (req, res) => {
  res.sendFile('index.html');
})

async function start() {
  try {
    await mongoose.connect(
      'mongodb+srv://ivnikon:LMAqTZ1veHzsykH1@cluster0.aluv7.mongodb.net/<dbname>?retryWrites=true&w=majority', 
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true 
      }
    );
    app.listen(PORT, () => console.log("Server has been started on port ",PORT));
  } catch(e) {
    console.log(e);
  }
}

start();