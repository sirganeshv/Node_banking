const addon = require('./build/Release/bankaddon');
var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

var http = require("http");

permittedLinker = ['localhost:8080', '127.0.0.1:8080', '172.24.121.91'];  // who can link here?

app.use(function(req, res, next) {
	var i=0, notFound=1, referer=req.get('Referer');
	if ((req.path==='/') || (req.path==='')) return next(); // pass calls to '/' always
	if (referer){
		while ((i<permittedLinker.length) && notFound){
			notFound= (referer.indexOf(permittedLinker[i])===-1);
			i++;
		}
	}
	if (notFound) { 
		res.redirect("/");
	}
	else {
		next(); // access is permitted, go to the next step in the ordinary routing
	}
});


app.get('/',function(req,resp) {
	fs.readFile("login.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});


app.post('/login', function(req, res) {
	var logged = addon.login(req.body.id,req.body.pass);
	if(logged === "true")
		res.redirect("/home");
	else
		res.redirect("/");
	//res.end();
});

app.get('/home',function(req,resp) {
	fs.readFile("home.html", function (error, pgResp) {
			//resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});


app.get('/add_customer',function(req,resp) {
	fs.readFile("addAccount.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/add_customer', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	console.log("going to insert");
	res.write("writing customer data");
	addon.add_account(req.body.name,req.body.age,req.body.phone,req.body.address,req.body.passphrase,req.body.security_qn,req.body.security_ans);
	res.end();
});


app.get('/add_operator',function(req,resp) {
	fs.readFile("add_operator.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/add_operator', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	console.log("going to insert");
	res.write("Creating operator");
	addon.add_operator(req.body.name,req.body.id,req.body.pass,req.body.is_admin);
	res.end();
});

app.get('/update_customer',function(req,resp) {
	fs.readFile("update_details.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/update_customer', function(req, res) {
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account number");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		addon.update_account(req.body.acc_no,req.body.details,req.body.phone,req.body.address);
		res.write("Updated");
		res.end();
	}
});


app.get('/delete_account',function(req,resp) {
	fs.readFile("delete_account.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});


app.post('/delete_account', function(req, res) {
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account number");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Deleted");
		addon.delete_account(req.body.acc_no,req.body.operator_password);
		res.end();
	}
});



app.get('/display',function(req,resp) {
	fs.readFile("display.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});


app.post('/display', function(req, res) {
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("false");
		res.end();
	}
	else {
		var data =  addon.display(req.body.acc_no);
		res.send(data);
	}
});


app.get('/display_all',function(req,resp) {
	fs.readFile("display_all.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/display_all', function(req, res) {
	var data =  addon.display_all();
	res.send(data);
});


app.get('/deposit',function(req,resp) {
	fs.readFile("deposit.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/deposit', function(req, res) {
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account Number");
		res.end();
	}
	else if(req.body.money <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Enter valid amount");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Deposited");
		addon.deposit(req.body.acc_no,req.body.money);
		res.end();
	}
});

app.get('/withdraw',function(req,resp) {
	fs.readFile("withdraw.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/withdraw', function(req, res) {
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account Number");
		res.end();
	}
	else if(req.body.money <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Enter valid amount");
		res.end();
	}
	else if(addon.is_passphrase_valid(req.body.acc_no,req.body.customer_passphrase) === 'false') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid passphrase");
		res.end();
	}
	else if (addon.is_operator_password_correct(req.body.operator_password) === 'false' ) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Operator password wrong");
		res.end();
	}
	else if(addon.is_max_transactions_reached(req.body.acc_no) === 'true') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Maximum number of transactions reached");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Withdrawn");
		addon.withdraw(req.body.acc_no,req.body.money,req.body.customer_passphrase,req.body.operator_password);
		res.end();
	}
});

app.get('/transfer',function(req,resp) {
	fs.readFile("transfer.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/transfer', function(req, res) {
	var is_valid = addon.is_valid_account(req.body.withdraw_acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account Number");
		res.end();
	}
	else if(req.body.money <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Enter valid amount");
		res.end();
	}
	else if(addon.is_max_transactions_reached(req.body.withdraw_acc_no) === 'true') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Maximum number of transactions reached");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Transfered");
		addon.transfer_money(req.body.withdraw_acc_no,req.body.money,req.body.phone_no);
		res.end();
	}
});


app.get('/schedule_transfer',function(req,resp) {
	fs.readFile("schedule_transfer.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/schedule_transfer', function(req, res) {
	var hour = req.body.hour;
	var min = req.body.min;
	if(req.body.acc_no === req.body.withdraw_acc_no) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("You cannot send money to yourself");
		res.end();
	}
	else if(req.body.money <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Enter valid amount");
		res.end();
	}
	else if(addon.is_valid_account(req.body.withdraw_acc_no) === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account Number");
		res.end();
	}
	else if(addon.is_valid_account(req.body.acc_no) === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Reciever Account Number");
		res.end();
	}
	else if(hour < 0 || hour >= 24 || min < 0 || min >= 60) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Time");
		res.end();
	}
	else if(addon.is_passphrase_valid(req.body.withdraw_acc_no,req.body.customer_passphrase) === 'false') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid passphrase");
		res.end();
	}
	else if (addon.is_operator_password_correct(req.body.operator_password) === 'false' ) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Operator password wrong");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Scheduled");
		addon.schedule_transfer(req.body.withdraw_acc_no,req.body.money,req.body.acc_no,req.body.customer_passphrase,req.body.operator_password,req.body.hour,req.body.min);
		res.end();
	}
});


app.get('/account_statement',function(req,resp) {
	fs.readFile("account_statement.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});


app.post('/account_statement', function(req, res) {
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("false");
		res.end();
	}
	else {
		var data =  addon.print_account_statement(req.body.acc_no);
		res.send(data);
	}
});


app.get('/account_statement_range',function(req,resp) {
	fs.readFile("account_statement_range.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});


app.post('/account_statement_range', function(req, res) {
	var hour = req.body.start_hour;
	var min = req.body.start_min;
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("false");
		res.end();
	}
	else if(hour < 0 || hour >= 24 || min < 0 || min >= 60) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("falsetime");
		res.end();
	}
	else if(req.body.stop_hour < 0 || req.body.stop_hour >= 24 || req.body.stop_min < 0 || req.body.stop_min >= 60) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("falsetime");
		res.end();
	}
	else {
		var data =  addon.print_account_statement_in_range(req.body.acc_no,req.body.start_hour,req.body.start_min,req.body.stop_hour,req.body.stop_min);
		res.send(data);
	}
});


app.get('/standing_instructions',function(req,resp) {
	fs.readFile("standing_instructions.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/standing_instructions', function(req, res) {
	var hour = req.body.hour;
	var min = req.body.min;
	if(req.body.acc_no === req.body.withdraw_acc_no) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("You cannot send money to yourself");
		res.end();
	}
	else if(req.body.money <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Enter valid amount");
		res.end();
	}
	else if(addon.is_valid_account(req.body.withdraw_acc_no) === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account Number");
		res.end();
	}
	else if(addon.is_valid_account(req.body.acc_no) === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Reciever Account Number");
		res.end();
	}
	else if(hour < 0 || hour >= 24 || min < 0 || min >= 60) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Time");
		res.end();
	}
	else if(req.body.period <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Period");
		res.end();
	}
	else if(addon.is_passphrase_valid(req.body.withdraw_acc_no,req.body.customer_passphrase) === 'false') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid passphraseeeee");
		res.end();
	}
	else if (addon.is_operator_password_correct(req.body.operator_password) === 'false' ) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Operator password wrong");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Standing instructions added for every ");
		res.write(req.body.period);
		res.write(" minutes");
		addon.standing_instructions(req.body.withdraw_acc_no,req.body.money,req.body.acc_no,req.body.customer_passphrase,req.body.operator_password,req.body.hour,req.body.min,req.body.period);
		res.end();
	}
});


app.get('/fixed_deposit',function(req,resp) {
	fs.readFile("fixed_deposit.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/fixed_deposit', function(req, res) {
	var hour = req.body.hour;
	var min = req.body.min;
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Account Number");
		res.end();
	}
	else if(req.body.money <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Enter valid amount");
		res.end();
	}
	else if(req.body.duration <= 0) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid Duration");
		res.end();
	}
	else if(addon.is_passphrase_valid(req.body.acc_no,req.body.customer_passphrase) === 'false') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Invalid passphrase");
		res.end();
	}
	else if (addon.is_operator_password_correct(req.body.operator_password) === 'false' ) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Operator password wrong");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("Deposited");
		addon.fixed_deposit(req.body.acc_no,req.body.money,req.body.duration);
		res.end();
	}
});

app.get('/forgot_password',function(req,resp) {
	fs.readFile("forgot_password.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/forgot_password', function(req, res){
	var is_valid = addon.is_valid_account(req.body.acc_no);
	if(is_valid === "false") {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write("false");
		res.end();
	}
	else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var jsonstr = JSON.stringify(req.body.acc_no);
		var acc_no = jsonstr.slice(1, jsonstr.length-1);
		res.write(addon.get_security_question(acc_no).toString());
		res.end();
	}
});

app.post('/security', function(req, res,next){
	res.write(addon.forgot_password(req.body.acc_no,req.body.answer).toString());
	res.end();
});


app.post('/change_password',function(req,resp) {
	resp.writeHead(200, { 'Content-Type': 'text/html' });
	addon.change_password(req.body.acc_no,req.body.passphrase);
	resp.write("Changed passphrase");
	resp.end();
});


app.listen(8080, function() {
	addon.main();
	console.log('Server running at :8080');
});

// Console will print the message
// Prints: 'world'