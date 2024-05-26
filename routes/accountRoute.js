/**************************************
 * Account routes
 * Unit 4, delivery login view activity
 ***************************************/
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const { render } = require("ejs");


/**************************************
 * Delivery Login View
 * Unit 4, deliver login view activity
 ************************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/**************************************
 * Delivery Register View
 * Unit 4, deliver register view activity
 ************************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Process the registration data
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
// router.post(
//     "/login",
//     regValidate.loginRules(),
//     regValidate.checkLogData,
//     utilities.handleErrors(accountController.loginAccount)
//    )
// Process the login request
  router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
  )

// Account Management routes/accountRoute.js
router.get('/',
            utilities.checkLogin,
            utilities.handleErrors(accountController.accountManagementView));

router.get("/update", utilities.handleErrors(accountController.buildUpdateAccount))
router.post("/update", utilities.handleErrors(accountController.updateAccount))
router.get("/logout", accountController.logout)





module.exports = router;