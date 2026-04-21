import React, { useState } from 'react';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Reception from './pages/Reception';
import LectureEmail from './pages/LectureEmail';
import RedactionEmail from './pages/RedactionEmail';

function App() {
  const [page, setPage] = useState('connexion');
  const [emailSelectionne, setEmailSelectionne] = useState(null);

  const token = localStorage.getItem('token');

  const handleConnexion = () => setPage('reception');
  const handleDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setPage('connexion');
  };
  const handleLireEmail = (email) => {
    setEmailSelectionne(email);
    setPage('lecture');
  };
  const handleNouveau = () => setPage('redaction');
  const handleRetour = () => setPage('reception');

  if (token && page === 'connexion') setPage('reception');

  if (page === 'inscription') return <Inscription onInscription={() => setPage('connexion')} />;
  if (page === 'connexion') return <Connexion onConnexion={handleConnexion} onInscription={() => setPage('inscription')} />;
  if (page === 'reception') return <Reception onDeconnexion={handleDeconnexion} onLireEmail={handleLireEmail} onNouveau={handleNouveau} />;
  if (page === 'lecture') return <LectureEmail email={emailSelectionne} onRetour={handleRetour} />;
  if (page === 'redaction') return <RedactionEmail onRetour={handleRetour} />;
}

export default App;