# Week 3 – Advanced Security & Final Reporting  
**Cyber Security Internship – Strengthening Security Measures for a Web Application**

Week 3 focuses on advanced security activities including automated penetration testing, secure logging implementation, and preparing the final security checklist and documentation. This week completes the end-to-end security hardening of the NodeGoat application.

---

## 📌 **Task 1 – Basic Penetration Testing (OWASP ZAP)**  
The purpose of this task was to identify common vulnerabilities using OWASP ZAP. Browser traffic was proxied through ZAP to allow endpoint discovery and vulnerability scanning.

### ✔ Steps Performed
- Configured OWASP ZAP proxy settings.  
- Accessed the NodeGoat application via browser to populate the ZAP site map.  
- Initiated **Active Scan** on `http://localhost:4000`.  
- Waited for scan completion and reviewed detected vulnerabilities.  
- Collected all evidence screenshots.

### 📁 Evidence Files
- Week3_Evidence_1.4_ZAP_Captured_Traffic.png  
- Week3_Evidence_1.5_ActiveScan_Menu.png  
- Week3_Evidence_1.5_ActiveScan_Window.png  
- Week3_Evidence_1.6_ActiveScan_Results.png  

---

## 📌 **Task 2 – Implementing Basic Logging Using Winston**

To improve auditing and monitoring, Winston logging was integrated into the NodeGoat application. This replaces default `console.log` statements with structured and persistent logging.

### ✔ Steps Performed
1. Installed Winston:
   ```bash
   npm install winston
   ```
2. Created a `logger.js` file:
   ```javascript
   const winston = require('winston');

   const logger = winston.createLogger({
     transports: [
       new winston.transports.Console(),
       new winston.transports.File({ filename: 'security.log' })
     ]
   });

   logger.info('Application started');

   module.exports = logger;
   ```
3. Imported logger in `server.js`:
   ```javascript
   const logger = require('./logger');
   ```
4. Replaced console logs:
   ```javascript
   logger.info('Connected to the database');
   logger.info(`Express http server listening on port ${port}`);
   ```
5. Ran the application to verify logging.

### 📁 Evidence Files
- Week3_Evidence_2.1_VSCode_ProjectOpen.png  
- Week3_Evidence_2.2_Winston_Installed.png  
- Week3_Evidence_2.3_LoggerFile_Created.png  
- Week3_Evidence_2.4a_Server_Logger_Require.png  
- Week3_Evidence_2.4b_Server_Logger_Replaced_Console.png  
- Week3_Evidence_2.5a_Console_Logger_Output.png  
- Week3_Evidence_2.5b_SecurityLog_FileOutput.png  

---

## 📌 **Task 3 – Security Best Practices Checklist**

A security checklist was created summarizing the core security best practices for web applications.

📄 **Checklist Document:** Week3_Security_Checklist.docx

---

## 📌 **Folder Structure (Recommended)**

```
week 3/
│
├── Evidence/
│   ├── Week3_Evidence_1.4_ZAP_Captured_Traffic.png
│   ├── Week3_Evidence_1.5_ActiveScan_Menu.png
│   ├── Week3_Evidence_1.5_ActiveScan_Window.png
│   ├── Week3_Evidence_1.6_ActiveScan_Results.png
│   ├── Week3_Evidence_2.1_VSCode_ProjectOpen.png
│   ├── Week3_Evidence_2.2_Winston_Installed.png
│   ├── Week3_Evidence_2.3_LoggerFile_Created.png
│   ├── Week3_Evidence_2.4a_Server_Logger_Require.png
│   ├── Week3_Evidence_2.4b_Server_Logger_Replaced_Console.png
│   ├── Week3_Evidence_2.5a_Console_Logger_Output.png
│   ├── Week3_Evidence_2.5b_SecurityLog_FileOutput.png
│
├── Week3_Security_Checklist.docx
├── Week3_Detailed_Report_Final.docx
└── README.md
```

---

## ✅ **Week 3 Completed Successfully**
All tasks, documentation, screenshots, and code updates were completed and validated. This completes Week 3 of the cybersecurity internship.

