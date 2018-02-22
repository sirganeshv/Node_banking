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

app.get('/',function(req,resp) {
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
	console.log("inserted");
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
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Going to update");
	//res.write(req.body.acc_no + " " + req.body.details + " " + req.body.phone + " " + req.body.address);
	addon.update_account(req.body.acc_no,req.body.details,req.body.phone,req.body.address);
	console.log("inserted");
	res.end();
});


app.get('/delete_account',function(req,resp) {
	fs.readFile("delete_account.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});


app.post('/delete_account', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Deleted");
	//res.write(req.body.acc_no + " " + req.body.details + " " + req.body.phone + " " + req.body.address);
	addon.delete_account(req.body.acc_no,req.body.operator_password);
	console.log("Deleted");
	res.end();
});



app.get('/display',function(req,resp) {
	fs.readFile("display.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/display', function(req, res) {
	//res.writeHead(200, { 'Content-Type': 'text/html' });
	//res.write("Displaying");
	//res.write(req.body.acc_no + " " + req.body.details + " " + req.body.phone + " " + req.body.address);
	var data =  addon.display(req.body.acc_no);
	console.log("name = " + data.name);
	res.send(data);
	//res.end();
});


app.get('/deposit',function(req,resp) {
	fs.readFile("deposit.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/deposit', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Deposited");
	addon.deposit(req.body.acc_no,req.body.money);
	res.end();
});

app.get('/withdraw',function(req,resp) {
	fs.readFile("withdraw.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/withdraw', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Withdrawn");
	addon.withdraw(req.body.acc_no,req.body.money,req.body.customer_passphrase,req.body.operator_password);
	res.end();
});

app.get('/transfer',function(req,resp) {
	fs.readFile("transfer.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/transfer', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Transfered");
	addon.transfer_money(req.body.withdraw_acc_no,req.body.money,req.body.phone_no);
	res.end();
});


app.get('/schedule_transfer',function(req,resp) {
	fs.readFile("schedule_transfer.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/schedule_transfer', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Scheduled");
	addon.schedule_transfer(req.body.withdraw_acc_no,req.body.money,req.body.acc_no,req.body.customer_passphrase,req.body.operator_password,req.body.hour,req.body.min);
	res.end();
});


app.get('/standing_instructions',function(req,resp) {
	fs.readFile("standing_instructions.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/standing_instructions', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Standing instructions added for every ");
	res.write(req.body.period);
	res.write(" minutes");
	addon.standing_instructions(req.body.withdraw_acc_no,req.body.money,req.body.acc_no,req.body.customer_passphrase,req.body.operator_password,req.body.hour,req.body.min,req.body.period);
	res.end();
});


app.get('/fixed_deposit',function(req,resp) {
	fs.readFile("fixed_deposit.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/fixed_deposit', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Deposited");
	addon.fixed_deposit(req.body.acc_no,req.body.money,req.body.duration);
	res.end();
});

app.get('/forgot_password',function(req,resp) {
	fs.readFile("forgot_password.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write(pgResp);
			resp.end();
	});
});

app.post('/forgot_password', function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/html' });
	var jsonstr = JSON.stringify(req.body.acc_no);
	var acc_no = jsonstr.slice(1, jsonstr.length-1);
	res.write(addon.get_security_question(acc_no).toString());
	res.end();
});

app.post('/security', function(req, res,next){
	//console.log(addon.forgot_password(req.body.acc_no,req.body.answer).toString());
	res.write(addon.forgot_password(req.body.acc_no,req.body.answer).toString());
	res.end();
});


app.post('/change_password',function(req,resp) {
	resp.writeHead(200, { 'Content-Type': 'text/html' });
	addon.change_password(req.body.acc_no,req.body.passphrase);
	resp.write("Changine passphrase");
	//resp.write(pgResp);
	//resp.write(req.body.acc_no.toString());
	resp.end();
});


app.listen(8080, function() {
	addon.main();
	console.log('Server running at http://127.0.0.1:8080/');
});

// Console will print the message
// Prints: 'world'