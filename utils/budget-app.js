// module
const fs = require('fs');

const dirPath = "./data";

// function cek saldo
const cekSaldo = (username) =>{
    const wallets = loadwallet();
    return wallets.find((wallet) => wallet.username === username);
}

// mengambil seluruh data wallet
const loadwallet = () => {
    const file = fs.readFileSync('data/wallet.json', 'utf-8');
    const json = JSON.parse(file);
    return json;
}

// mengambil seluruh data income
const loadIncome = () => {
    const file = fs.readFileSync('data/income.json', 'utf-8');
    const json = JSON.parse(file);
    return json;
}

// mengambil seluruh data income
const loadExpense = () => {
    const file = fs.readFileSync('data/expense.json', 'utf-8');
    const json = JSON.parse(file);
    return json;
}

//menambhakan aktivity income
const addActivity = (activity) =>{
    if(activity.kategori === "income"){
        const income = loadIncome();
        income.push(activity);
        saveIncome(income);
    }else{
        const expense = loadExpense();
        expense.push(activity);
        saveExpense(expense);
    }
    updateWallet(activity);
}

// update data activity
const updateActivity = (newActivity => {
    const incomes = loadIncome();
    const expenses = loadExpense();
    const filterActivity1 = incomes.filter((income) => income.id !== newActivity.id);
    const filterActivity2= expenses.filter((expense) => expense.id !== newActivity.id);
    
    if(newActivity.kategori === "income"){
        updateWallet(newActivity);
        delete newActivity.oldData;
        filterActivity1.push(newActivity);
        saveIncome(filterActivity1);
    }else{
        updateWallet(newActivity);
        filterActivity2.push(newActivity);
        saveExpense(filterActivity2);
    }
})

// update data wallet
const updateWallet = (activity => {
    const wallets = loadwallet();
    const saldos = cekSaldo(activity.username);
    // hilangkan wallet lama yang namanya sama denagan username
    const filterActivity = wallets.filter((wallet) => wallet.username !== activity.username);
    var total;
    if(activity.oldData !== undefined){
        // mengecek kategori transaski
        if(activity.kategori === "income"){
            total = (saldos.wallet - parseInt(activity.oldData)) + parseInt(activity.number);
        }else{
            total = (saldos.wallet + parseInt(activity.oldData)) - parseInt(activity.number);
        }
    }else{
        // mengecek kondisi delete
        if(activity.delete === "true"){
            // mengecek kategori transaski
            if(activity.kategori === "income"){
                total = saldos.wallet - parseInt(activity.number);
            }else{
                total = saldos.wallet + parseInt(activity.number);
            }
        }else{
            // mengecek kategori transaski
            if(activity.kategori === "income"){
                total = saldos.wallet + parseInt(activity.number);
            }else{
                total = saldos.wallet - parseInt(activity.number);
            }
        }
        
    }

    const newWallet = {
        "username": activity.username,
        "wallet": total,
    }
    filterActivity.push(newWallet);
    console.log(newWallet)
    saveWallet(filterActivity);
})



// mencari data income sesuai username
const findIncome = (id) =>{
    const incomes = loadIncome();
    return incomes.find((income) => income.id === id);
}

const findListIncome = (username) =>{
    const incomes = loadIncome();
    return incomes.find((income) => income.username === username);
}

const findListExpense = (username) =>{
    const incomes = loadIncome();
    return incomes.find((income) => income.username === username);
}
// menghapus data di file income berdasarkan id
const deleteIncome = (id) => {
    const incomes = loadIncome();
    const dtIncome = findIncome(id);
    dtIncome.delete = "true";
    //mengupdate data saldo
    updateWallet(dtIncome);
    // mencari atau memfilter id yang dikirim
    const filterincome = incomes.filter((income) => income.id !== id);
    saveIncome(filterincome);
}

// meuliskan / menimpa file income.json dengan data yang baru
const saveIncome = (activity) => {
    fs.writeFileSync('data/income.json', JSON.stringify(activity))
}

// mencari data expense.json sesuai username
const findExpese = (id) =>{
    const expenses = loadExpense();
    return expenses.find((expense) => expense.id === id);
}

// menghapus data di file expese.json berdasarkan id
const deleteExpense = (id) => {
    const expenses = loadExpense();
    const dtExpense = findExpese(id);
    dtExpense.delete = "true";
    //mengupdate data saldo
    updateWallet(dtExpense);
    // mencari atau memfilter id yang dikirim
    const filterexpense = expenses.filter((expense) => expense.id !== id);
    saveIncome(filterexpense);
}

// meuliskan / menimpa file expense.json dengan data yang baru
const saveExpense = (activity) => {
    fs.writeFileSync('data/expense.json', JSON.stringify(activity))
}

// meuliskan / menimpa file wallet.json dengan data yang baru
const saveWallet = (activity) => {
    fs.writeFileSync('data/wallet.json', JSON.stringify(activity))
}

// ubah mata uang
const rupiah = (money) => {
    let	number_string = money.toString(),
	sisa 	= number_string.length % 3,
	rupiah 	= number_string.substr(0, sisa),
	ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
		
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    return rupiah;
}

const arrayShort = (array) => {
    array.sort(function(a, b) {
        var keyA = new Date(a.tanggal),
          keyB = new Date(b.tanggal);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

      return array;
}

module.exports = {loadwallet, cekSaldo, rupiah, addActivity, saveIncome,  loadIncome, loadExpense, arrayShort, findIncome, updateActivity, deleteIncome, deleteExpense, findExpese, findListIncome, findListExpense}