import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LectureEmail({ email, onRetour }) {
  const [repondre, setRepondre] = useState(false);
  const [transferer, setTransferer] = useState(false);
  const [corps, setCorps] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [succes, setSucces] = useState('');
  const [emailComplet, setEmailComplet] = useState(email);

  useEffect(() => {
    const chargerEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5000/api/emails/detail/' + email._id,
          { headers: { authorization: token } }
        );
        setEmailComplet(res.data);
      } catch (err) {
        console.log('Erreur chargement email complet');
      }
    };
    chargerEmail();
  }, [email._id]);

  useEffect(() => {
    const marquerLu = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          "http://localhost:5000/api/emails/lire/" + email._id,
          {},
          { headers: { authorization: token } }
        );
      } catch (err) {
        console.log('Erreur marquage lu');
      }
    };
    marquerLu();
  }, [email._id]);

  const handleRepondre = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/emails/envoyer',
        {
          sujet: 'Re: ' + emailComplet.sujet,
          corps,
          destinataires: [emailComplet.expediteur?.email]
        },
        { headers: { authorization: token } }
      );
      setSucces('Réponse envoyée !');
      setRepondre(false);
      setTimeout(function() { setSucces(''); }, 2000);
    } catch (err) {
      console.log('Erreur réponse :', err);
    }
  };

  const handleTransferer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/emails/envoyer',
        {
          sujet: 'Fwd: ' + emailComplet.sujet,
          corps: '---------- Message transféré ----------\n' + emailComplet.corps,
          destinataires: [destinataire]
        },
        { headers: { authorization: token } }
      );
      setSucces('Email transféré !');
      setTransferer(false);
      setTimeout(function() { setSucces(''); }, 2000);
    } catch (err) {
      console.log('Erreur transfert :', err);
    }
  };

  const handleSupprimer = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        "http://localhost:5000/api/emails/dossier/" + email._id,
        { dossier: 'corbeille' },
        { headers: { authorization: token } }
      );
      setSucces('Email supprimé !');
      setTimeout(function() { onRetour(); }, 1500);
    } catch (err) {
      console.log('Erreur suppression');
    }
  };

  const handleSpam = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        "http://localhost:5000/api/emails/dossier/" + email._id,
        { dossier: 'spam' },
        { headers: { authorization: token } }
      );
      setSucces('Email marqué comme spam !');
      setTimeout(function() { onRetour(); }, 1500);
    } catch (err) {
      console.log('Erreur spam');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button style={styles.retour} onClick={onRetour}>← Retour</button>
        <h1 style={styles.sujet}>{emailComplet.sujet}</h1>
        <div style={styles.infos}>
          <div style={styles.avatar}>{emailComplet.expediteur?.nom?.charAt(0)}</div>
          <div>
            <div style={styles.expediteur}>{emailComplet.expediteur?.nom}</div>
            <div style={styles.emailAddr}>{emailComplet.expediteur?.email}</div>
          </div>
          <div style={styles.date}>{new Date(emailComplet.dateEnvoi).toLocaleDateString()}</div>
        </div>
        <hr style={styles.divider}/>
        <div style={styles.corps}>{emailComplet.corps}</div>

        {emailComplet.piecesJointes && emailComplet.piecesJointes.length > 0 && (
          <div style={{ marginBottom:'20px' }}>
            <div style={{ color:'#8F8CA0', fontSize:'12px', marginBottom:'8px' }}>
              Pièces jointes
            </div>
            {emailComplet.piecesJointes.map(function(pj, i) {
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', background:'#2D2A3E', padding:'8px 12px', borderRadius:'8px', marginBottom:'6px' }}>
                  <span>📎</span>
                  <span style={{ color:'#CECBF6', fontSize:'13px' }}>{pj.nomFichier}</span>
                  <span style={{ color:'#8F8CA0', fontSize:'11px', marginLeft:'auto' }}>
                    {Math.round(pj.taille / 1024)} Ko
                  </span>
                  <button
                    onClick={function() { window.open("http://localhost:5000" + pj.cheminFichier); }}
                    style={{ background:'transparent', border:'none', color:'#7F77DD', fontSize:'12px', cursor:'pointer' }}
                  >
                    Télécharger
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {succes && <p style={styles.succes}>{succes}</p>}

        <div style={styles.actions}>
          <button
            style={styles.btnRepondre}
            onClick={function() { setRepondre(!repondre); setTransferer(false); }}
          >
            Répondre
          </button>
          <button
            style={styles.btnTransferer}
            onClick={function() { setTransferer(!transferer); setRepondre(false); }}
          >
            Transférer
          </button>
          <button style={styles.btnSpam} onClick={handleSpam}>
            Spam
          </button>
          <button style={styles.btnSupprimer} onClick={handleSupprimer}>
            Supprimer
          </button>
        </div>

        {repondre && (
          <form onSubmit={handleRepondre} style={styles.formulaire}>
            <div style={styles.champ}>
              <label style={styles.label}>À : {emailComplet.expediteur?.email}</label>
            </div>
            <div style={styles.champ}>
              <textarea
                style={styles.textarea}
                value={corps}
                onChange={function(e) { setCorps(e.target.value); }}
                placeholder="Votre réponse..."
                required
              />
            </div>
            <button style={styles.btnEnvoyer} type="submit">
              Envoyer la réponse
            </button>
          </form>
        )}

        {transferer && (
          <form onSubmit={handleTransferer} style={styles.formulaire}>
            <div style={styles.champ}>
              <label style={styles.label}>Transférer à</label>
              <input
                style={styles.input}
                type="text"
                value={destinataire}
                onChange={function(e) { setDestinataire(e.target.value); }}
                placeholder="destinataire@email.com"
                required
              />
            </div>
            <button style={styles.btnEnvoyer} type="submit">
              Transférer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#0F0E17', padding:'24px' },
  card: { background:'#1A1825', borderRadius:'12px', padding:'32px', maxWidth:'800px', margin:'0 auto', border:'0.5px solid #2D2A3E' },
  retour: { background:'transparent', border:'0.5px solid #2D2A3E', color:'#8F8CA0', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', marginBottom:'24px', fontSize:'13px' },
  sujet: { color:'#fff', fontSize:'22px', fontWeight:'700', margin:'0 0 20px' },
  infos: { display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' },
  avatar: { width:'40px', height:'40px', borderRadius:'50%', background:'#3C3489', display:'flex', alignItems:'center', justifyContent:'center', color:'#CECBF6', fontWeight:'600', flexShrink:0 },
  expediteur: { color:'#fff', fontSize:'14px', fontWeight:'500' },
  emailAddr: { color:'#8F8CA0', fontSize:'12px' },
  date: { marginLeft:'auto', color:'#8F8CA0', fontSize:'12px' },
  divider: { border:'none', borderTop:'0.5px solid #2D2A3E', margin:'0 0 20px' },
  corps: { color:'#C0BDD0', fontSize:'14px', lineHeight:'1.8', marginBottom:'24px' },
  succes: { color:'#5DCAA5', fontSize:'13px', margin:'0 0 16px' },
  actions: { display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' },
  btnRepondre: { padding:'10px 24px', background:'#7F77DD', border:'none', borderRadius:'8px', color:'#fff', fontSize:'13px', cursor:'pointer' },
  btnTransferer: { padding:'10px 24px', background:'transparent', border:'0.5px solid #7F77DD', borderRadius:'8px', color:'#7F77DD', fontSize:'13px', cursor:'pointer' },
  btnSpam: { padding:'10px 24px', background:'transparent', border:'0.5px solid #EF9F27', borderRadius:'8px', color:'#EF9F27', fontSize:'13px', cursor:'pointer' },
  btnSupprimer: { padding:'10px 24px', background:'transparent', border:'0.5px solid #E24B4A', borderRadius:'8px', color:'#E24B4A', fontSize:'13px', cursor:'pointer' },
  formulaire: { background:'#0F0E17', borderRadius:'8px', padding:'16px', marginTop:'8px' },
  champ: { marginBottom:'12px' },
  label: { color:'#8F8CA0', fontSize:'12px', display:'block', marginBottom:'6px' },
  input: { width:'100%', padding:'12px', background:'#2D2A3E', border:'0.5px solid #3D3A50', borderRadius:'8px', color:'#fff', fontSize:'14px', boxSizing:'border-box' },
  textarea: { width:'100%', padding:'12px', background:'#2D2A3E', border:'0.5px solid #3D3A50', borderRadius:'8px', color:'#fff', fontSize:'14px', boxSizing:'border-box', height:'120px', resize:'vertical' },
  btnEnvoyer: { padding:'10px 24px', background:'#7F77DD', border:'none', borderRadius:'8px', color:'#fff', fontSize:'13px', cursor:'pointer' }
};

export default LectureEmail;