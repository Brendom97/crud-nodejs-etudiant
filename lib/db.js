const mysql = require('mysql');

// Création de la connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

// Connexion à la base de données MySQL
connection.connect(function (error) {
    if (error) {
        console.error('Erreur de connexion à la base de données : ' + error.stack);
        return;
    }
    console.log('Connexion à la base de données MySQL réussie');

    // Requête SQL pour vérifier si la base de données "crudnodejs" existe déjà
    const checkDatabaseQuery = `SHOW DATABASES LIKE 'crudnodejs'`;

    // Exécution de la requête de vérification de la base de données
    connection.query(checkDatabaseQuery, (error, results) => {
        if (error) {
            console.error('Erreur lors de la vérification de la base de données : ' + error.stack);
            return;
        }
        if (results.length === 0) {
            // La base de données "crudnodejs" n'existe pas, nous la créons
            createDatabase();
        } else {
            // La base de données "crudnodejs" existe déjà, nous continuons la connexion
            connectToDatabase();
        }
    });
});

// Fonction pour créer la base de données "crudnodejs"
function createDatabase() {
    const createDatabaseQuery = `CREATE DATABASE crudnodejs`;

    // Exécution de la requête de création de la base de données
    connection.query(createDatabaseQuery, (error, results) => {
        if (error) {
            console.error('Erreur lors de la création de la base de données : ' + error.stack);
            return;
        }
        console.log('Base de données "crudnodejs" créée avec succès');

        // Connexion à la base de données "crudnodejs"
        connectToDatabase();
    });
}

// Fonction pour se connecter à la base de données "crudnodejs"
function connectToDatabase() {
    // Connexion à la base de données "crudnodejs"
    connection.changeUser({ database: 'crudnodejs' }, function (error) {
        if (error) {
            console.error('Erreur lors de la connexion à la base de données "crudnodejs" : ' + error.stack);
            return;
        }
        console.log('Connecté à la base de données "crudnodejs"');

        // Requête SQL de création de table pour les étudiants
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS etudiants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                prenom VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                telephone VARCHAR(255) UNIQUE NOT NULL,
                classe VARCHAR(255) NOT NULL
            )
        `;

        // Exécution de la requête de création de table
        connection.query(createTableQuery, (error, results) => {
            if (error) {
                console.error('Erreur lors de la création de la table : ' + error.stack);
                return;
            }
            console.log('Table "etudiants" créée avec succès');
        });
    });
}

module.exports = connection;
