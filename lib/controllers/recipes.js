const { Router } = require('express');
const Recipe = require('../models/recipe');

module.exports = Router()
    .post('/', (req, res, next) => {
        Recipe
            .insert(req.body)
            .then(recipe => res.send(recipe));
    })

    .get('/', (req, res) => {
        Recipe
          .find()
          .then(recipes => res.send(recipes));
    })
