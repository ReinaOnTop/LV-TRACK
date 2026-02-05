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
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Request Monitor</title>

<style>
  body {
    background: #050505;
    color: #00ff9d;
    font-family: Consolas, Monaco, monospace;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
  }

  .terminal {
    max-width: 900px;
    margin: auto;
    border: 1px solid #00ff9d;
    box-shadow: 0 0 25px rgba(0,255,157,0.3);
  }

  .terminal-header {
    background: #0a0a0a;
    padding: 10px;
    border-bottom: 1px solid #00ff9d;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dots span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .red { background: #ff5f56; }
  .yellow { background: #ffbd2e; }
  .green { background: #27c93f; }

  .terminal-body {
    padding: 20px;
    background: #020202;
  }

  .title {
    text-align: center;
    margin-bottom: 15px;
    font-size: 20px;
    letter-spacing: 2px;
  }

  pre {
    background: #000;
    padding: 15px;
    border-left: 4px solid #00ff9d;
    color: #7dffcb;
    overflow-x: auto;
    line-height: 1.6;
  }

  .status {
    margin-top: 10px;
    font-size: 13px;
    color: #66ffcc;
  }

  .blink {
    animation: blink 1s steps(2, start) infinite;
  }

  @keyframes blink {
    to { visibility: hidden; }
  }
</style>
</head>

<body>
  <div class="terminal">
    <div class="terminal-header">
      <div class="dots">
        <span class="red"></span>
        <span class="yellow"></span>
        <span class="green"></span>
      </div>
      <div>root@request-monitor</div>
    </div>

    <div class="terminal-body">
      <div class="title">LIVE REQUEST COUNTER</div>

      <pre id="output">Initializing monitor...</pre>

      <div class="status">
        status: <span class="blink">█</span>
        last update: <span id="time">--:--:--</span>
      </div>
    </div>
  </div>

<script>
  function formatTime(d) {
    return d.toLocaleTimeString();
  }

  async function update() {
    try {
      const res = await fetch('/stats');
      const data = await res.json();

      document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);

      document.getElementById('time').textContent =
        formatTime(new Date());

    } catch (e) {
      document.getElementById('output').textContent =
        'Connection lost... retrying';
    }
  }

  update();
  setInterval(update, 1000);
</script>
</body>
</html>
  `);
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
