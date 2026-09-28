import express from 'express';

const app = express();
const PORT = 3000;

// 1. Body-parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Application-level request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// In-memory data array (6 initial tasks)
let tasks = [
  { id: 1, title: 'Learn Node.js', status: 'completed', priority: 'high' },
  { id: 2, title: 'Understand Express Middleware', status: 'completed', priority: 'medium' },
  { id: 3, title: 'Build REST API Routes', status: 'pending', priority: 'high' },
  { id: 4, title: 'Test with cURL or Postman', status: 'pending', priority: 'medium' },
  { id: 5, title: 'Review Git Operations', status: 'pending', priority: 'low' },
  { id: 6, title: 'Prepare for Mid-Term Lab', status: 'pending', priority: 'high' }
];

let nextId = 7;

// 3. Route-level validation middleware for POST and PUT
const validateTask = (req, res, next) => {
  const { title, status, priority } = req.body;
  if (!title || !status || !priority) {
    return res.status(400).json({ error: "Missing required fields: title, status, priority" });
  }
  next();
};

// 4. GET /tasks - Returns all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// 5. GET /tasks/search - Filter by status via query string
// NOTE: Placed ABOVE /tasks/:id so Express doesn't mistake 'search' for an ID parameter!
app.get('/tasks/search', (req, res) => {
  const { status } = req.query;
  if (status) {
    const filteredTasks = tasks.filter(t => t.status === status);
    return res.status(200).json(filteredTasks);
  }
  res.status(200).json(tasks);
});

// 6. GET /tasks/:id - Returns one task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.status(200).json(task);
});

// 7. POST /tasks - Creates a new task (with validation)
app.post('/tasks', validateTask, (req, res) => {
  const newTask = {
    id: nextId++,
    title: req.body.title,
    status: req.body.status,
    priority: req.body.priority
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 8. PUT /tasks/:id - Updates a task by ID (with validation)
app.put('/tasks/:id', validateTask, (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  Object.assign(task, {
    title: req.body.title,
    status: req.body.status,
    priority: req.body.priority
  });
  res.status(200).json(task);
});

// 9. DELETE /tasks/:id - Removes a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});

// 10. 404 Catch-All Middleware at the very end
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});