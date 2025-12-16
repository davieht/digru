const express = require("express");
const fs = require('fs');
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require('path');
const serverOptions = require('./serveroptions');

const app = express();

// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URLs = {
    "oedi": "https://script.google.com/macros/s/AKfycbyn3P_rmtuwk7MoFhpLcyzmnK04PexVZnK6S6QzUuY_ROYyxeknw6NEdtEH-2n_mXwE/exec",
    //"21er": "https://script.google.com/macros/s/AKfycbzxss103pa6KmfZjcdeClo6t3mw5kEgGEpAXKKvgdTKUdl4VP5yti5z1jgg4QA1Fb_i8Q/exec"
};

function vigenereEncode(text, key) {
    const textBytes = new TextEncoder().encode(text);
    const keyBytes = new TextEncoder().encode(key);

    const result = new Uint8Array(textBytes.length);

    for (let i = 0; i < textBytes.length; i++) {
        result[i] = (textBytes[i] + keyBytes[i % keyBytes.length]) % 256;
    }

    // Convert bytes → base64 safely
    let binary = "";
    const chunkSize = 0x8000; // 32KB

    for (let i = 0; i < result.length; i += chunkSize) {
        binary += String.fromCharCode(
            ...result.subarray(i, i + chunkSize)
        );
    }

    return btoa(binary);
}

// Your Vigenère encryption function
function vigenereEncrypt(text, key) {
    key = key.toUpperCase();
    let result = '';
    let j = 0;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];

        if (/[A-Za-z]/.test(c)) {
            const code = text.charCodeAt(i);
            const keyCode = key.charCodeAt(j % key.length) - 65;

            if (code >= 65 && code <= 90) { // A-Z
                result += String.fromCharCode(((code - 65 + keyCode) % 26) + 65);
            } else if (code >= 97 && code <= 122) { // a-z
                result += String.fromCharCode(((code - 97 + keyCode) % 26) + 97);
            }

            j++;
        } else {
            result += c; // non-letters unchanged
        }
    }

    return result;
}

// Middleware
app.use(bodyParser.json());

// REST API Endpoints

app.get("/api/bulletin/", async (req, res) => {
    try {
        log(req);
        const {schoolId, className} = req.query;
        const response = await axios.get(`${GOOGLE_SCRIPT_URLs[schoolId]}?route=bulletin&className=${className}`);
        if (!response.data.success) {
            throw new Error (response.data.error || "Unknown error from Google Script")
        }
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({error: "Error fetching data from Google Script", details: error.message});
    }
});

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

// Serve encrypted JSON
app.get('/api/quiz/xvcjovo/', (req, res) => {
    //const filePath = path.join(__dirname, 'public', 'chapters.json');
    const key = "LEET"; // <-- choose your encryption key

    const json = fs.readFileSync('digiapp/public/quiz/questions.json', 'utf8');
    const encrypted = vigenereEncode(json, key);
    res.type("text/plain").send(encrypted);
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

serverOptions.startServer(app);

//app.listen(PORT, () => {
//    console.log(`Server running on http://localhost:${PORT}`);
//});

//    const options = {
//        key: fs.readFileSync("/etc/letsencrypt/live/digru.at/privkey.pem"),
//        cert: fs.readFileSync("/etc/letsencrypt/live/digru.at/fullchain.pem"),
//    };
//    
//    // Start the server
//    https.createServer(options, app).listen(443, () => {
//      console.log("HTTPS Server running on port 443");
//    });