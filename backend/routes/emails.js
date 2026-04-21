const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const verifierToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Non autorisé' });
  try {
    const decoded = jwt.verify(token, 'secret_messagerie');
    req.utilisateurId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

router.get('/reception', verifierToken, async (req, res) => {
  try {
    const emails = await Email.find({
      destinataires: req.utilisateurId,
      dossier: 'reception'
    }).populate('expediteur', 'nom email')
      .populate('destinataires', 'nom email')
      .sort({ dateEnvoi: -1 });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/envoyes', verifierToken, async (req, res) => {
  try {
    const emails = await Email.find({
      expediteur: req.utilisateurId
    }).populate('expediteur', 'nom email')
      .populate('destinataires', 'nom email')
      .sort({ dateEnvoi: -1 });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/brouillons', verifierToken, async (req, res) => {
  try {
    const emails = await Email.find({
      expediteur: req.utilisateurId,
      dossier: 'brouillon'
    }).populate('expediteur', 'nom email')
      .sort({ dateEnvoi: -1 });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/spam', verifierToken, async (req, res) => {
  try {
    const emails = await Email.find({
      destinataires: req.utilisateurId,
      dossier: 'spam'
    }).populate('expediteur', 'nom email')
      .sort({ dateEnvoi: -1 });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/corbeille', verifierToken, async (req, res) => {
  try {
    const emails = await Email.find({
      destinataires: req.utilisateurId,
      dossier: 'corbeille'
    }).populate('expediteur', 'nom email')
      .sort({ dateEnvoi: -1 });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/envoyer', verifierToken, upload.array('piecesJointes', 5), async (req, res) => {
  try {
    const { sujet, corps, destinataires } = req.body;
    console.log('Données reçues :', sujet, corps, destinataires);
    console.log('Fichiers reçus :', req.files);

    const destinatairesArray = Array.isArray(destinataires) ? destinataires : [destinataires];

    const destinatairesIds = await Promise.all(
      destinatairesArray.map(async function(emailOuId) {
        if (emailOuId.includes('@')) {
          const user = await Utilisateur.findOne({ email: emailOuId });
          if (!user) throw new Error('Utilisateur ' + emailOuId + ' introuvable');
          return user._id;
        }
        return emailOuId;
      })
    );

    const fichiers = req.files ? req.files.map(function(file) {
      return {
        nomFichier: file.originalname,
        cheminFichier: '/uploads/' + file.filename,
        taille: file.size
      };
    }) : [];

    console.log('Fichiers à sauvegarder :', fichiers);

    const email = new Email({
      sujet,
      corps,
      expediteur: req.utilisateurId,
      destinataires: destinatairesIds,
      dossier: 'reception',
      piecesJointes: fichiers
    });

    await email.save();
    res.status(201).json({ message: 'Email envoyé !' });
  } catch (err) {
    console.log('Erreur envoi :', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.put('/lire/:id', verifierToken, async (req, res) => {
  try {
    await Email.findByIdAndUpdate(req.params.id, { estLu: true });
    res.json({ message: 'Email marqué comme lu' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/dossier/:id', verifierToken, async (req, res) => {
  try {
    const { dossier } = req.body;
    await Email.findByIdAndUpdate(req.params.id, { dossier });
    res.json({ message: 'Dossier mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/brouillon', verifierToken, async (req, res) => {
  try {
    const { sujet, corps } = req.body;
    const email = new Email({
      sujet: sujet || '(Sans objet)',
      corps: corps || '',
      expediteur: req.utilisateurId,
      destinataires: [],
      dossier: 'brouillon'
    });
    await email.save();
    res.status(201).json({ message: 'Brouillon sauvegardé !' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/detail/:id', verifierToken, async (req, res) => {
  try {
    const email = await Email.findById(req.params.id)
      .populate('expediteur', 'nom email')
      .populate('destinataires', 'nom email');
    res.json(email);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;