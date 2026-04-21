import React, { useState } from 'react';
import axios from 'axios';

function RedactionEmail({ onRetour }) {
  const [destinataire, setDestinataire] = useState('');
  const [sujet, setSujet] = useState('');
  const [corps, setCorps] = useState('');
  const [fichiers, setFichiers] = useState([]);
  const [succes, setSucces] = useState('');
  const [erreur, setErreur] = useState('');

  const handleEnvoyer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('sujet', sujet);
      formData.append('corps', corps);
      formData.append('destinataires', destinataire);
      fichiers.forEach(function(fichier) {
        formData.append('piecesJointes', fichier);
      });
      await axios.post(
        'http://localhost:5000/api/emails/envoyer',
        formData,
        { headers: { authorization: token, 'Content-Type': 'multipart/form-data' } }
      );
      setSucces('Email envoyé avec succès !');
      setTimeout(function() { onRetour(); }, 2000);
    } catch (err) {
      setErreur('Erreur lors de l envoi');
    }
  };

  const handleBrouillon = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/emails/brouillon',
        { sujet, corps, destinataire },
        { headers: { authorization: token } }
      );
      setSucces('Brouillon sauvegardé !');
      setTimeout(function() { onRetour(); }, 2000);
    } catch (err) {
      setErreur('Erreur sauvegarde brouillon');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.titre}>Nouveau message</h2>
          <button style={styles.fermer} onClick={onRetour}>✕</button>
        </div>
        {succes && <p style={styles.succes}>{succes}</p>}
        {erreur && <p style={styles.erreur}>{erreur}</p>}
        <form onSubmit={handleEnvoyer}>
          <div style={styles.champ}>
            <label style={styles.label}>À</label>
            <input
              style={styles.input}
              type="text"
              value={destinataire}
              onChange={function(e) { setDestinataire(e.target.value); }}
              placeholder="destinataire@email.com"
              required
            />
          </div>
          <div style={styles.champ}>
            <label style={styles.label}>Objet</label>
            <input
              style={styles.input}
              type="text"
              value={sujet}
              onChange={function(e) { setSujet(e.target.value); }}
              placeholder="Sujet de l'email"
              required
            />
          </div>
          <div style={styles.champ}>
            <label style={styles.label}>Message</label>
            <textarea
              style={styles.textarea}
              value={corps}
              onChange={function(e) { setCorps(e.target.value); }}
              placeholder="Écrivez votre message ici..."
              required
            />
          </div>
          <div style={styles.champ}>
            <label style={styles.label}>Pièces jointes</label>
            <input
              type="file"
              multiple
              style={styles.inputFichier}
              onChange={function(e) { setFichiers(Array.from(e.target.files)); }}
            />
            {fichiers.length > 0 && (
              <div style={styles.fichiersList}>
                {fichiers.map(function(f, i) {
                  return (
                    <div key={i} style={styles.fichierItem}>
                      📎 {f.name} ({Math.round(f.size / 1024)} Ko)
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={styles.actions}>
            <button style={styles.btnEnvoyer} type="submit">Envoyer</button>
            <button style={styles.btnBrouillon} type="button" onClick={handleBrouillon}>Brouillon</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#0F0E17', padding:'24px' },
  card: { background:'#1A1825', borderRadius:'12px', padding:'32px', maxWidth:'700px', margin:'0 auto', border:'0.5px solid #2D2A3E' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
  titre: { color:'#fff', fontSize:'20px', fontWeight:'600', margin:0 },
  fermer: { background:'transparent', border:'none', color:'#8F8CA0', fontSize:'18px', cursor:'pointer' },
  succes: { color:'#5DCAA5', fontSize:'13px', margin:'0 0 16px' },
  erreur: { color:'#ff6b6b', fontSize:'13px', margin:'0 0 16px' },
  champ: { marginBottom:'16px' },
  label: { color:'#8F8CA0', fontSize:'12px', display:'block', marginBottom:'6px' },
  input: { width:'100%', padding:'12px', background:'#2D2A3E', border:'0.5px solid #3D3A50', borderRadius:'8px', color:'#fff', fontSize:'14px', boxSizing:'border-box' },
  inputFichier: { color:'#8F8CA0', fontSize:'13px', marginTop:'4px' },
  fichiersList: { marginTop:'8px', display:'flex', flexDirection:'column', gap:'4px' },
  fichierItem: { background:'#2D2A3E', color:'#CECBF6', fontSize:'12px', padding:'6px 10px', borderRadius:'6px' },
  textarea: { width:'100%', padding:'12px', background:'#2D2A3E', border:'0.5px solid #3D3A50', borderRadius:'8px', color:'#fff', fontSize:'14px', boxSizing:'border-box', height:'200px', resize:'vertical' },
  actions: { display:'flex', gap:'12px', marginTop:'8px' },
  btnEnvoyer: { padding:'10px 28px', background:'#7F77DD', border:'none', borderRadius:'8px', color:'#fff', fontSize:'13px', cursor:'pointer' },
  btnBrouillon: { padding:'10px 28px', background:'transparent', border:'0.5px solid #7F77DD', borderRadius:'8px', color:'#7F77DD', fontSize:'13px', cursor:'pointer' }
};

export default RedactionEmail;