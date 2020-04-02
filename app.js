const express = require('express');
//const ejs = require('ejs');
const bp = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');

var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

var multer = require('multer');
var storage = multer.memoryStorage(); // resim yüklemek için eklendi.
var upload = multer({ storage: storage }); // resim yüklemek için eklendi.

const port = 443;
const login = require('./loginOperations');
app.use(
  session({
    secret: 'Özel-Anahtar',
    resave: false,
    saveUninitialized: true
  })
);

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));

app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: false }));
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/oturumac', login.UyeOl);
app.post('/oturumac', login.userUyeOl);

app.get('/UnutmaOncesi', function(req, res) {
  res.render('unutmaoncesi');
});

app.get('/Login', login.KullaniciLogin);

app.post('/Login', login.kullaniciGiris);

app.get('/Anasayfa', function(req, res) {
  res.render('Anasayfa');
});

app.get('/restaurantuye', login.PatronLogin);
app.post('/restaurantuye', upload.single('İmageUpload'), login.userMekanUye);

app.get('/Profilim', login.Profile);
app.get('/mekanSahibiProfili', login.MekanProfile);
app.post('/mekanSahibiProfili', login.MekanGuncelle);
//app.post(userUyeOl);

app.get('/mekanlogin', login.PatronGiris);
app.post('/mekan', login.mekanGiris);

app.get('/mekanLogin', function(req, res) {
  res.render('mekanLogin');
});

app.get('/hamburger', login.hamburger);

app.listen(port, () => console.log(`Port Çalışıyor :  ${port}!`));
