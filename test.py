#!/usr/bin/python

import sys
import subprocess

from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.firefox.options import Options as FirefoxOptions

if (len(sys.argv) < 2):
    print('Inform the app name to be attacked')
    exit(1)

proc_broadway = subprocess.Popen('broadwayd :5', shell=True)
proc_app = subprocess.Popen('GDK_BACKEND=broadway BROADWAY_DISPLAY=:5 XDG_CONFIG_HOME=$(pwd)/config ' + sys.argv[1], shell=True)

options = FirefoxOptions()
# options.add_argument("--headless")
driver = webdriver.Firefox(options=options)
driver.get('http://localhost:8085')

with open('test.js') as f:
    driver.execute_script(f.read())

try:
    element = WebDriverWait(driver, 600).until(
        EC.title_is('DONE')
    )
finally:
    driver.quit()
    proc_broadway.terminate()
    proc_app.terminate()
