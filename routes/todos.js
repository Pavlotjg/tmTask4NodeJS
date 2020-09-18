var express = require('express');
var router = express.Router();

const Todo = require('../todo');

const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});

const todoItemPostSchema = Joi.object({
  name: Joi.string().min(3).max(10).required(),
  description: Joi.string().max(60),
  isDone: Joi.boolean()
});

const todoItemPutSchema = Joi.object({
  name: Joi.string().min(3).max(10),
  description: Joi.string().max(60),
  isDone: Joi.boolean()
});

router.get('/', async function (req, res, next) {
  try {
    const arr = await Todo.find({});
    res.status(200);
    res.send(arr);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', validator.body(todoItemPostSchema), async function (req, res) {
  const {name} = req.body;
  const arr = await Todo.find({});
  const existTodo = arr.find((todo) => todo.name === name);
  if (!existTodo) {
    const todo = await new Todo({...req.body});
    todo.save();
    res.status(201);
    res.send(todo);
  } else {
    res.status(500).send('Such todo already exists');
  }
});

router.delete('/:id', async function (req, res) {
  const {id} = req.params;
  await Todo.deleteOne({_id: id});
  try {
    res.status(200);
    res.send(`Todo with id: ${id} was successfully deleted`);
  }catch (e) {
    res.status(500);
    res.send('Internal Server Error');
  }
});

router.put('/:id', validator.body(todoItemPutSchema), async function (req, res) {
  try {
    const {id} = req.params;
    const upd = await Todo.findOneAndUpdate({_id: id}, {$set: {...req.body}});
    const msg = `todo item with id: ${id} was successfully updated!`;
    res.status(200);
    res.send(msg);
  } catch (e) {
      res.status(500);
      res.send('Internal Server Error');
  }
});

module.exports = router;
