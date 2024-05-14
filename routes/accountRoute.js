/**************************************
 * Account routes
 * Unit 4, delivery login view activity
 ***************************************/
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")


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

router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;