const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: true});

app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());

app.use('/css', express.static('css'));
app.use('/fonts', express.static('fonts'));
app.use('/images', express.static('images'));
app.use('/inc', express.static('inc'));
app.use('/js', express.static('js'));


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});


if (fs.existsSync('certs/server.crt') && fs.existsSync('certs/server.key')) {
	const certificate = fs.readFileSync('certs/server.crt').toString();
	const privateKey = fs.readFileSync('certs/server.key').toString();
	const options = {key: privateKey, cert: certificate};

	var server = https.createServer(options, app).listen(process.env.PORT || 5000);
	console.log(`Example app listening on port ${process.env.PORT || 5000} using HTTPS`);
} else {
	var server = http.createServer(app).listen(process.env.PORT || 5000);
	console.log(`Example app listening on port ${process.env.PORT || 5000}`);
}
