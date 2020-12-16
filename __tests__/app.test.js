const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('RECIPE: recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('RECIPE: creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{
          amount: "2",
          measurement: "cups",
          name: "flour"
        }]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            amount: "2",
            measurement: "cups",
            name: "flour"
          }]
        });
      });
  });

  it('RECIPE: gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('RECIPE: updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('RECIPE: gets recipe by id', async() => {
    const recipes = await Recipe.insert({ 
      name: 'cookies', 
      directions: [] 
    });

    const res = await request(app)
      .get('/api/v1/recipes/1')
      
    expect(res.body).toEqual({ 
      id: '1',
      name: 'cookies', 
      directions: [] 
    });

  });

  it('RECIPE: deletes a recipe by id', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    const res = await request(app)
      .delete('/api/v1/recipes/1')
      
    expect(res.body).toEqual(
      { id: '1', name: expect.any(String), directions: [] },
    );

  });

  it('LOG: creates a log', async () => {
    const recipes = await Recipe.insert({ 
      name: 'cookies', 
      directions: [] 
    });    
    
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipe_id: "1",
        date_of_event: "thur",
        notes: "ok Cookies",
        rating: 5
      })
      .then(res => {
        expect(res.body).toEqual({
          id: "1",
          recipe_id: "1",
          date_of_event: "thur",
          notes: "ok Cookies",
          rating: '5'
        });
      });
  });

  it('LOG: gets all recipes', async() => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    const logs = await Promise.all([
      {
        recipe_id: "2",
        date_of_event: "Tuesday",
        notes: "Good Cookies",
        rating: "10"
      },
      {
          recipe_id: "2",
          date_of_event: "thur",
          notes: "ok Cookies",
          rating: "5"
      }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('LOG: updates a recipe by id', async() => {
    await Recipe.insert({ name: 'cookies', directions: [] });
    
    const recipe = await Log.insert({
      
      recipe_id: "1",
      date_of_event: "Tuesday",
      notes: "Good Cookies",
      rating: "10"
    });

    return request(app)
      .put(`/api/v1/logs/1`)
      .send({
        recipe_id: "1",
        date_of_event: "Friday",
        notes: "Bad Cookies",
        rating: "1"
      })
      .then(res => {
        expect(res.body).toEqual({
          id: "1",
          recipe_id: "1",
          date_of_event: "Friday",
          notes: "Bad Cookies",
          rating: "1"
        });
      });
  });

  it('LOG: gets log by id', async() => {
    await Recipe.insert({ name: 'cookies', directions: [] });
    
    const recipes = await Log.insert({
      recipe_id: "1",
      date_of_event: "Friday",
      notes: "Bad Cookies",
      rating: "1"
    });

    const res = await request(app)
      .get('/api/v1/logs/1')
      
    expect(res.body).toEqual({
      id: "1",
      recipe_id: "1",
      date_of_event: "Friday",
      notes: "Bad Cookies",
      rating: "1"
    });
  });

  it('LOG: deletes a log by id', async() => {
    await Recipe.insert({ name: 'cookies', directions: [] });

    await Log.insert({
      recipe_id: "1",
      date_of_event: "Friday",
      notes: "Bad Cookies",
      rating: "1"
    });

    const res = await request(app)
      .delete('/api/v1/logs/1')
      
    expect(res.body).toEqual({ 
      id: '1',
      recipe_id: "1",
      date_of_event: "Friday",
      notes: "Bad Cookies",
      rating: "1" 
    });
  });
});
