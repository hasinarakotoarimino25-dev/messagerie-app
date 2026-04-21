const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  sujet: { type: String, required: true },
  corps: { type: String, required: true },
  dateEnvoi: { type: Date, default: Date.now },
  estLu: { type: Boolean, default: false },
  expediteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  destinataires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }],
  dossier: { type: String, default: 'reception' }
});

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;