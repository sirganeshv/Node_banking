#include <node.h>
#include <iostream>
#include<string>
#include "db.h"

namespace demo1 {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Number;
using v8::Value;

	
void printname(const FunctionCallbackInfo<Value>& args) {
	customer_details customer;
	v8::String::Utf8Value param1(args[0]->ToString());
	std::string name = std::string(*param1);
	strcpy(customer.customer_name,name.c_str());
	customer.age = args[1]->NumberValue();	
	int32_t phone_no = args[2]->NumberValue();
	//cout<<"Numeric "<<phone_no;
	strcpy(customer.phone_no,std::to_string(phone_no).c_str());	
	//cout<<customer.phone_no;
	v8::String::Utf8Value param2(args[3]->ToString());
	std::string address = std::string(*param2);
	strcpy(customer.address,address.c_str());
	v8::String::Utf8Value param3(args[4]->ToString());
	std::string passphrase = std::string(*param3);
	strcpy(customer.passphrase,passphrase.c_str());
	v8::String::Utf8Value param4(args[5]->ToString());
	std::string security_qn = std::string(*param4);
	strcpy(customer.security_question,security_qn.c_str());
	v8::String::Utf8Value param5(args[6]->ToString());
	std::string security_ans = std::string(*param5);
	strcpy(customer.security_answer,security_ans.c_str());	
	customer.balance = 1000;
	gettimeofday(&customer.last_accessed_time);
	init_db();
	int acc_no = write_customer_into_db(customer);
	cout<<"Your account number is "<<acc_no;
	customer.acc_no = acc_no;
	close_db();
}

void init(Local<Object> exports) {
	NODE_SET_METHOD(exports, "printname", printname);
}

NODE_MODULE(demo1, init)

}  
// namespace demo
