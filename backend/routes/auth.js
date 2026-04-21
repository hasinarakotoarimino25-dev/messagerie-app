const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Utilisateur = require('../models/Utilisateur');

router.post('/inscription', async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;
    console.log('Données reçues :', nom, email, motDePasse);
    console.log('Modèle Utilisateur :', Utilisateur);

    const existeDeja = await Utilisateur.findOne({ email });
    if (existeDeja) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const motDePasseChiffre = await bcrypt.hash(motDePasse, 10);

    const utilisateur = new Utilisateur({
      nom,
      email,
      motDePasse: motDePasseChiffre
    });

    await utilisateur.save();
    res.status(201).json({ message: 'Compte créé avec succès !' });

  } catch (err) {
    console.log('Erreur détaillée :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: 'Email incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: utilisateur._id },
      'secret_messagerie',
      { expiresIn: '24h' }
    );

    res.json({ token, utilisateur: { id: utilisateur._id, nom: utilisateur.nom, email: utilisateur.email } });

  } catch (err) {
    console.log('Erreur détaillée :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;