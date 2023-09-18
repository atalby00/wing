## Architecture Front :

```
src/
|
│──App.tsx # Le composant parent principal
|
│
├── components/ # Content les composants UI
│   ├── accordion/
|   ├── modal/
|   ├── sidebar/
|   └── sidebarSection/
│
├── core/  # Contenant les interfaces et l'interceptor axios.
|    └── interfaces/
|
├── features/  # Contenant les composants avec de la logique métier (calls API, manipulation de données, etc.)
|   ├── header/
|   └── parcelList/
|
|
├── hooks/  # Contenant les différents hooks utilisés
|    └── useFetchParcels.ts
|
|
├── services/  # Contenant les différents calls API vers le serveur NodeJS
     └── parcel.service.ts
```

## Architecture Back :

```
src/
│── app.ts # Le point d'entrée principal
│
├── controllers/ # Content les controllers interceptant différentes les requêtes
|   └── parcels.controller.ts
│
├── core/  # Contenant les interfaces, la data et les helpers.
|    ├── data/ # Les données JSON de la liste d'articles et de la liste des commandes.
|    ├── helpers/ # Les fonctions effectuant des tâches de manipulation de données, contenant de la logique métier.
|    └── interfaces/ # Les interfaces permettant de typer la donnée.
|
|
├── routes/  # Contenant les différents routes
|    └── parcels.routes.ts
```

## Installation et démarrage des serveurs

### Front

1. Dans le dossier `/front` : ouvrir un terminal et executer la commande `npm install` afin d'installer les dépendances du projet.
2. Dans le dossier `/front` : ajouter à la racine du dossier le fichier `.env.front` qui vous a été fourni contenant les différentes variables d'environnement. Il faudra le renommer en `.env`.
3. Dans le dossier `/front` : ouvrir un terminal et executer la commande `npm start` afin de démarrer le serveur.

### Back

1. Dans le dossier `/back` : ouvrir un terminal et executer la commande `npm install` afin d'installer les dépendances du projet.
2. Dans le dossier `/back` : ajouter à la racine du dossier le fichier `.env.back` qui vous a été fourni contenant les différentes variables d'environnement. Il faudra le renommer en `.env`.
3. Dans le dossier `/back` : ouvrir un terminal et executer la commande `npm start` afin de démarrer le serveur.

### Accès à l'application

Après démarrage des serveurs Front et Back, aller sur `http://localhost:3000` dans votre navigateur afin d'accéder à l'application.
