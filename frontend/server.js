const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'dist')));

// Pour toutes les routes, renvoyer index.html (pour React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║                                            ║');
    console.log('║       Duralux CRM - Serveur Démarré       ║');
    console.log('║                                            ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Serveur accessible à : http://localhost:${PORT}`);
    console.log('');
    console.log('📝 Pour arrêter le serveur, appuyez sur Ctrl+C');
    console.log('');

    // Ouvrir automatiquement le navigateur
    open(`http://localhost:${PORT}`);
});
