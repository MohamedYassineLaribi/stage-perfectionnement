@echo off
echo ====================================
echo Installation et lancement de Duralux React
echo ====================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installé!
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si npm est installé
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: npm n'est pas installé!
    echo Veuillez réinstaller Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js et npm sont installés.
echo.

REM Afficher les versions
echo Versions installées:
node --version
npm --version
echo.

REM Installer les dépendances
echo Installation des dépendances...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERREUR lors de l'installation des dépendances!
    pause
    exit /b 1
)

echo.
echo ====================================
echo Installation terminée avec succès!
echo ====================================
echo.
echo Démarrage du serveur de développement...
echo.
echo Le serveur sera accessible à: http://localhost:5173
echo Appuyez sur Ctrl+C pour arrêter le serveur.
echo.

REM Lancer le serveur de développement
call npm run dev

pause
