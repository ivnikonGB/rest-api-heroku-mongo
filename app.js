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
app.get('/api/contacts', async (req,res) => {
  const contacts = await Contact.find({});
  res.status(200).json(contacts);
  
});

// POST
app.post('/api/contacts', async (req,res) => {
  const contact = new Contact ({
    name: req.body.name,
    value: req.body.value,
    marked: false
  });
  await contact.save();
  res.status(201).json(contact);
})

// DELETE
app.delete('/api/contacts/:id', async (req,res) => {
  await Contact.deleteOne({ _id: req.params.id }, 
    (err) => err ? console.log(err) : console.log('Deleted'));
  res.status(200).json({message: "Контакт был удалён."});
})

// PUT
app.put('/api/contacts/:id', async (req,res) => {
  const contact = await Contact.findById(req.params.id);
  contact.marked = !!req.body.marked;
  await contact.save();
  res.status(200).json(contact);
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