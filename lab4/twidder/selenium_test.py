from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import datetime

chromedriver = '/usr/local/bin/chromedriver'
browser = webdriver.Chrome(chromedriver)
# browser.get("http://127.0.0.1:5000/")
browser.get("https://tddd97-chiti602.herokuapp.com/")


def sign_up(firstname, familyname, gender, city, country, email, password, confirm_password):
    first_name_input = browser.find_element_by_id("FirstName")
    family_name_input = browser.find_element_by_id("FamilyName")
    gender_input = browser.find_element_by_id("Gender")
    city_input = browser.find_element_by_id("city")
    country_input = browser.find_element_by_id("country")
    email_input = browser.find_element_by_id("signupemail")
    password_input = browser.find_element_by_id("signuppassword")
    confirm_password_input = browser.find_element_by_id(
        "confirmpassword")
    sign_up_button = browser.find_element_by_id("signup")

    first_name_input.clear()
    family_name_input.clear()
    # gender_input.clear()
    city_input.clear()
    country_input.clear()
    email_input.clear()
    password_input.clear()
    confirm_password_input.clear()

    first_name_input.send_keys(firstname)
    family_name_input.send_keys(familyname)
    gender_input.send_keys(gender)
    city_input.send_keys(city)
    country_input.send_keys(country)
    email_input.send_keys(email)
    password_input.send_keys(password)
    confirm_password_input.send_keys(confirm_password)

    sign_up_button.click()
    time.sleep(1)


def sign_in(email, password):
    email_input = browser.find_element_by_id("loginemail")
    password_input = browser.find_element_by_id("loginpassword")
    login_button = browser.find_element_by_id("login")

    email_input.clear()
    password_input.clear()

    email_input.send_keys(email)
    password_input.send_keys(password)

    login_button.click()
    time.sleep(1)


def post_message(own, message):
    if (own):
        post_input = browser.find_elements_by_tag_name('textarea')[0]
        reload_button = browser.find_element_by_id("reload_own")
        post_button = browser.find_element_by_id("post_own")
    else:
        post_input = browser.find_elements_by_tag_name('textarea')[1]
        reload_button = browser.find_element_by_id("reload_other")
        post_button = browser.find_element_by_id("post_other")

    post_input.clear()

    post_input.send_keys(message)
    post_button.click()
    reload_button.click()
    time.sleep(1)


def change_password(oldpassword, newpassword, confirm_newpassword):
    oldpassword_input = browser.find_element_by_id("oldpassword")
    newpassword_input = browser.find_element_by_id("newpassword")
    confirm_newpassword_input = browser.find_element_by_id(
        "confirmnewpassword")
    change_button = browser.find_element_by_id("changepassword_button")

    oldpassword_input.clear()
    newpassword_input.clear()
    confirm_newpassword_input.clear()

    oldpassword_input.send_keys(oldpassword)
    newpassword_input.send_keys(newpassword)
    confirm_newpassword_input.send_keys(confirm_newpassword)
    change_button.click()
    time.sleep(1)


def select_tab(tabname):
    if tabname == "home":
        tab_button = browser.find_element_by_id("hometab")
    elif tabname == "account":
        tab_button = browser.find_element_by_id("accounttab")
    elif tabname == "browse":
        tab_button = browser.find_element_by_id("browsetab")

    tab_button.click()
    time.sleep(1)


def log_out():
    logout_button = browser.find_element_by_id("signout_button")

    logout_button.click()
    time.sleep(1)


def search_user(email):
    search_input = browser.find_element_by_id("searchuser")
    search_button = browser.find_element_by_id("search_button")

    search_input.clear()

    search_input.send_keys(email)
    search_button.click()
    time.sleep(1)


if __name__ == "__main__":
    sign_up('d', 'd', 'Male', 'd', 'd', 'd@f.com', 'aaaa', 'aaaa')
    sign_in('d@f.com', 'aaaa')
    select_tab(tabname="home")
    post_message(own=True, message=str(datetime.datetime.now()))
    select_tab(tabname="account")
    change_password('aaaa', 'bbbb', 'bbbb')
    change_password('bbbb', 'aaaa', 'aaaa')
    log_out()
    sign_in('d@f.com', 'aaaa')
    select_tab(tabname="browse")
    search_user('d@d.com')
    post_message(own=False, message=str(datetime.datetime.now()))

    input()
    browser.quit()
