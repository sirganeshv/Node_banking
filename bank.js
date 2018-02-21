const addon = require('./build/Release/bankaddon');
var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

var http = require("http");

app.get('/',function(req,resp) {
	fs.readFile("addAccount.html", function (error, pgResp) {
			resp.writeHead(200, { 'Content-Type': 'text/html' });
			resp.write("test");
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

app.listen(8080, function() {
	addon.main();
	console.log('Server running at http://127.0.0.1:8080/');
});

// Console will print the message
// Prints: 'world'