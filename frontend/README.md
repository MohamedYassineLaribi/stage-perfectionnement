# 🚀 Duralux React CRM - Guide de Démarrage Rapide

## ⚡ Démarrage Ultra-Rapide

### Pour Lancer le Projet :

**Double-cliquez simplement sur** → `start.bat`

✅ C'est tout ! Le script va automatiquement :
- Vérifier que Node.js est installé
- Installer toutes les dépendances
- Lancer le serveur de développement
- Ouvrir l'application sur http://localhost:3000

### Pour Créer le Build de Production :

**Double-cliquez sur** → `build.bat`

Le build sera créé dans le dossier `dist\`

---

## 📋 Prérequis

Vous devez avoir **Node.js** installé :
- Télécharger : https://nodejs.org/
- Version minimum : Node.js 16+

---

## 🎯 Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **start.bat** | Double-clic | Installe et lance le serveur de dev |
| **build.bat** | Double-clic | Crée le build de production |
| `npm run dev` | Manuel | Lance le serveur de développement |
| `npm run build` | Manuel | Build de production |
| `npm run preview` | Manuel | Prévisualise le build |

---

## 🏗️ Architecture

- **Frontend** : React 18 + Vite
- **Routing** : React Router v6
- **UI** : Bootstrap 5 + React Bootstrap
- **State Management** : React Query + Context API
- **Forms** : React Hook Form + Yup
- **Charts** : Chart.js
- **HTTP** : Axios

---

## 📁 Fonctionnalités

✅ Authentification (Login, Register, Forgot Password)
✅ Dashboard avec Analytics
✅ Gestion des Clients (Customers)
✅ Gestion des Prospects (Leads)
✅ Gestion des Projets
✅ Propositions Commerciales
✅ Facturation et Paiements
✅ Rapports (Ventes, Leads, Projets, Timesheets)
✅ Paramètres

---

## ⚙️ Configuration Backend

Le projet est configuré pour se connecter à un backend sur :
```
http://localhost:8000/api
```

Modifiez le fichier `.env` si nécessaire.

---

## 🐛 Problèmes Courants

### "npm n'est pas reconnu"
➡️ Installez Node.js depuis https://nodejs.org/

### Le serveur ne démarre pas
➡️ Vérifiez que le port 3000 est libre

### Erreurs d'installation
```bash
npm cache clean --force
npm install
```

---

## 📚 Documentation Complète

Consultez le [Guide Complet](../../../.gemini/antigravity/brain/4436f98f-a0f5-4889-b653-e1f709234699/walkthrough.md) pour :
- Instructions détaillées
- Création d'un exécutable
- Déploiement en production
- Résolution avancée des problèmes

---

## 📞 Support

- Documentation Vite : https://vitejs.dev/
- Documentation React : https://react.dev/
- Documentation React Router : https://reactrouter.com/

---

**Développé par theme_ocean** | Version 1.0.0
