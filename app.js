// module
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const TwoSums = require('./utils/two-sums');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const { addAccount, cekDuplikat, loadAccount, findAccount} = require('./utils/register')

const app = express();
const port = 5000;

app.set('view engine', 'ejs');
// konfigurasi ejs layouts
app.use(expressLayouts);

// konsigurasi route ke public
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//konfigurasi sessions
app.use(cookieParser('secret'));
app.use(session({
  secret: 'Keep it secret',
  resave: true,
  name:'uniqueSessionID',
  saveUnitialized: false,
  })
);
app.use(flash());

app.use(function(req, res, next) {
    res.locals.username = req.session.username;
    next();
  });

app.get('/', (req, res) =>{
    res.render('index',{
        layout: 'layout/main',
        title: "Halaman Home",
    })
});

// proses mencari nilatwo sums
app.get('/two-sums/:kode/:target/:array', (req, res) =>{
    const hasil = TwoSums(JSON.parse(req.params.array), parseInt(req.params.target));
    console.log(req.params.kode);
    if(req.params.kode.toString() === "example1"){
        req.flash('ket1',`Output: Because nums[${hasil[0]}] + nums[${hasil[1]}] == ${req.params.target}`);
        req.flash('hasil1',`Output: [${hasil}]`);
        console.log("ad")
    }else if(req.params.kode === "example2"){
        req.flash('ket2',`Output: Because nums[${hasil[0]}] + nums[${hasil[1]}] == ${req.params.target}`);
        req.flash('hasil2',`Output: [${hasil}]`);
    }else{
        req.flash('ket3',`Output: Because nums[${hasil[0]}] + nums[${hasil[1]}] == ${req.params.target}`);
        req.flash('hasil3',`Output: [${hasil}]`);
    }
        res.redirect('/two-sums');
});

// halaman two sums
app.get('/two-sums', (req, res) =>{
    
    res.render('two-sums',{
        layout: 'layout/main-twosums',
        title: "Halaman Two Sums",
        hasil1: req.flash('hasil1'),
        ket1: req.flash('ket1'),
        hasil2: req.flash('hasil2'),
        ket2: req.flash('ket2'),
        hasil3: req.flash('hasil3'),
        ket3: req.flash('ket3'),
    })
});

// halaman login
app.get('/login', (req,res) =>{
    if(req.session.login ){
        res.redirect('/dashboard');
    }else{
        res.render('login', {
            layout: 'layout/main-login',
            title: "Login",
            ket: req.flash('ket'),
            msg: req.flash('msg'),
        });
    }
});

// proses login
app.post('/login',  (req, res) => {
    const contact = findAccount(req.body.username, req.body.password)
    if(contact){
        var msg = "Login Berhasil!";
        var ket = "Selamat anda berhasil login kedalam sistem";
        req.session.login = true;
        req.session.username = contact.username;
        var hour = 3600000
        req.session.cookie.expires = new Date(Date.now() + hour)
        req.session.cookie.maxAge = 100 * hour

        console.log(req.session)
        req.flash('msg',msg);
        req.flash('ket',ket);
        res.redirect('/dashboard');
    }else{
        console.log('gagal')
        var msg = "Login Gagal!";
        var ket = "Username atau password yang anda masukan salah";
        req.flash('msg',msg);
        req.flash('ket',ket);
        res.redirect('/login');
    }
   
})

// halaman registrasi
app.get('/register', (req,res) =>{
    res.render('register', {
        layout: 'layout/main-login',
        title: "Registrasi",
        msg: req.flash('messege'),
    });
});

// proses registrasi
app.post('/register', [
    body('username').custom((value) => {
        const duplikat = cekDuplikat(value);
        if(duplikat){
          throw new Error('Username Sudah Terdaftar');
        }
        return true;
    }),
  ], 
  (req, res) => {
    
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error)

      // kirim error ke form tambah data
      res.render('register', {
        title: 'Registrasi',
        layout: 'layout/main-login',
        error: error.array(),
        msg: "",
      })
    }else{
      addAccount(req.body);
      // kirimkan flash message
      req.flash('messege','Akun Berhasil Ditambahkan');
      res.redirect('/register');
    }
    
});

// halaman dashboard
app.get('/dashboard',(req, res) =>{
    console.log(req.session)
    console.log(req.session.username)
    res.render('dashboard', {
        layout: 'layout/main-app',
        title: "Dashboard",
        msg: req.flash('msg')
    });
})


app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 NOT FOUND</h1>');
})

app.listen(port, () => {
    console.log(`server localhost:${port}`);
});