// module
const fs = require('fs');

// Membuat folder jika belum ada
const dirPath = "./data";
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

// membuat file jika belum ada
const filePath = "./data/account.json";
const fileWallet = "./data/wallet.json";
if(!fs.existsSync(filePath) || !fs.existsSync(fileWallet)){
    fs.writeFileSync(filePath,'[]', 'utf-8');
    fs.writeFileSync(fileWallet,'[]', 'utf-8');
    fs.writeFileSync('data/income.json', `[]`, 'utf-8');
    fs.writeFileSync('data/expense.json', `[]`, 'utf-8');
}

// cari akun berdasarkan nama
const findAccount = (nama, pass) =>{
    const accounts = loadAccount()
    const account = accounts.find(
        (account) => account.username === nama && account.password == pass
    );
    return account
} 

// meuliskan / menimpa file account.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/account.json', JSON.stringify(contacts))
}

//menambhakan akun baru
const addAccount = (contact) =>{
    
    const newWallet = {
        "username": contact.username,
        "wallet": 0,
    }
    const wallets = loadWallet();
    wallets.push(newWallet);
    console.log(contact)
    fs.writeFileSync('data/wallet.json', JSON.stringify(wallets))
    const contacts = loadAccount();
    contacts.push(contact);
    saveContacts(contacts);
}

// mengecek data akun yang duplikat
const cekDuplikat = (nama) =>{
    const contacts = loadAccount();
    return contacts.find((contact) => contact.username.toLowerCase() === nama.toLowerCase());
}

// mengambil seluruh data akun
const loadAccount = () => {
    const file = fs.readFileSync('data/account.json', 'utf-8');
    const json = JSON.parse(file);
    return json;
}

//mengambil seluruh data wallet
const loadWallet = () => {
    const file = fs.readFileSync('data/wallet.json', 'utf-8');
    const json = JSON.parse(file);
    return json;
}

module.exports = {loadAccount, findAccount, addAccount, cekDuplikat}
