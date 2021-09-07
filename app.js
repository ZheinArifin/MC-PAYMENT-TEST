// module
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const TwoSums = require('./utils/two-sums');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const { addAccount, cekDuplikat, loadAccount, findAccount} = require('./utils/register')
const {loadWallet, cekSaldo, rupiah, addActivity,   loadIncome, loadExpense, arrayShort, findIncome, updateActivity, deleteIncome, findExpese, deleteExpense, findListIncome, findListExpense} = require('./utils/budget-app');
const moment = require('moment');
const Chart = require('chart.js');
const e = require('connect-flash');



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
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
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

app.get('/logout', (req,res) => {
    req.session.destroy()
    res.redirect('/login')
});


// proses mencari nilatwo sums
app.get('/two-sums/:kode/:target/:array', (req, res) =>{
    const hasil = TwoSums(JSON.parse(req.params.array), parseInt(req.params.target));
    console.log(req.params.kode);
    if(req.params.kode.toString() === "example1"){
        req.flash('ket1',`Output: Because nums[${hasil[0]}] + nums[${hasil[1]}] == ${req.params.target}`);
        req.flash('hasil1',`Output: [${hasil}]`);
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
        req.session.nama_lengkap = contact.nama_lengkap;
        var hour = 3600000
        req.session.cookie.expires = new Date(Date.now() + hour)
        req.session.cookie.maxAge = 100 * hour

        // console.log(req.session)
        req.flash('msg',msg);
        req.flash('ket',ket);
        res.redirect('/dashboard');
    }else{
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
    if(req.session.login ){
    const saldo = cekSaldo(req.session.username);
    // mengambil data income & expense 
    const expense = loadExpense();
    const income = loadIncome();
    // proses penggabungan 2 object
    var x1 = JSON.stringify(expense).substr(1);
    var x2 = JSON.stringify(expense).substr(1, x1.length - 1);
    var i1 = JSON.stringify(income).substr(1);
    var i2 = JSON.stringify(income).substr(1, i1.length - 1);
    const incomeIdr = [];
    const expenseIdr = [];
    let saldoExpense = 0;
    let saldoIncome = 0;
    let saldoTotal = 0;

    var dataHistory = "["+x2 +","+ i2+"]";
    // menampung semua aktivitas pendapatan dan pengeluaran ke daman variable history
    const history = arrayShort(JSON.parse(dataHistory));
    
    
    // melakukan looping aktivitas pengeluaran untuk mendapatkan total pendapatan
    expense.forEach(element => {
        if(element.username === req.session.username){
            expenseIdr.push(element.number)
            saldoExpense +=  parseInt(element.number);
        }
    });
    // melakukan looping aktivitas pengeluaran untukmendapatkan total pengeluaran
    income.forEach(element => {
        if(element.username === req.session.username){
            incomeIdr.push(element.number)
            saldoIncome +=  parseInt(element.number);
        }
    });

    res.render('dashboard', {
        layout: 'layout/main-app',
        title: "Dashboard",
        msg: req.flash('msg'),
        saldo,
        username: req.session.username,
        nama: req.session.nama_lengkap,
        saldoTotal,
        saldoExpense,
        nilai:"["+saldoIncome+","+saldoExpense+"]",
        label:"['Income:"+saldoIncome+"%','Expense:"+saldoExpense+"%']",
        history,
        rupiah,
        active:"dashboard",
    });
    }else{
        res.render('login', {
            layout: 'layout/main-login',
            title: "Login",
            ket: req.flash('ket'),
            msg: req.flash('msg'),
        });
    }
})

// halaman transaksi
app.get('/activity',(req, res) =>{
    
    if(req.session.login ){
    const saldo = cekSaldo(req.session.username);
    const income = arrayShort(loadIncome());
    const expense = arrayShort(loadExpense());
    
    res.render('activity', {
        layout: 'layout/main-app',
        title: "activity",
        messege: req.flash('messege'),
        ket: req.flash('ket'),
        saldo,
        income,
        username: req.session.username,
        nama_lengkap: req.session.nama_lengkap,
        moment: moment,
        expense,
        active:"activity",
        rupiah,
        oreder: req.flash('oreder'),
    });
    }else{
        res.render('login', {
            layout: 'layout/main-login',
            title: "Login",
            ket: req.flash('ket'),
            msg: req.flash('msg'),
        });
    }
});

// proses penyimpanan transaski
app.post('/activity',(req, res) =>{
    // const saldo = cekSaldo(req.body.username);
    // if(req.body.kategori === "expense"){
    //     req.flash('messege','Saldo anda saat ini Rp.'+rupiah(saldo.wallet)+' , tidak bisa melakukan penambahan data untuk pengeluaran');
    //     req.flash('ket','warning');
    // }else {
        addActivity(req.body);
        req.flash('messege','Data aktivitas berhasil disimpan');
        req.flash('ket','success');
    // }
    res.redirect('/activity');
});

app.post('/activity/update',(req, res) =>{
        updateActivity(req.body);
        req.flash('messege','Data aktivitas berhasil Diperbaharui!');
        req.flash('ket','success');
        res.redirect('/activity');
})

app.get('/wallet',(req, res) =>{
    if(req.session.login ){
    
    const saldo = cekSaldo(req.session.username);
    // mengambil data income & expense 
    const expense = loadExpense();
    const income = loadIncome();
    var expenseIdr = [];
    var expenseCategory = [];
    var incomeIdr = [];
    var incomeCategory = [];
    let saldoExpense = 0;
    let saldoIncome = 0;
    // proses penggabungan 2 object
    var x1 = JSON.stringify(expense).substr(1);
    var x2 = JSON.stringify(expense).substr(1, x1.length - 1);
    var i1 = JSON.stringify(income).substr(1);
    var i2 = JSON.stringify(income).substr(1, i1.length - 1);
    
    var dataHistory = "["+x2 +","+ i2+"]";
    // menampung semua aktivitas pendapatan dan pengeluaran ke daman variable history
    const history = arrayShort(JSON.parse(dataHistory));

    var j = 0;
    var i = 0;
    // melakukan looping aktivitas pengeluaran untuk mengmbil nominal dan kategori pengeluaran
    expense.forEach(element => {
        if(element.username === req.session.username){
            if(expenseCategory.includes(element.catatan) === false){
                expenseIdr.push(element.number)
                expenseCategory.push(element.catatan)
            }else{
                const vl = parseInt(expenseIdr[i - 1]) + parseInt(element.number);
                expenseIdr[i - 1] = vl;
            }
            j++;
            saldoExpense +=  parseInt(element.number);
        }
    });
    // melakukan looping aktivitas pengeluaran untuk mengmbil nominal dan kategori pengeluaran
    income.forEach(element => {
        if(element.username === req.session.username){
            //Mengecek jika data sudah ada dalam array
            if(incomeCategory.includes(element.catatan) === false){
                incomeCategory.push(element.catatan)
                incomeIdr.push(element.number)
            }else{
                const vl = parseInt(incomeIdr[i - 1]) + parseInt(element.number);
                incomeIdr[i - 1] = vl;
            }
            saldoIncome +=  parseInt(element.number);
            i++;
        }
    });
   
    saldoExpense = "Total Pengeluaran: Rp. "+rupiah(saldoExpense);
    saldoIncome = "Total Pendapatan: Rp. "+rupiah(saldoIncome);
    // console.log(req.session)
    // console.log(req.session.username)
    res.render('my-wallet', {
        layout: 'layout/main-app',
        title: "Wallte",
        saldo,
        rupiah,
        msg: req.flash('msg'),
        incomeIdr,
        username: req.session.username,
        nama: req.session.nama_lengkap,
        incomeCategory, 
        expenseIdr,
        expenseCategory, 
        saldoExpense,
        saldoIncome,
        history,
        active:"wallet"
    });
    }else{
        res.render('login', {
            layout: 'layout/main-login',
            title: "Login",
            ket: req.flash('ket'),
            msg: req.flash('msg'),
        });
    }
})


// income edit
app.get('/income/:id', (req,res) => {
    console.log(req.params.id);
    const data = findIncome(req.params.id);
    // console.log(data);
    res.send(data);
});

// income delete
app.get('/income/delete/:id', (req,res) => {
    // console.log(req.params.id);
    deleteIncome(req.params.id);
    req.flash('messege','Data aktivitas berhasil Dihapus!');
    req.flash('ket','success');
    res.redirect('/activity');
});

// income edit
app.get('/expense/:id', (req,res) => {
    console.log(req.params.id);
    const data = findExpese(req.params.id);
    // console.log(data);
    res.send(data);
});

// income delete
app.get('/expense/delete/:id', (req,res) => {
    deleteExpense(req.params.id);
    req.flash('messege','Data aktivitas berhasil Dihapus!');
    req.flash('ket','success');
    res.redirect('/activity');
});


app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 NOT FOUND</h1>');
})

app.listen(port, () => {
    console.log(`server localhost:${port}`);
});