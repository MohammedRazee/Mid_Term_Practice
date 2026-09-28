# MERN Full Stack Lab — Mid-Term Practice Experiments

**Course:** CSA4604 — MERN Full Stack Lab  
**Purpose:** Hands-on practice exercises to prepare for the Mid-Term Laboratory Examination  
**Instructions:** All code must use ES6 module syntax (`import`/`export`). Set `"type": "module"` in `package.json`.

---

## Experiment 1: Node.js Project Initialization & Basic Express Server

**Objective:** Set up a Node.js project from scratch and create a minimal Express server.

**Requirements:**
- Open the terminal. Check and display the installed versions of Node.js, npm, and Git.
- Create a new project folder called `hello-server` using the CLI.
- Initialize the project using `npm init -y`.
- Configure the project to use ES6 modules (`"type": "module"` in `package.json`).
- Install Express.js as a dependency using npm.
- Create `index.js` with an Express server that:
  - Listens on port **3000**.
  - Has a `GET /` route that responds with the text `"Hello, World!"`.
  - Has a `GET /about` route that responds with `"This is the About page."`.
  - Logs `Server running on http://localhost:3000` to the console on startup.

**Test:** Visit `http://localhost:3000` and `http://localhost:3000/about` in the browser and verify the responses.

---

## Experiment 2: Node.js File System Operations (fs Module)

**Objective:** Use the Node.js `fs` module to read, write, and append files.

**Requirements:**
- Create a new project folder called `file-ops`. Initialize with npm and set `"type": "module"`.
- Create a file called `input.txt` manually with the following content:
  ```
  Node.js makes file operations simple.
  This is the original content.
  ```
- Create `index.js` that performs the following operations **in sequence**:
  - Reads the content of `input.txt` and prints it to the console.
  - Writes that content to a new file called `output.txt`.
  - Appends the line `"\nThis line was appended by Node.js."` to `output.txt`.
  - Reads `output.txt` and prints the final content to the console.
- Use `fs` module with the synchronous methods (`readFileSync`, `writeFileSync`, `appendFileSync`).
- Use `'utf-8'` encoding for all read operations.

**Expected Console Output:**
```
--- Reading input.txt ---
Node.js makes file operations simple.
This is the original content.

--- Final content of output.txt ---
Node.js makes file operations simple.
This is the original content.
This line was appended by Node.js.
```

---

## Experiment 3: Serving Static Files and HTML Pages

**Objective:** Use Express middleware to serve static assets and HTML pages.

**Requirements:**
- Create a new project folder called `static-site`. Initialize with npm, set `"type": "module"`, and install Express.
- Create the following project structure:
  ```
  static-site/
  ├── index.js
  ├── package.json
  ├── public/
  │   └── style.css
  └── templates/
      └── home.html
  ```
- `public/style.css` should contain basic styling (body background color, font family, centered heading).
- `templates/home.html` should be a simple HTML page with a heading "Welcome to Static Site" and a paragraph. It should link to `/style.css` for styling.
- In `index.js`:
  - Use `express.static()` middleware to serve static files from the `public/` directory.
  - Create a `GET /` route that sends `templates/home.html` using `res.sendFile()`. Use `import.meta.url` and the `url` module to resolve the file path.
  - Listen on port **3000**.

**Test:** Visit `http://localhost:3000` — the HTML page should appear with the CSS styling applied.

---

## Experiment 4: In-Memory Data Array & GET All Route

**Objective:** Store data in an in-memory JavaScript array and return it as a JSON response.

**Requirements:**
- Create a new project folder called `task-api`. Initialize with npm, set `"type": "module"`, and install Express.
- In `index.js`, create an in-memory array called `tasks` with at least **5 task objects**. Each task should have:
  - `id` (number)
  - `title` (string)
  - `status` (string — `"pending"` or `"completed"`)
  - `priority` (string — `"low"`, `"medium"`, or `"high"`)
- Set up body-parsing middleware: `express.json()` and `express.urlencoded({ extended: true })`.
- Implement a `GET /tasks` route that returns the entire tasks array as a JSON response with status **200**.
- Listen on port **3000**.

**Test:** Use the browser or a tool like `curl` to access `http://localhost:3000/tasks` — you should see all 5 tasks in JSON format.

---

## Experiment 5: GET by ID Using Route Parameters

**Objective:** Retrieve a single record from the in-memory array using a route parameter.

**Requirements:**
- Continue from Experiment 4 (or create a fresh project with the same `tasks` array).
- Add a `GET /tasks/:id` route that:
  - Reads the `id` from `req.params`.
  - Finds the matching task in the array.
  - If found, responds with the task object and status **200**.
  - If not found, responds with `{ "error": "Task not found" }` and status **404**.

**Test:**
- `GET /tasks/1` → returns the task with id 1.
- `GET /tasks/99` → returns `{ "error": "Task not found" }` with status 404.

---

## Experiment 6: GET with Query String Filtering

**Objective:** Filter records from the in-memory array using query string parameters.

**Requirements:**
- Continue from Experiment 5 (or create a fresh project with the same `tasks` array).
- Add a `GET /tasks/search` route that:
  - Reads `req.query.status` (e.g. `/tasks/search?status=pending`).
  - Filters the tasks array to return only tasks matching that status.
  - If no query parameter is provided, returns all tasks.
  - Responds with the filtered array as JSON with status **200**.

**Important:** Place this route **above** the `GET /tasks/:id` route in your code, and explain why the order matters.

**Test:**
- `GET /tasks/search?status=pending` → returns only pending tasks.
- `GET /tasks/search?status=completed` → returns only completed tasks.
- `GET /tasks/search` → returns all tasks.

---

## Experiment 7: POST Route — Creating New Records

**Objective:** Accept JSON data from the client and add a new record to the in-memory array.

**Requirements:**
- Continue from the previous experiments (or create a fresh project with the same `tasks` array).
- Maintain a `nextId` counter variable (initialized to one more than the highest existing id).
- Add a `POST /tasks` route that:
  - Reads the new task data from `req.body`.
  - Creates a new task object with an auto-assigned `id` using `nextId++`.
  - Pushes it to the `tasks` array.
  - Responds with the newly created task and status **201**.

**Test using curl:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Review notes", "status": "pending", "priority": "high"}'
```
Expected: the new task is returned with an auto-assigned `id`.

---

## Experiment 8: PUT Route — Updating Records

**Objective:** Update an existing record in the in-memory array by ID.

**Requirements:**
- Continue from the previous experiments.
- Add a `PUT /tasks/:id` route that:
  - Finds the task with the matching `id`.
  - If found, updates it with the fields from `req.body` using `Object.assign()`.
  - Responds with the updated task and status **200**.
  - If not found, responds with `{ "error": "Task not found" }` and status **404**.

**Test using curl:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```
Expected: task 1 is updated and the modified task is returned.

---

## Experiment 9: DELETE Route — Removing Records

**Objective:** Remove a record from the in-memory array by ID.

**Requirements:**
- Continue from the previous experiments.
- Add a `DELETE /tasks/:id` route that:
  - Finds the index of the task with the matching `id` using `findIndex()`.
  - If found, removes it from the array using `splice()`.
  - Responds with `{ "message": "Task deleted successfully" }` and status **200**.
  - If not found, responds with `{ "error": "Task not found" }` and status **404**.

**Test using curl:**
```bash
curl -X DELETE http://localhost:3000/tasks/3
```
Expected: task 3 is removed. A subsequent `GET /tasks` should no longer include it.

---

## Experiment 10: Application-Level Middleware — Request Logger

**Objective:** Create a custom middleware function that runs on every incoming request.

**Requirements:**
- Continue from the previous experiments (or create a fresh project with the full CRUD routes).
- Create an **application-level middleware** using `app.use()` that logs the following for every request:
  - HTTP method (e.g. `GET`, `POST`)
  - Request URL (e.g. `/tasks/2`)
  - Timestamp (use `new Date().toISOString()`)
- The middleware must call `next()` to pass control to the next handler.
- Register this middleware **before** all route definitions.
- The log format should be: `[2026-09-28T10:30:00.000Z] GET /tasks`

**Test:** Make several requests (GET, POST, PUT, DELETE) and verify each one prints a log line in the terminal.

---

## Experiment 11: Route-Level Validation Middleware

**Objective:** Create a middleware function that validates required fields on POST and PUT requests before the route handler runs.

**Requirements:**
- Continue from the previous experiments.
- Create a function called `validateTask` that:
  - Checks whether `req.body` contains the required fields: `title`, `status`, and `priority`.
  - If any field is missing, responds with status **400** and a JSON error message:
    `{ "error": "Missing required fields: title, status, priority" }`
  - If all fields are present, calls `next()` to continue to the route handler.
- Attach `validateTask` as a **route-level middleware** on the `POST /tasks` and `PUT /tasks/:id` routes.
  ```js
  app.post("/tasks", validateTask, (req, res) => { ... });
  app.put("/tasks/:id", validateTask, (req, res) => { ... });
  ```

**Test using curl:**
```bash
# Missing fields — should return 400
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Incomplete task"}'

# All fields present — should succeed
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete task", "status": "pending", "priority": "low"}'
```

---

## Experiment 12: 404 Catch-All & Complete REST API

**Objective:** Add a catch-all handler for unmatched routes and combine all concepts into a complete API.

**Requirements:**
- Continue from the previous experiments. Your final `index.js` should now include **all** of the following:
  1. `express.json()` and `express.urlencoded()` body-parsing middleware.
  2. An application-level **request logger** middleware.
  3. A `validateTask` **route-level validation** middleware on POST and PUT.
  4. A `GET /tasks` route — returns all tasks.
  5. A `GET /tasks/search` route — filters by status via query string.
  6. A `GET /tasks/:id` route — returns one task by ID (404 if not found).
  7. A `POST /tasks` route — creates a new task (with validation).
  8. A `PUT /tasks/:id` route — updates a task by ID (with validation, 404 if not found).
  9. A `DELETE /tasks/:id` route — removes a task by ID (404 if not found).
  10. A **404 catch-all** middleware at the very end (after all routes) that responds with:
      `{ "error": "Route not found" }` and status **404**.

- Initialize your data with at least **6 task objects** across 2+ statuses.
- Use proper HTTP status codes: **200** (success), **201** (created), **400** (bad request), **404** (not found).

**Test:** Verify every route works correctly, and that visiting a non-existent URL like `/xyz` returns the 404 catch-all response.

---

## Experiment 13: Git Operations with Your Project

**Objective:** Initialize a Git repository, make commits, and push to GitHub.

**Requirements:**
- Using the completed project from Experiment 12:
  - Initialize a Git repository: `git init`
  - Create a `.gitignore` file that excludes `node_modules/`.
  - Stage all files: `git add .`
  - Make an initial commit: `git commit -m "Initial commit: complete Task API"`
  - Create a repository on GitHub.
  - Add the remote: `git remote add origin <your-repo-url>`
  - Push to GitHub: `git push -u origin main`
- Make a small change to the code (e.g. add a new initial task to the array).
  - Stage, commit with a descriptive message, and push again.
- Demonstrate `git log` to show the commit history.

**Deliverable:** A working GitHub repository URL with at least 2 commits.
