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

    .get('/:id', async (req, res, next) => {
        Recipe
          .findById(req.params.id)
          .then(recipe => recipe ? res.send(recipe) : next())
    })

    .put('/:id', (req, res) => {
    Recipe
        .update(req.params.id, req.body)
        .then(recipe => res.send(recipe));
    })

    .delete('/:id', (req, res) => {
        Recipe
          .delete(req.params.id)
          .then(recipe => res.send(recipe));
    })
