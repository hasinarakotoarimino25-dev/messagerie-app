import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reception({ onDeconnexion, onLireEmail, onNouveau }) {
  const [emails, setEmails] = useState([]);
  const [dossierActif, setDossierActif] = useState('reception');
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur'));

  const chargerEmails = async (dossier) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/emails/${dossier}`, {
        headers: { authorization: token }
      });
      setEmails(res.data);
    } catch (err) {
      console.log('Erreur chargement emails');
    }
  };

  useEffect(() => {
    chargerEmails(dossierActif);
  }, [dossierActif]);

  const changerDossier = (dossier) => {
    setDossierActif(dossier);
  };

  const dossiers = [
    { id: 'reception', nom: 'Réception' },
    { id: 'envoyes', nom: 'Envoyés' },
    { id: 'brouillons', nom: 'Brouillons' },
    { id: 'spam', nom: 'Spam' },
    { id: 'corbeille', nom: 'Corbeille' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>📧 Messagerie</div>
        <button style={styles.nouveauBtn} onClick={onNouveau}>+ Nouveau</button>
        {dossiers.map(d => (
          <div
            key={d.id}
            style={{
              ...styles.menuItem,
              background: dossierActif === d.id ? '#2D2A3E' : 'transparent',
              color: dossierActif === d.id ? '#fff' : '#8F8CA0'
            }}
            onClick={() => changerDossier(d.id)}
          >
            {d.nom}
          </div>
        ))}
        <div style={styles.compte}>
          <div style={styles.avatar}>{utilisateur?.nom?.charAt(0)}</div>
          <div>
            <div style={styles.nomUser}>{utilisateur?.nom}</div>
            <div style={styles.deconnexion} onClick={onDeconnexion}>Déconnexion</div>
          </div>
        </div>
      </div>
      <div style={styles.contenu}>
        <div style={styles.header}>
          <h2 style={styles.titre}>{dossiers.find(d => d.id === dossierActif)?.nom}</h2>
          <span style={styles.badge}>{emails.filter(e => !e.estLu).length} non lus</span>
        </div>
        {emails.length === 0 ? (
          <div style={styles.vide}>Aucun email dans ce dossier</div>
        ) : (
          emails.map(email => (
            <div
              key={email._id}
              style={{ ...styles.emailRow, background: email.estLu ? '#1A1825' : '#221F30' }}
              onClick={() => onLireEmail(email)}
            >
              <div style={{ ...styles.dot, background: email.estLu ? 'transparent' : '#7F77DD' }}></div>
              <div style={styles.avatarEmail}>
                {dossierActif === 'envoyes'
                  ? email.destinataires?.[0]?.nom?.charAt(0)
                  : email.expediteur?.nom?.charAt(0)}
              </div>
              <div style={styles.emailInfo}>
                <div style={styles.emailHeader}>
                  <span style={styles.expediteur}>
                    {dossierActif === 'envoyes'
                      ? `À : ${email.destinataires?.[0]?.nom}`
                      : email.expediteur?.nom}
                  </span>
                  <span style={styles.date}>{new Date(email.dateEnvoi).toLocaleDateString()}</span>
                </div>
                <div style={styles.sujet}>{email.sujet}</div>
                <div style={styles.apercu}>{email.corps.substring(0, 60)}...</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', minHeight:'100vh', background:'#0F0E17' },
  sidebar: { width:'240px', background:'#1A1825', borderRight:'0.5px solid #2D2A3E', padding:'20px', display:'flex', flexDirection:'column', gap:'4px' },
  logo: { color:'#fff', fontSize:'18px', fontWeight:'700', marginBottom:'20px' },
  nouveauBtn: { background:'#7F77DD', color:'#fff', border:'none', borderRadius:'8px', padding:'10px', fontSize:'13px', cursor:'pointer', marginBottom:'16px' },
  menuItem: { fontSize:'13px', padding:'8px 12px', borderRadius:'6px', cursor:'pointer' },
  compte: { marginTop:'auto', display:'flex', alignItems:'center', gap:'10px', borderTop:'0.5px solid #2D2A3E', paddingTop:'16px' },
  avatar: { width:'36px', height:'36px', borderRadius:'50%', background:'#3C3489', display:'flex', alignItems:'center', justifyContent:'center', color:'#CECBF6', fontWeight:'600', fontSize:'14px' },
  nomUser: { color:'#fff', fontSize:'13px', fontWeight:'500' },
  deconnexion: { color:'#8F8CA0', fontSize:'11px', cursor:'pointer' },
  contenu: { flex:1, padding:'24px' },
  header: { display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' },
  titre: { color:'#fff', fontSize:'20px', fontWeight:'600', margin:0 },
  badge: { background:'#3C3489', color:'#CECBF6', fontSize:'12px', padding:'2px 10px', borderRadius:'12px' },
  vide: { color:'#8F8CA0', textAlign:'center', marginTop:'60px' },
  emailRow: { display:'flex', alignItems:'flex-start', gap:'12px', padding:'14px', borderRadius:'8px', cursor:'pointer', marginBottom:'4px', border:'0.5px solid #2D2A3E' },
  dot: { width:'8px', height:'8px', borderRadius:'50%', marginTop:'6px', flexShrink:0 },
  avatarEmail: { width:'36px', height:'36px', borderRadius:'50%', background:'#2D2A3E', display:'flex', alignItems:'center', justifyContent:'center', color:'#CECBF6', fontSize:'13px', flexShrink:0 },
  emailInfo: { flex:1 },
  emailHeader: { display:'flex', justifyContent:'space-between', marginBottom:'4px' },
  expediteur: { color:'#fff', fontSize:'13px', fontWeight:'500' },
  date: { color:'#8F8CA0', fontSize:'11px' },
  sujet: { color:'#CECBF6', fontSize:'12px', fontWeight:'500', marginBottom:'2px' },
  apercu: { color:'#6B6880', fontSize:'11px' }
};

export default Reception;