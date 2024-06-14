const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

// URI de connexion à votre replica set MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/DBLP';

// Configuration de ejs comme moteur de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route pour récupérer les publications depuis MongoDB
app.get('/', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db('DBLP'); // Sélection de la base de données par défaut (DBLP)

    const publications = await db.collection('publis').find({}).toArray();

    client.close(); // Fermeture de la connexion client après usage

    res.render('index', { publications });

  } catch (error) {
    console.error('Erreur lors de la récupération des publications :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des publications' });
  }
});

// Démarrage du serveur Express
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
