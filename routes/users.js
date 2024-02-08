var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display user page
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM etudiants ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users',{data:''});
        } else {
            // render to views/users/index.ejs
            res.render('users',{data:rows});
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('users/add', {
        nom: '',
        prenom: '',
        email: '',
        telephone:''
    })
})

// add a new user
router.post('/add', function(req, res, next) {

    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let email = req.body.email;
    let telephone = req.body.telephone;
    let errors = false;

    if(nom.length === 0 || prenom.length === 0 || email.length === 0 || telephone === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/add', {
            nom: nom,
            prenom: prenom,
            email: email,
            telephone:telephone
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nom: nom,
            prenom: prenom,
            email: email,
            telephone:telephone
        }

        // insert query
        dbConn.query('INSERT INTO etudiants SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('users/add', {
                    nom: form_data.nom,
                    prenom: form_data.prenom,
                    email: form_data.email,
                    telephone:form_data.telephone
                })
            } else {
                req.flash('success', 'Etudiant successfully added');
                res.redirect('/users');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Etudiant not found with id = ' + id)
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                title: 'Edit Etudiant',
                id: rows[0].id,
                nom: rows[0].nom,
                prenom: rows[0].prenom,
                email: rows[0].email,
                telephone: rows[0].telephone
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let email = req.body.email;
    let telephone = req.body.telephone;
    let errors = false;

    if(nom.length === 0 || prenom.length === 0 || email.length === 0 || telephone.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            nom: nom,
            prenom: prenom,
            email: email,
            telephone:telephone
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            nom: nom,
            prenom: prenom,
            email: email,
            telephone:telephone
        }
        // update query
        dbConn.query('UPDATE etudiants SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    nom: form_data.nom,
                    prenom: form_data.prenom,
                    email: form_data.email,
                    telephone: form_data.telephone
                })
            } else {
                req.flash('success', 'Etudiant successfully updated');
                res.redirect('/users');
            }
        })
    }
})

// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM etudiants WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'Etudiant successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/users')
        }
    })
})

module.exports = router;