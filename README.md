
### Description
##### This is an Express.js project with MongoDB database and Mongoose that allows to create, read, update and delete todo list

## Available Scripts

Before You run the project don't forget to download dependencies

### `npm install`


In the project directory, you can run:

### `npm start`

To start tests you can run:

### `npm test`

## Examples
- to add todo task:
```
POST /todos
headers: {
  'Content-Type': 'application/json'
}
body: {
  name: 'Make a coffee'
}

```
- to remove todo task:
```
DELETE /todos/:id
```
- to get todo list:
```
GET /todos
```
- to mark todo item as completed
```
PUT /todos/:id

headers: {
  'Content-Type': 'application/json'
}
body: {
  isDone: true
}
```
- to mark todo item as undone
```
PUT /todos/:id

headers: {
  'Content-Type': 'application/json'
}
body: {
  isDone: false
}
```
