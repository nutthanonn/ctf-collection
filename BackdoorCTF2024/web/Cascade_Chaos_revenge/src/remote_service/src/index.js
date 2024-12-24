const express = require("express");
const bodyParser = require('body-parser');
const showdown = require('showdown');
const path = require("path");
const childProcess = require('child_process');
const rateLimit = require("express-rate-limit"); 

const app = express();
const BASEURL = "http://localhost:4001"
const SECRET_TOKEN = process.env.SECRET_TOKEN

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const converter = new showdown.Converter();
converter.setOption('simplifiedAutoLink', true);

const visitLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5,
    message: "Too many requests, please try again after a minute."
});

app.get('/', async (req, res) => {
    res.render('index', {
        title: "Welcome"
    });
});

app.get("/convert", (req, res) => {
    let content = req.query.content ? req.query.content : "";
    let heading = req.query.heading ? req.query.heading : "";
    content = converter.makeHtml(content);
    res.render('markdown', {
        title: "Markdown renderer",
        heading: encodeURIComponent(heading),
        body: encodeURIComponent(content)
    });
});


app.post("/visit", visitLimiter, (req, res) => { 
    try {
        let heading = req.body.heading
        let content = req.body.content
        if (content == undefined) {
            return res.status(200).send("Body is not provided")
        }
        const toReq = `${BASEURL}/convert?heading=${encodeURIComponent(heading)}&content=${encodeURIComponent(content)}`;
        const args = JSON.stringify({ url: toReq, cookie: SECRET_TOKEN });
        childProcess.spawn('node', ['./src/bot.js', args], { stdio: 'inherit' });
        console.log(args)
        return res.status(200).send("Admin will check!")
    } catch (e) {
        return res.status(500).send(e.message)
    }
})

app.listen(4001, () => {
    console.log("Server running on http://0.0.0.0:4001");
});
