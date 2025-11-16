# Week 2 — Security Assessment (NodeGoat Application)

This README documents all findings, evidence, fixes, and validation performed during **Week 2** of the security assessment.  
All screenshot evidence is stored in the `/evidence/week2/` folder.

## 🛡️ Vulnerability 1: Missing Input Validation on Login

### Evidence Before Fix
- 01_login_page_before_fix.png
- 02_login_invalid_input_response.png
- 03_ZAP_login_request_with_script_payload.png
- 04_ZAP_login_response_invalid_username.png

### Fix Implemented
Input validation added using validator.js, sanitization, ASCII filtering, and consistent error messaging.

---

## 🛡️ Vulnerability 2: Weak Password Storage (Plaintext Passwords)

### Evidence Before Fix
- 06_ZAP_plaintext_password_in_request.png
- 05_MongoDB_plaintext_password.png
- 06_UserDAO_plaintext_password_and_commented_bcrypt_01.png
- 06_UserDAO_plaintext_password_and_commented_bcrypt_02.png
- 08_UserDAO_weak_password_compare_plaintext.png
- 07_Session_handleSignup_plaintext_password.png

### Evidence After Fix
- 07_MongoDB_password_hash_after_fix.png

### Fix Implemented
- bcrypt hashing added
- secure password comparison implemented
- raw password no longer stored or compared

---

## 🛡️ Vulnerability 3: Insecure HTTP Communication & Missing Security Headers

### Evidence Before Fix
- 09_ZAP_HTTP_request.png
- 10_ZAP_HTTP_response.png
- 11_ZAP_alert_X-Powered-By_leak.png
- 12_Insecure_HTTP_Login_Request.png
- 13_Insecure_HTTP_Signup_Request.png
- 14_HTTP_Traffic_Overview.png

### Fix Implemented
- Helmet.js added to enforce security headers
- HSTS, CSP (optional), X-Frame-Options, Referrer-Policy, NoSniff enabled

---

## ✔ Summary of Fixes
| Vulnerability | Status |
|--------------|--------|
| Missing Input Validation | ✔ Fixed |
| Weak Password Storage | ✔ Fixed |
| Insecure HTTP & Headers | ✔ Fixed |

---

## Tools Used
- NodeGoat
- MongoDB Compass
- OWASP ZAP
- VS Code
- Git
