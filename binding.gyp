{
	"targets": [
		{
			"target_name": "bankaddon",
			"sources": ["./src/C++/custom.hpp","./src/C++/Banking.cpp","./src/C++/WinTimer.h","./src/C++/dbconnector.h","src/C++/file_handler.h","src/C++/timestamp.h","src/C++/type.h","src/C++/valid.h"],
			"include_dirs": [
				"C:/Users/ganesh-pt1936/Downloads/mysql-connector-c-6.1.11-winx64/include" ,"E:/Node_test"
			],
			"libraries": [
				"C:/Users/ganesh-pt1936/Downloads/mysql-connector-c-6.1.11-winx64/lib/libmysql",
			],
			"cflags": [ "-std=c++14" ],
		}		
	]
}
