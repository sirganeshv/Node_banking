#define WIN32_LEAN_AND_MEAN
#include <Windows.h>
#include <stdint.h>


struct customer_details {
	int acc_no;
	char customer_name[20];
	unsigned int age;
	char phone_no[11];
	char address[30];
	int balance;
	char passphrase[10];
	int wrong_attempts;
	bool is_active;
	char security_question[50];
	char security_answer[30];
	timeval last_accessed_time;
	customer_details():wrong_attempts(0),is_active(true) { }
};

void gettimeofday(struct timeval * tp)
{
    // Note: some broken versions only have 8 trailing zero's, the correct epoch has 9 trailing zero's
    // This magic number is the number of 100 nanosecond intervals since January 1, 1601 (UTC)
    // until 00:00:00 January 1, 1970 
    static const uint64_t EPOCH = ((uint64_t) 116444736000000000ULL);

    SYSTEMTIME  system_time;
    FILETIME    file_time;
    uint64_t    time;

    GetSystemTime( &system_time );
    SystemTimeToFileTime( &system_time, &file_time );
    time =  ((uint64_t)file_time.dwLowDateTime )      ;
    time += ((uint64_t)file_time.dwHighDateTime) << 32;

    tp->tv_sec  = (long) ((time - EPOCH) / 10000000L);
    tp->tv_usec = (long) (system_time.wMilliseconds * 1000);
}