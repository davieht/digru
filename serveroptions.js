const fs = require('fs');
const https = require("https");

module.exports = {
    startServer: function(app) {
        app.listen(3000, () => {
            console.log(`Server running on http://localhost:${3000}`);
        });
        
//        const options = {
//            key: fs.readFileSync("/etc/letsencrypt/live/digru.at/privkey.pem"),
//            cert: fs.readFileSync("/etc/letsencrypt/live/digru.at/fullchain.pem"),
//        };
//
//        // Start the server
//        https.createServer(options, app).listen(443, () => {
//          console.log("HTTPS Server running on port 443");
//        });
    }
};

