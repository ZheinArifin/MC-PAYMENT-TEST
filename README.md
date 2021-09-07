## Panduan Menggunakan Aplikasi MC PAYMENT TEST
#### A.	Cara Menjalankan App
- Aplikasi menggunakan node.js, untuk menjalankan aplikasi jalankan terminal, lalu masuk folder aplikasi, ketikan :
```sh
node app
```
- Setelah itu buka browser lalu ketikan 
```sh
localhost:5000
```
- Dalam 2 aplikasi tersebut terdapat 2 menu utama yaitu menu untuk ke halaman test logic dan menu untuk ke halaman test budget app.
- jika belum memiliki node bisa install [NodeJs](https://nodejs.org/en/download).
##### AKUN APP
| username | Password |
| ------ | ------ |
| arifin | arifin123 | 
| zhein | zhein123| 

#### B.	Keterangan File – File Inti
##### 1. Two Sums
Berikut adalah posisi file – file dari test Two Sums:
| Jenis File | Folder/File |
| ------ | ------ |
| Views | views/two-sums.ejs| 
| Views | views/layout/main-twosums.ejs| 
| Proses| utils/ two-sums.js| 

##### 2. Budget App
Berikut adalah posisi file – file dari test Budget App:
| Kategori File | Jenis File | Folder/File |
| ------ | ------ | ------ |
| Login	| Views	| views/login.ejs| 
| Login	| Views | 	views/main-login.ejs | 
| Login	| Route | 	app.js | 
| Login	| Proses |  	utils/register.js | 
| Register | 	Views | 	views/register.ejs | 
| Register |	Views | views/ main-login.ejs | 
| Register |	Route | app.js | 
| Register |	Proses | utils/register.js | 
| Dashboard | Views | views/dashboard.ejs | 
| Dashboard |	Views | views/main-app.ejs | 
| Dashboard |	Route | app.js | 
| Dashboard |	Proses | utils/budget-app.js | 
| Wallet | Views |	views/my-wallet.ejs | 
| Wallet | Views | views/main-app.ejs | 
| Wallet | Route | app.js | 
| Wallet | Proses | utils/budget-app.js | 
| Activity | Views | views/activity.ejs | 
| Activity | Views | views/main-app.ejs | 
| Activity | Route | app.js | 
| Activity | Proses | utils/budget-app.js | 
| Logout | Views | 	views/activity.ejs | 
| Logout | Route | 	app.js | 
