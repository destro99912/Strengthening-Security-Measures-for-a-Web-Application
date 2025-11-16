# Week 1 – Stored XSS Vulnerability in Signup Form  
**Project:** OWASP NodeGoat  
**Intern:** Muhammad Rehan  
**Date:** November 8 2025  

---

## 🔍 Vulnerability Overview
A **Stored Cross-Site Scripting (XSS)** flaw was discovered in the **Signup** feature of NodeGoat.  
When a malicious JavaScript payload is entered in the **First Name** field, it is stored in the database and executed later when any profile is viewed.

---

## 🧪 Proof of Concept (PoC)
**Target URL:** `http://localhost:4000/signup`  
**Vulnerable Parameter:** `firstName`  

**Payload used:**
```html
<script>alert('XSS')</script>

Steps to reproduce

Navigate to the signup page: http://localhost:4000/signup.

Fill the form with malicious payload in First Name:
<script>alert('XSS')</script>
Submit the form.

Open the profile page and observe the JavaScript alert executing.

Evidence (Screenshot): xss_alert.png

Impact

Attackers could inject arbitrary JavaScript into profiles, leading to:

Session theft (stealing cookies / session tokens)

CSRF attacks (perform actions on behalf of victims)

Defacement or redirection to malicious sites

Suggested Remediation

Sanitize & encode user-provided input before rendering (HTML-encode on output)

Validate & restrict allowed characters for name fields (letters, spaces only)

Implement a Content-Security-Policy (CSP) to reduce injected script impact

Use templating frameworks with built-in output encoding

Files Included

| File                             | Description                         |
| -------------------------------- | ----------------------------------- |
| `poc/xss.txt`                    | Detailed PoC and remediation notes  |
| `docs/screenshots/xss_alert.png` | Screenshot showing JavaScript alert |
| `internship/week1/README.md`     | This summary and reproduction steps |
