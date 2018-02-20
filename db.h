#include <mysql.h>
#include<stdio.h>
#include<iostream>
#include <time.h>
#include "type.hpp"


using namespace std;
MYSQL_RES *result;
MYSQL *con;
MYSQL_ROW row;
MYSQL_FIELD *field;

//Display the error message and exit
void finish_with_error(MYSQL *con)
{
  fprintf(stderr, "%s\n", mysql_error(con));
  mysql_close(con);
  exit(1);        
}

//Initializes connection to DB
void init_db() {
	con = mysql_init(NULL);
	if (con == NULL) {
      fprintf(stderr, "%s\n", mysql_error(con));
      exit(1);
	}
	if (mysql_real_connect(con, "localhost", "root", "","banking", 0, NULL, 0) == NULL) {
      finish_with_error(con);
  }  
}

//Closes connection with DB
void close_db() {
	mysql_close(con);
}


int write_customer_into_db(customer_details customer) {
	char query[150];
	time_t nowtime;
	tm time;
	char milli[4];
	nowtime = (time_t)customer.last_accessed_time.tv_sec;
	time = *localtime(&nowtime);
	long mill = customer.last_accessed_time.tv_usec;
	sprintf(milli,"%3d",customer.last_accessed_time.tv_usec);
	char time_string[50];
	sprintf(time_string,"%02d:%02d:%02d:%s",time.tm_hour,time.tm_min,time.tm_sec,milli);
	sprintf(query,"INSERT INTO customers VALUES(%d,'%s',%d,'%s','%s',%d,'%s',%d,'%s','%s','%s','%s')",
	0,customer.customer_name,customer.age,customer.phone_no,customer.address,customer.balance,customer.passphrase,
	customer.wrong_attempts,customer.is_active?"true":"false",customer.security_question,customer.security_answer,time_string);
	if (mysql_query(con,query)){
      finish_with_error(con);
	}
	int acc_no = mysql_insert_id(con);
	return acc_no++;
}

void insert(int id){
	char query[150];
	sprintf(query,"INSERT INTO testtable VALUES(%d)",id);
	if (mysql_query(con,query)){
      finish_with_error(con);
	}
}