const UserDAO = require("../data/user-dao").UserDAO;
const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const validator = require('validator');
const bcrypt = require('bcrypt');
const {
    environmentalScripts
} = require("../../config/config");

/* The SessionHandler must be constructed with a connected db */
function SessionHandler(db) {
    "use strict";

    const userDAO = new UserDAO(db);
    const allocationsDAO = new AllocationsDAO(db);

    const prepareUserData = (user, next) => {
        // Generate random allocations
        const stocks = Math.floor((Math.random() * 40) + 1);
        const funds = Math.floor((Math.random() * 40) + 1);
        const bonds = 100 - (stocks + funds);

        allocationsDAO.update(user._id, stocks, funds, bonds, (err) => {
            if (err) return next(err);
        });
    };

    this.isAdminUserMiddleware = (req, res, next) => {
        if (req.session.userId) {
            return userDAO.getUserById(req.session.userId, (err, user) => {
               return user && user.isAdmin ? next() : res.redirect("/login");
            });
        }
        console.log("redirecting to login");
        return res.redirect("/login");

    };

    this.isLoggedInMiddleware = (req, res, next) => {
        if (req.session.userId) {
            return next();
        }
        console.log("redirecting to login");
        return res.redirect("/login");
    };

    this.displayLoginPage = (req, res, next) => {
        return res.render("login", {
            userName: "",
            password: "",
            loginError: "",
            environmentalScripts
        });
    };

    this.handleLoginRequest = (req, res, next) => {
        const {
            userName,
            password
        } = req.body;
        // ---- Sanitize and validate login inputs ----

        // 1) Ensure values are strings (prevents object/array injection)
        const rawUser = (typeof userName === 'string') ? userName : '';
        const rawPass = (typeof password === 'string') ? password : '';

        // 2) Trim spaces and remove non-ASCII characters
        const sanitizedUser = validator.trim(rawUser).replace(/[^\x20-\x7E]/g, '');
        const sanitizedPass = validator.trim(rawPass).replace(/[^\x20-\x7E]/g, '');

        // 3) Basic length validation (you can tune these numbers later)
        const isUserValid = validator.isLength(sanitizedUser, { min: 3, max: 50 });
        const isPassValid = validator.isLength(sanitizedPass, { min: 6, max: 100 });

        if (!isUserValid || !isPassValid) {
            // Do NOT hit the DB if the format is wrong
            return res.status(400).render("login", {
                userName: "",
                password: "",
                loginError: "Invalid username or password",
                environmentalScripts
            });
        }
        // ---- End of sanitization block ----

        try {
            userDAO.getUserByUserName(sanitizedUser, async (err, user) => {
                if (err) return next(err);

                if (!user) {
                    console.log("Error: attempt to login with invalid user: ", sanitizedUser);

                    // Fix for A1 - 3 Log Injection - encode/sanitize input for CRLF Injection
                    // that could result in log forging:
                    // - Step 1: Require a module that supports encoding
                    // const ESAPI = require('node-esapi');
                    // - Step 2: Encode the user input that will be logged in the correct context
                    // following are a few examples:
                    // console.log('Error: attempt to login with invalid user: %s',
                    //     ESAPI.encoder().encodeForHTML(userName));
                    // console.log('Error: attempt to login with invalid user: %s',
                    //     ESAPI.encoder().encodeForJavaScript(userName));
                    // console.log('Error: attempt to login with invalid user: %s',
                    //     ESAPI.encoder().encodeForURL(userName));
                    // or if you know that this is a CRLF vulnerability you can target this specifically as follows:
                    // console.log('Error: attempt to login with invalid user: %s',
                    //     userName.replace(/(\r\n|\r|\n)/g, '_'));

                    return res.status(401).render("login", {
                        userName: sanitizedUser,
                        password: "",
                        loginError: "Invalid username or password",
                        environmentalScripts
                    });
                }

                try {
                    const isMatch = await bcrypt.compare(sanitizedPass, user.password);
                    if (!isMatch) {
                        return res.status(401).render("login", {
                            userName: userName,
                            password: "",
                            loginError: "Invalid username or password",
                            environmentalScripts
                        });
                    }

                    // ✅ Password correct - proceed with session
                    // A2-Broken Authentication and Session Management
                    // Upon login, a security best practice with regards to cookies session management
                    // would be to regenerate the session id so that if an id was already created for
                    // a user on an insecure medium (i.e: non-HTTPS website or otherwise), or if an
                    // attacker was able to get their hands on the cookie id before the user logged-in,
                    // then the old session id will render useless as the logged-in user with new privileges
                    // holds a new session id now.

                    // Fix the problem by regenerating a session in each login
                    // by wrapping the below code as a function callback for the method req.session.regenerate()
                    // i.e:
                    // `req.session.regenerate(() => {})`
                    req.session.regenerate((err) => {
                        if (err) return res.status(500).send("Session error");
                        req.session.userId = user._id;
                        return res.redirect(user.isAdmin ? "/benefits" : "/dashboard");
                    });
                } catch (hashError) {
                    console.error("Bcrypt comparison error:", hashError);
                    return res.status(500).send("Internal server error");
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).send("Internal server error");
        }
    };

    this.displayLogoutPage = (req, res) => {
        req.session.destroy(() => res.redirect("/"));
    };

    this.displaySignupPage = (req, res) => {
        res.render("signup", {
            userName: "",
            password: "",
            passwordError: "",
            email: "",
            userNameError: "",
            emailError: "",
            verifyError: "",
            environmentalScripts
        });
    };

    const validateSignup = (userName, firstName, lastName, password, verify, email, errors) => {

        const USER_RE = /^.{1,20}$/;
        const FNAME_RE = /^.{1,100}$/;
        const LNAME_RE = /^.{1,100}$/;
        const EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;
        const PASS_RE = /^.{1,20}$/;
        /*
        //Fix for A2-2 - Broken Authentication -  requires stronger password
        //(at least 8 characters with numbers and both lowercase and uppercase letters.)
        const PASS_RE =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        */

        errors.userNameError = "";
        errors.firstNameError = "";
        errors.lastNameError = "";

        errors.passwordError = "";
        errors.verifyError = "";
        errors.emailError = "";

        if (!USER_RE.test(userName)) {
            errors.userNameError = "Invalid user name.";
            return false;
        }
        if (!FNAME_RE.test(firstName)) {
            errors.firstNameError = "Invalid first name.";
            return false;
        }
        if (!LNAME_RE.test(lastName)) {
            errors.lastNameError = "Invalid last name.";
            return false;
        }
        if (!PASS_RE.test(password)) {
            errors.passwordError = "Password must be 8 to 18 characters" +
                " including numbers, lowercase and uppercase letters.";
            return false;
        }
        if (password !== verify) {
            errors.verifyError = "Password must match";
            return false;
        }
        if (email !== "") {
            if (!EMAIL_RE.test(email)) {
                errors.emailError = "Invalid email address";
                return false;
            }
        }
        return true;
    };

    this.handleSignup = async (req, res, next) => {

        // Normalize and trim input data
        const userName = validator.trim(String(req.body.userName || ''));
        const firstName = validator.trim(String(req.body.firstName || ''));
        const lastName = validator.trim(String(req.body.lastName || ''));
        const email = validator.trim(String(req.body.email || ''));
        const password = String(req.body.password || '');
        const verify = String(req.body.verify || '');

        // Validate input with robust rules
        const errors = [];
        if (!validator.isLength(userName, { min: 3, max: 30 }) || !validator.isAlphanumeric(userName)) {
            errors.push('Username must be 3–30 chars and alphanumeric.');
        }
        if (!validator.isLength(firstName, { min: 1, max: 50 })) {
            errors.push('First name is required.');
        }
        if (!validator.isLength(lastName, { min: 1, max: 50 })) {
            errors.push('Last name is required.');
        }
        if (!validator.isEmail(email)) {
            errors.push('Valid email is required.');
        }
        if (!validator.isLength(password, { min: 8 })) {
            errors.push('Password must be at least 8 characters.');
        }
        if (password !== verify) {
            errors.push('Passwords do not match.');
        }

        if (errors.length) {
            return res.status(400).render("signup", {
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                errors: errors,
                environmentalScripts
            });
        }

        try {
            // Check if username already exists
            userDAO.getUserByUserName(userName, async (err, user) => {
                if (err) return next(err);

                if (user) {
                    return res.status(400).render("signup", {
                        userName: userName,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        errors: ["User name already in use. Please choose another"],
                        environmentalScripts
                    });
                }

                try {
                    // Hash the password before storing
                    const hashedPassword = await bcrypt.hash(password, 10);

                    userDAO.addUser(userName, firstName, lastName, hashedPassword, email, (err, user) => {
                        if (err) return next(err);

                        //prepare data for the user
                        prepareUserData(user, next);
                        /*
                        sessionDAO.startSession(user._id, (err, sessionId) => {
                            if (err) return next(err);
                            res.cookie("session", sessionId);
                            req.session.userId = user._id;
                            return res.render("dashboard", { ...user, environmentalScripts });
                        });
                        */
                        req.session.regenerate(() => {
                            req.session.userId = user._id;
                            // Set userId property. Required for left nav menu links
                            user.userId = user._id;

                            return res.render("dashboard", {
                                ...user,
                                environmentalScripts
                            });
                        });
                    });
                } catch (hashError) {
                    return next(hashError);
                }
            });
        } catch (error) {
            return next(error);
        }
    };

    this.displayWelcomePage = (req, res, next) => {
        let userId;

        if (!req.session.userId) {
            console.log("welcome: Unable to identify user...redirecting to login");
            return res.redirect("/login");
        }

        userId = req.session.userId;

        userDAO.getUserById(userId, (err, doc) => {
            if (err) return next(err);
            doc.userId = userId;
            return res.render("dashboard", {
                ...doc,
                environmentalScripts
            });
        });
    };
}

module.exports = SessionHandler;
