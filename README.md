## Installation et Lancement

### Option 1 : Utilisation de Maven

1. Assurez-vous d'avoir Maven installé sur votre système.
2. Naviguez vers le répertoire du projet dans votre terminal.
3. Exécutez la commande suivante :

### Option 2 : Utilisation du fichier JAR

1. Téléchargez le fichier JAR depuis la section "Releases" du projet.
2. Ouvrez un terminal et naviguez vers le répertoire contenant le fichier JAR.
3. Exécutez la commande suivante :

## Accès au Jeu

Une fois le programme lancé, ouvrez votre navigateur et accédez à : [localhost:8080](localhost:8080)

## Envoi de Commandes

Vous pouvez envoyer des commandes au jeu de deux manières :

### 1. Utilisation de la classe Client.java

Exécutez la classe `Client.java` pour envoyer des commandes (juste ecrivez la commande ex:"CreateBoat;Le Super Bato").

### 2. Utilisation d'un outil API comme Postman ou Insomnia

1. Configurez une requête POST vers `http://localhost:8080/api/update`
2. Définissez l'en-tête `Content-Type` sur `text/plain`
3. Dans le corps de la requête, entrez la commande souhaitée

## Commandes Disponibles

- `CreateBoat;{NOM DU BATEAU}` : Crée un nouveau bateau avec le nom spécifié
- `MoveForward` : Déplace le bateau vers l'avant
- `MoveBackward` : Déplace le bateau vers l'arrière
- `RotateClockwise` : Fait pivoter le bateau dans le sens horaire
- `RotateCounterClockwise` : Fait pivoter le bateau dans le sens antihoraire
- `Shoot` : Tire un projectile depuis le bateau

Note : Vous ne pouvez créer qu'un seul bateau par ip ce qui evite le spam de bateau ! 
