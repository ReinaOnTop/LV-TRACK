const express = require("express");
const app = express();

const counts = {
  GET: 0,
  POST: 0,
  PUT: 0,
  DELETE: 0,
  PATCH: 0,
  OTHER: 0
};

app.use((req, res, next) => {
  if (req.path === "/stats") return next();

  if (counts[req.method] !== undefined) {
    counts[req.method]++;
  } else {
    counts.OTHER++;
  }
  next();
});

app.get("/stats", (req, res) => {
  res.json(counts);
});

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Request Counter</title>
  <style>
    body { font-family: monospace; background:#111; color:#0f0; }
    h1 { margin-bottom: 10px; }
    pre { font-size: 16px; }
  </style>
</head>
<body>
  <h1>Live Request Counter</h1>
  <pre id="output">Loading...</pre>

  <script>
    async function update() {
      const res = await fetch("/stats");
      const data = await res.json();
      document.getElementById("output").textContent =
        JSON.stringify(data, null, 2);
    }

    update();
    setInterval(update, 1000); // auto-update every 1s
  </script>
</body>
</html>
  `);
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
