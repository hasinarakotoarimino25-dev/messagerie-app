const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/messagerie')
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => console.log('Erreur MongoDB :', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/emails', require('./routes/emails'));

app.get('/', (req, res) => {
  res.send('Serveur messagerie opérationnel !');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});