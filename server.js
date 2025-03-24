const https = require("https");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URLs = {
    "oedi": "https://script.google.com/macros/s/AKfycby8il1TZFhPqQPZWnEZ7w_XkgUiSppU8RM9ezsuEzHoClA6Rt1WkrVVcKqwr3Z5NcE/exec",
    "21er": "https://script.google.com/macros/s/AKfycbzxss103pa6KmfZjcdeClo6t3mw5kEgGEpAXKKvgdTKUdl4VP5yti5z1jgg4QA1Fb_i8Q/exec"
};

// Middleware
app.use(bodyParser.json());

// REST API Endpoints

app.get("/api/class/", async (req, res) => {
   try {
        log(req);
        const {schoolId, className} = req.query; // Access the route parameter
        const response = await axios.get(`${GOOGLE_SCRIPT_URLs[schoolId]}?route=class&className=${className}`);
        if (!response.data.success) {
            throw new Error(response.data.error || "Unknown error from Google Script");
        }
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({error: "Error fetching data from Google Script", details: error.message});
    }
});

// GET Endpoint
app.get("/api/chapters/", async (req, res) => {
    try {
        log(req);
        const {schoolId, className} = req.query; // Access the route parameter
        const response = await axios.get(`${GOOGLE_SCRIPT_URLs[schoolId]}?route=chapters&className=${className}`);
        if (!response.data.success) {
            throw new Error(response.data.error || "Unknown error from Google Script");
        }
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({error: "Error fetching data from Google Script", details: error.message});
    }
});

app.get("/api/user/", async (req, res) => {
    try {
        log(req);
        const {schoolId, className, hash} = req.query; // Access the route parameter
        if (hash === "4pfel$trudelM1tV4nille$osse") {
            res.json({schoolId: schoolId, className: className, hash: hash, isTeacher: true});
            return;
        }
        const response = await axios.get(`${GOOGLE_SCRIPT_URLs[schoolId]}?route=user&className=${className}&hash=${hash}`);
        if (!response.data.success) {
            throw new Error(response.data.error || "Unknown error from Google Script");
        }
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({error: "Error fetching data from Google Script", details: error.message});
        console.error(error);
    }
});

// POST Endpoint
app.post("/api/feedback/", async (req, res) => {
    try {
        log(req);
        const {schoolId, className, hash, action} = req.body;
        const body = {
            route: "feedback",
            className: className,
            hash: hash,
            feedback: action
        };
        const response = await axios.post(GOOGLE_SCRIPT_URLs[schoolId], body);
        if (!response.data.success) {
            throw new Error(response.data.error || "Unknown error from Google Script");
        }
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({error: "Error posting data to Google Script", details: error.message});
        console.error(error);
    }
});

app.post("/api/login/", async (req, res) => {
    try {
        log(req);
        const {schoolId, className, token} = req.body;
        const body = {
            route: "login",
            className: className,
            token: token
        };
        const response = await axios.post(GOOGLE_SCRIPT_URLs[schoolId], body);
        if (!response.data.success) {
            throw new Error(response.data.error || "Unknown error from Google Script");
        }
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({error: "Error posting data to Google Script", details: error.message});
        console.error(error);
    }
});

app.post("/api/quiz/", async (req, res) => {
    try {
        log(req);
        const {schoolId, className, hash, quizId, score, total} = req.body;
        const body = {
            route: "quiz",
            className: className,
            hash: hash,
            quizId: quizId,
            score: score,
            total: total
        };
        const response = await axios.post(GOOGLE_SCRIPT_URLs[schoolId], body);
        if (!response.data.success) {
            throw new Error(response.data.error || "Unknown error from Google Script");
        }
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({error: "Error posting data to Google Script", details: error.message});
    }
});

function log(req) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url.split("?")[0]} from ${req.ip}\n`;
    fs.appendFile('requests.log', logMessage, (err) => {
        if (err)
            console.error('Error writing to log file:', err);
    });
    console.log(logMessage.trim());
}

// Middleware to log requests
//app.use('/routes', (req, res, next) => {
//    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}\n`;
//    fs.appendFile('requests.log', logMessage, (err) => {
//        if (err)
//            console.error('Error writing to log file:', err);
//    });
//    console.log(logMessage.trim());
//    next();
//});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on localhost
//app.listen(PORT, () => {
//    console.log(`Server running on http://localhost:${PORT}`);
//});

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/digru.at/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/digru.at/fullchain.pem"),
};

// Start the server
https.createServer(options, app).listen(443, () => {
  console.log("HTTPS Server running on port 443");
});