const express = require('express');
const cors = require('cors'); // Import the cors library
const app = express();
app.use(express.json());
app.use(cors()); // Use the cors middleware

// Initial todos and comments
let todos = [
  {
    id: 1,
    title: 'Todo 1',
    comments: [
      { id: 1, text: 'Comment 1' },
      { id: 2, text: 'Comment 2' }
    ]
  },
  {
    id: 2,
    title: 'Todo 2',
    comments: [
      { id: 3, text: 'Comment 3' },
      { id: 4, text: 'Comment 4' }
    ]
  }
];


// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Get a specific todo
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Create a new todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  const newTodo = {
    id: todos.length + 1,
    title,
    comments: []
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.title = title;
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Create a new comment for a todo
app.post('/api/todos/:id/comments', (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    const newComment = {
      id: todo.comments.length + 1,
      text
    };
    todo.comments.push(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Update a comment for a todo
app.put('/api/todos/:todoId/comments/:commentId', (req, res) => {
  const todoId = parseInt(req.params.todoId);
  const commentId = parseInt(req.params.commentId);
  const { text } = req.body;
  const todo = todos.find(todo => todo.id === todoId);
  if (todo) {
    const comment = todo.comments.find(comment => comment.id === commentId);
    if (comment) {
      comment.text = text;
      res.json(comment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a comment for a todo
app.delete('/api/todos/:todoId/comments/:commentId', (req, res) => {
  const todoId = parseInt(req.params.todoId);
  const commentId = parseInt(req.params.commentId);
  const todo = todos.find(todo => todo.id === todoId);
  if (todo) {
    const index = todo.comments.findIndex(comment => comment.id === commentId);
    if (index !== -1) {
      todo.comments.splice(index, 1);
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
