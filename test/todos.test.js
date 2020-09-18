process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const {connectDB} = require('../db-connection');
const mongoose = require('mongoose');
const Todo = require('../todo');

let firstTodoItemId = null;
let existedName = null;

describe('GET: / route to get all TODOs', () => {
  before((done) => {
    connectDB().then(() => {
      mongoose.connection.db.listCollections({name: "todos"})
        .next((error, collection) => {
          if (collection) {
            mongoose.connection.db.dropCollection("todos")
              .then(async () => {
                const todo = await new Todo({name: 'To wake up!'});
                todo.save();
                const {_id, name} = todo;
                firstTodoItemId = _id;
                existedName = name;
                done();
              })
              .catch((err) => done(err))
          } else {
            done(error)
          }
        })
    });
  });

  it('should return correct data', (done) => {
    request(app)
      .get('/todos')
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        done();
      }).catch((err) => done(err))
  });
});

describe('POST: / route to create new TODO item', () => {
  it('should create correct item, if params are correct', (done) => {
    const correctTodoItem = {
      name: 'korn'
    };
    request(app)
      .post('/todos')
      .set({'Content-Type': 'application/json'})
      .send(correctTodoItem)
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        done();
      }).catch((err) => done(err))
  });

  it('should return 400 error, if params are incorrect', (done) => {
    const incorrectTodoItem = {
      name: 'de'
    };
    request(app)
      .post('/todos')
      .send(incorrectTodoItem)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        done();
      }).catch((err) => done(err))
  });

  it('should return 500 error, if params contains existent name', (done) => {
    const incorrectTodoItem = {
      name: existedName
    };
    request(app)
      .post('/todos')
      .send(incorrectTodoItem)
      .then((res) => {
        expect(res.statusCode).to.equal(500);
        done();
      }).catch((err) => done(err))
  });
});

describe('PUT: /:id route to update TODO item', () => {
  it('should update item, if params are correct', (done) => {
    const correctParams = {
      isDone: true
    };
    request(app)
      .put(`/todos/${firstTodoItemId}`)
      .set({'Content-Type': 'application/json'})
      .send(correctParams)
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        done();
      }).catch((err) => done(err));
  });

  it('should not update item, if params are incorrect', (done) => {
    const incorrectParams = {
      name: 'de'
    };
    request(app)
      .put(`/todos/${firstTodoItemId}`)
      .set({'Content-Type': 'application/json'})
      .send(incorrectParams)
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        done();
      }).catch((err) => done(err));
  });
});

describe('DELETE: /:id route to delete TODO item', () => {
  it('should not delete item, if ID not exists', (done) => {
    const nonExistedId = '123457890';
    request(app)
      .delete(`/todos/${nonExistedId}`)
      .set({'Content-Type': 'application/json'})
      .send()
      .then((res) => {
        expect(res.statusCode).to.equal(500);
        done();
      }).catch((err) => done(err));
  });

  it('should delete item, if ID exists', (done) => {
    request(app)
      .delete(`/todos/${firstTodoItemId}`)
      .set({'Content-Type': 'application/json'})
      .send()
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        done();
      }).catch((err) => done(err));
  });
});
