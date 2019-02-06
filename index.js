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
var execPhp = require('exec-php');

app.get('/', (req, res) => {
	fs.readFile('./inc/count.txt',function read(err, data) {
		if (err) {
			throw err;
		}
		content = JSON.parse(data);
		count = content+1

		console.log(count)
		fs.writeFile("./inc/count.txt", count.toString(), function(err) {
			if(err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
	});

	res.sendFile(__dirname + '/index.html');
});


// app.post('/inc/sendEmail.php', (req, res) => {
// 	execPhp('./inc/sendEmail.php', "",function(error, php, outprint){
// 		if(error){
// 			res.send(outprint)
// 		}
// 	});
// });


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
