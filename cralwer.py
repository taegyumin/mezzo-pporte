#!/usr/bin/python3
from selenium import webdriver
from random import *
import time
import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from secret import id, password

def wait(sec: int):
    time.sleep(sec)

def printTimeNow():
    print(str(datetime.datetime.now()))

def crawl(id: str, password: str):
    # 초기 세팅
    driverPath = "./chromedriver"
    url = "https://m.cafe.daum.net/parkboyoungfd/_rec"

    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument("--disable-gpu")
    options.add_argument('lang=ko_KR')
    driver = webdriver.Chrome(driverPath, options=options)

    # 로그인
    driver.get(url)
    wait(uniform(3, 4))
    driver.find_element_by_id('daumMinidaum').click()
    wait(uniform(3, 4))
    driver.find_element_by_class_name('txt_kakao').click()
    wait(uniform(3, 4))
    driver.find_element_by_xpath('//*[@id="loginEmailField"]/div/label').click()
    driver.find_element_by_xpath('//*[@id="loginEmailField"]/div/label').click()
    wait(0.5)
    driver.find_element_by_xpath('//*[@id="id_email_2"]').send_keys(id)
    wait(0.5)
    driver.find_element_by_xpath('//*[@id="login-form"]/fieldset/div[3]/label').click()
    driver.find_element_by_xpath('//*[@id="login-form"]/fieldset/div[3]/label').click()
    wait(0.5)
    driver.find_element_by_xpath('//*[@id="id_password_3"]').send_keys(password)
    wait(0.5)
    driver.find_element_by_xpath('//*[@id="login-form"]/fieldset/div[8]/button[1]').click()
    wait(0.5)

    now = time.gmtime(time.time())
    currentHour = (now.tm_hour + 9) % 24

    if (currentHour > 21 or currentHour <= 0):
        hit = randint(60, 70)
    else:
        hit = randint(30, 40)

    # 응원 버튼 누르기
    driver.get('https://m.cafe.daum.net/parkboyoungfd')
    wait(uniform(3, 4))
    button = driver.find_element_by_xpath('//*[@id="daumHead"]/div/div[2]/div/div/div[3]/div/button/i')
    for i in range(hit):
        print(driver.find_element_by_xpath('//*[@id="daumHead"]/div/div[2]/div/div/div[3]/div').text.strip())
        if (driver.find_element_by_xpath('//*[@id="daumHead"]/div/div[2]/div/div/div[3]/div').text.strip() != '0'):
            driver.execute_script("arguments[0].click();", button)
            print(i)
            wait(uniform(0.1, 0.5))
        else:
            break

    # 종료
    wait(5)
    driver.close()

def job():
    # 시작 메시지 찍기
    print('job start at ', end='')
    printTimeNow()

    # waitingTimeToStart = randint(1, 300)
    # wait(waitingTimeToStart)

    print('crawler start at ', end='')
    printTimeNow()

    # 크롤러 실행
    crawl(id=id, password=password)

    # 종료 메시지 찍기
    print('Done!!!')
    print('job end at ', end='')
    printTimeNow()

schedule = BlockingScheduler()
schedule.add_job(job, CronTrigger.from_crontab('0/30 * * * *'))
schedule.start()

# code for schedule library
# import schedule
# schedule.every().hour.do(job)
# while True:
#     schedule.run_pending()
#     time.sleep(1)

# REFERENCES
# python apsscheduler 다루기: https://apscheduler.readthedocs.io/en/3.0/modules/triggers/cron.html#module-apscheduler.triggers.cron
# python scheduler 다루기: https://lemontia.tistory.com/508
# python 시간 다루기: https://python.bakyeono.net/chapter-11-3.html
# 카페 응원하기 정책 및 위젯 개편: http://cafe.daum.net/supporters/Mhj5/21
# 새로운 Daum 공식팬카페 팬덤 랭킹을 소개합니다.: https://m.cafe.daum.net/supporters/Mhj5/22

