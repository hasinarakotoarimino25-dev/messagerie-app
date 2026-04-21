const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  avatar: { type: String, default: '' }
});

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);

module.exports = Utilisateur;