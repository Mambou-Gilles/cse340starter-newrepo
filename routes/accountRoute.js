/**************************************
 * Account routes
 * Unit 4, delivery login view activity
 ***************************************/
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


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
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.loginAccount)
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
  )

module.exports = router;