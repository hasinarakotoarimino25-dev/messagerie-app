import React, { useState } from 'react';
import axios from 'axios';

function Inscription({ onInscription }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');

  const handleInscription = async (e) => {
    e.preventDefault();
    console.log('Bouton cliqué !');
    console.log('Données :', nom, email, motDePasse);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/inscription', {
        nom,
        email,
        motDePasse
      });
      console.log('Réponse :', res.data);
      onInscription();
    } catch (err) {
      console.log('Erreur :', err);
      setErreur('Erreur lors de la création du compte');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titre}>Créer un compte</h1>
        <p style={styles.sousTitre}>Rejoignez notre messagerie</p>
        {erreur && <p style={styles.erreur}>{erreur}</p>}
        <form onSubmit={handleInscription}>
          <div style={styles.champ}>
            <label style={styles.label}>Nom complet</label>
            <input
              style={styles.input}
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Jean Dupont"
              required
            />
          </div>
          <div style={styles.champ}>
            <label style={styles.label}>Adresse email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              required
            />
          </div>
          <div style={styles.champ}>
            <label style={styles.label}>Mot de passe</label>
            <input
              style={styles.input}
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button style={styles.bouton} type="submit">
            Créer mon compte
          </button>
        </form>
        <p style={styles.lien} onClick={onInscription}>
          Déjà un compte ? Se connecter
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#0F0E17', display:'flex', alignItems:'center', justifyContent:'center' },
  card: { background:'#1A1825', padding:'40px', borderRadius:'12px', width:'380px', border:'0.5px solid #2D2A3E' },
  titre: { color:'#fff', fontSize:'24px', fontWeight:'700', margin:'0 0 8px' },
  sousTitre: { color:'#8F8CA0', fontSize:'14px', margin:'0 0 24px' },
  erreur: { color:'#ff6b6b', fontSize:'13px', margin:'0 0 16px' },
  champ: { marginBottom:'16px' },
  label: { color:'#8F8CA0', fontSize:'12px', display:'block', marginBottom:'6px' },
  input: { width:'100%', padding:'12px', background:'#2D2A3E', border:'0.5px solid #3D3A50', borderRadius:'8px', color:'#fff', fontSize:'14px', boxSizing:'border-box' },
  bouton: { width:'100%', padding:'12px', background:'#7F77DD', border:'none', borderRadius:'8px', color:'#fff', fontSize:'14px', fontWeight:'500', cursor:'pointer', marginTop:'8px' },
  lien: { color:'#7F77DD', fontSize:'13px', textAlign:'center', marginTop:'16px', cursor:'pointer' }
};

export default Inscription;