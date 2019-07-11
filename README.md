# Application pour Android 
**Basé sur le framework Ionic type angular.**
Cette application est orienté pour l'industrie. 
Le but est que les employés scannent un QRcode, cela leurs indiquent quelle est la désignation de la tâche ainsi que le descriptif. 
Au moment du scanne une heure de début est enregistrée, on peut aussi avoir plusieurs scannes en même temps. 
L'employé peut aussi ajouter des notes ou des photos à la tâche en cour. 
Au moment de la fermeture de la tâche, toutes ces informations sont envoyées sur soit firebase soit le cloud firestore. 
En cas d'erreur de transition toutes les informations sont stockées dans la base de donnée du telephone et on ne peut se délogger qu'une fois que toutes les informations sont envoyées  

### Les différentes fonctionnalitées de cette application:

  - Authenfication sur Firebase
  - Utilisation de le cloud firestore
  - Scanne d'un QRcode avec interrogation sur Firestore
  - Gestion des routes
  - Data Upload 
  - Check de la connexion

