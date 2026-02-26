from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("http://localhost:5173/admin/login")
driver.maximize_window()

try:
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    email_input.send_keys("admin@nmn.og")

    password_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )
    password_input.send_keys("Admin@123")

    login_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
    )
    login_btn.click()

    try:
        WebDriverWait(driver, 10).until(
            EC.url_contains("/admin/dashboard")
        )
        print("Login successful! Dashboard loaded.")
    except TimeoutException:
        print("Login may have failed or dashboard did not load in time.")

except TimeoutException as e:
    print("Error during test: Element not found or page took too long to load.", e)
except Exception as e:
    print("Error during test:", e)

time.sleep(3)
driver.quit()
