const fs = require('fs');
require('log-timestamp');

const highScoresFile = 'C:\\Users\\chris\\AppData\\LocalLow\\Hyperbolic Magnetism\\Beat Saber\\LocalDailyLeaderboards.dat';
// const highScoresFile = 'C:\\Users\\chris\\AppData\\LocalLow\\Hyperbolic Magnetism\\Beat Saber\\LocalLeaderboards.dat';

console.log(`Watching for file changes on ${highScoresFile}`);

let fsWait = false;
fs.watch(highScoresFile, (event, filename) => {
    if (filename) {
        if (fsWait) return;
        fsWait = setTimeout(() => {
            fsWait = false;
        }, 100);
        console.log(`${filename} file Changed`)
        updateHighScores()
    }
});

const path = require('path')
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/dist', express.static(path.join(__dirname, '../dist')))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    updateHighScores()
});







function updateHighScores() {
    let highScores = JSON.parse(fs.readFileSync(highScoresFile));
    let scores = highScores._leaderboardsData.filter(hs => hs._scores.length);
    io.emit('highscores', scores);
}