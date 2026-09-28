# MERN Full Stack Lab — Mid-Term Practice Answers

**Course:** CSA4604 — MERN Full Stack Lab  
**Note:** All code uses ES6 module syntax. Every project requires `"type": "module"` in `package.json`.

---

## Experiment 1: Node.js Project Initialization & Basic Express Server

### Terminal Commands
```bash
node -v
npm -v
git --version

mkdir hello-server
cd hello-server
npm init -y
```

Edit `package.json` — add `"type": "module"` below the `"main"` line:
```json
{
  "name": "hello-server",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  ...
}
```

```bash
npm install express
```

### index.js
```js
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/about", (req, res) => {
  res.send("This is the About page.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Run
```bash
node index.js
```

---

## Experiment 2: Node.js File System Operations (fs Module)

### Terminal Commands
```bash
mkdir file-ops
cd file-ops
npm init -y
```
Edit `package.json` — add `"type": "module"`.

### input.txt
```
Node.js makes file operations simple.
This is the original content.
```

### index.js
```js
import fs from "fs";

// Step 1: Read input.txt
const content = fs.readFileSync("input.txt", "utf-8");
console.log("--- Reading input.txt ---");
console.log(content);

// Step 2: Write content to output.txt
fs.writeFileSync("output.txt", content);

// Step 3: Append a line to output.txt
fs.appendFileSync("output.txt", "\nThis line was appended by Node.js.");

// Step 4: Read and display final output.txt
const finalContent = fs.readFileSync("output.txt", "utf-8");
console.log("--- Final content of output.txt ---");
console.log(finalContent);
```

### Run
```bash
node index.js
```

---

## Experiment 3: Serving Static Files and HTML Pages

### Terminal Commands
```bash
mkdir static-site
cd static-site
npm init -y
npm install express
mkdir public templates
```
Edit `package.json` — add `"type": "module"`.

### public/style.css
```css
body {
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}

.container {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
}

p {
  color: #555;
}
```

### templates/home.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Static Site</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="container">
    <h1>Welcome to Static Site</h1>
    <p>This page is served by Express and styled with a static CSS file.</p>
  </div>
</body>
</html>
```

### index.js
```js
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from the public/ directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the home page from templates/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "home.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Run
```bash
node index.js
```

---

## Experiment 4: In-Memory Data Array & GET All Route

### Terminal Commands
```bash
mkdir task-api
cd task-api
npm init -y
npm install express
```
Edit `package.json` — add `"type": "module"`.

### index.js
```js
import express from "express";

const app = express();
const PORT = 3000;

// Body-parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data
const tasks = [
  { id: 1, title: "Complete lab report", status: "pending", priority: "high" },
  { id: 2, title: "Read chapter 5", status: "completed", priority: "medium" },
  { id: 3, title: "Submit assignment", status: "pending", priority: "high" },
  { id: 4, title: "Review lecture notes", status: "completed", priority: "low" },
  { id: 5, title: "Prepare presentation", status: "pending", priority: "medium" },
];

// GET all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Run
```bash
node index.js
```

---

## Experiment 5: GET by ID Using Route Parameters

### index.js (add this route below `GET /tasks`)
```js
// GET a single task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});
```

---

## Experiment 6: GET with Query String Filtering

### index.js (add this route ABOVE `GET /tasks/:id`)
```js
// Search/filter tasks by status using query string
// IMPORTANT: This must be placed ABOVE /tasks/:id
// because Express matches routes top-to-bottom.
// If /tasks/:id comes first, "search" would be treated as an :id value.
app.get("/tasks/search", (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(200).json(tasks);
  }

  const filtered = tasks.filter(
    (t) => t.status.toLowerCase() === status.toLowerCase()
  );
  res.status(200).json(filtered);
});
```

**Why route order matters:** Express evaluates routes from top to bottom. If `GET /tasks/:id` is defined before `GET /tasks/search`, a request to `/tasks/search` would match `:id` with the value `"search"`, and Express would try to find a task with that id instead of running the search logic.

---

## Experiment 7: POST Route — Creating New Records

### index.js (add after the existing routes, but before any catch-all)
```js
let nextId = 6; // One more than the highest existing id

// POST — create a new task
app.post("/tasks", (req, res) => {
  const { title, status, priority } = req.body;

  const newTask = {
    id: nextId++,
    title,
    status,
    priority,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});
```

---

## Experiment 8: PUT Route — Updating Records

### index.js (add after the POST route)
```js
// PUT — update an existing task by ID
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  Object.assign(task, req.body);
  res.status(200).json(task);
});
```

---

## Experiment 9: DELETE Route — Removing Records

### index.js (add after the PUT route)
```js
// DELETE — remove a task by ID
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});
```

---

## Experiment 10: Application-Level Middleware — Request Logger

### index.js (add this BEFORE all route definitions, right after body-parsing middleware)
```js
// Application-level middleware — logs every request
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});
```

**Example console output when requests are made:**
```
[2026-09-28T10:30:00.000Z] GET /tasks
[2026-09-28T10:30:05.000Z] POST /tasks
[2026-09-28T10:30:10.000Z] PUT /tasks/1
[2026-09-28T10:30:15.000Z] DELETE /tasks/3
```

---

## Experiment 11: Route-Level Validation Middleware

### index.js (define the middleware function, then attach it to POST and PUT)
```js
// Route-level validation middleware
const validateTask = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (!title || !status || !priority) {
    return res
      .status(400)
      .json({ error: "Missing required fields: title, status, priority" });
  }

  next();
};

// Attach to POST and PUT routes:
app.post("/tasks", validateTask, (req, res) => {
  const newTask = {
    id: nextId++,
    title: req.body.title,
    status: req.body.status,
    priority: req.body.priority,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", validateTask, (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  Object.assign(task, req.body);
  res.status(200).json(task);
});
```

---

## Experiment 12: 404 Catch-All & Complete REST API

### Complete index.js (all experiments combined)
```js
import express from "express";

const app = express();
const PORT = 3000;

// ─── Body-Parsing Middleware ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Application-Level Middleware: Request Logger ────────────────────────
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── In-Memory Data ─────────────────────────────────────────────────────
const tasks = [
  { id: 1, title: "Complete lab report", status: "pending", priority: "high" },
  { id: 2, title: "Read chapter 5", status: "completed", priority: "medium" },
  { id: 3, title: "Submit assignment", status: "pending", priority: "high" },
  { id: 4, title: "Review lecture notes", status: "completed", priority: "low" },
  { id: 5, title: "Prepare presentation", status: "pending", priority: "medium" },
  { id: 6, title: "Practice coding", status: "pending", priority: "low" },
];

let nextId = 7;

// ─── Route-Level Validation Middleware ───────────────────────────────────
const validateTask = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (!title || !status || !priority) {
    return res
      .status(400)
      .json({ error: "Missing required fields: title, status, priority" });
  }

  next();
};

// ─── Routes ─────────────────────────────────────────────────────────────

// GET all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET — search/filter tasks by status (query string)
// Must be ABOVE /tasks/:id to avoid "search" being captured as an :id
app.get("/tasks/search", (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(200).json(tasks);
  }

  const filtered = tasks.filter(
    (t) => t.status.toLowerCase() === status.toLowerCase()
  );
  res.status(200).json(filtered);
});

// GET a single task by ID (route parameter)
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});

// POST — create a new task (with validation middleware)
app.post("/tasks", validateTask, (req, res) => {
  const newTask = {
    id: nextId++,
    title: req.body.title,
    status: req.body.status,
    priority: req.body.priority,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT — update a task by ID (with validation middleware)
app.put("/tasks/:id", validateTask, (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  Object.assign(task, req.body);
  res.status(200).json(task);
});

// DELETE — remove a task by ID
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});

// ─── 404 Catch-All Middleware ────────────────────────────────────────────
// This must be the LAST middleware — after all routes.
// It catches any request that didn't match a defined route above.
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Start Server ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Testing the Complete API

```bash
# GET all tasks
curl http://localhost:3000/tasks

# Search by status
curl "http://localhost:3000/tasks/search?status=pending"

# GET by ID
curl http://localhost:3000/tasks/1

# GET non-existent ID
curl http://localhost:3000/tasks/99

# POST — create (valid)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New task", "status": "pending", "priority": "high"}'

# POST — create (invalid — missing fields, should return 400)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Incomplete"}'

# PUT — update
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated report", "status": "completed", "priority": "high"}'

# DELETE
curl -X DELETE http://localhost:3000/tasks/3

# 404 catch-all
curl http://localhost:3000/nonexistent
```

---

## Experiment 13: Git Operations with Your Project

### Terminal Commands
```bash
# Inside your task-api project folder

# Initialize Git
git init

# Create .gitignore
echo "node_modules/" > .gitignore

# Stage all files
git add .

# Initial commit
git commit -m "Initial commit: complete Task API with CRUD, middleware, and validation"

# Create a repo on GitHub, then:
git remote add origin https://github.com/<your-username>/task-api.git
git branch -M main
git push -u origin main

# Make a change — e.g. add a new task to the array:
# (edit index.js, add a 7th task object)

# Stage, commit, push
git add index.js
git commit -m "Add seventh task to initial data"
git push

# View commit history
git log --oneline
```

### Expected `git log` output
```
a1b2c3d Add seventh task to initial data
e4f5g6h Initial commit: complete Task API with CRUD, middleware, and validation
```
