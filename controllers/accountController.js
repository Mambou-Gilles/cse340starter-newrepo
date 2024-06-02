const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { cookie } = require("express-validator");
const cookieParser = require("cookie-parser");
require("dotenv").config()
/***********************
 * Deliver login view
 **********************/
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/***********************
 * Deliver register view
 **********************/
async function buildRegister(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body


    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null

      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null
      })
    }
  }

  /* ****************************************
*  Process Login
* *************************************** */
// async function loginAccount(req, res) {
//   let nav = await utilities.getNav()
//   const { account_email, account_password } = req.body

//   const logResult = await accountModel.loginAccount(
//     account_email,
//     account_password 
//   )

//   if (logResult) {
//     req.flash(
//       "notice",
//       `You have logged in successfully.`
//     )
//     res.redirect("/")
//   } else {
//     req.flash("notice", "Sorry, the login failed.")
//     res.status(501).render("account/login", {
//       title: "Login",
//       nav
//     })
//   }
// }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


 // controllers/accountController.js
// async function accountManagementView(req, res) {
//   let nav = await utilities.getNav();
//   res.render('account/index', {
//     title: 'Account Management',
//     nav,
//     errors: null,
//     notice: req.flash('notice')
//   });
// }

// //  controllers accountController.js
// async function accountManagementView(req, res) {
//   let nav = await utilities.getNav();
//     const { account_email, account_password } = req.body

//   const logResult = await accountModel.loginAccount(
//     account_email,
//     account_password 
//   )

//   if (logResult) {
//     req.flash(
//       "notice",
//       `You have logged in successfully.`
//     )
//     res.redirect("/account/index")
//   } else {
//     req.flash("notice", "Sorry, the login failed.")
//     res.status(501).render("account/login", {
//       title: "Login",
//       nav
//     })
//   }

// }


async function accountManagementView(req, res) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const  data = await accountModel.getInventoryByReview(account_id);
  const myReview = await utilities.manageReviews(data);
  try {
    // Retrieve the JWT token from the cookies
    const token = req.cookies.jwt;
    if (!token) {
      req.flash('notice', 'Please log in to access your account.');
      return res.redirect('/account/login');
    }

    // Verify the token and get the account data
    const accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const accountDetails = await accountModel.getAccountByEmail(accountData.account_email);
    
    if (!accountDetails) {
      req.flash('notice', 'Account not found.');
      return res.redirect('/account/login');
    }
    
    res.render('account/index', {
      title: 'Account Management',
      nav,
      accountDetails,
      errors: null,
      myReview,
      notice: req.flash('notice', 'Congratulations, you are successfully logged in.')
    });
  } catch (error) {
    req.flash('notice', 'An error occurred. Please try again.');
    res.redirect('/account/login');
  }
}

// Render the account update view
async function buildUpdateAccount(req, res){
  let nav = await utilities.getNav();
  
  res.render("account/update",{
      title: "Edit Account",
      nav,
      errors: null,
  })
}

async function updateAccount(req, res){
  const {account_firstname, account_lastname, account_email, account_password} = req.body;
  const account_id = parseInt(res.locals.accountData.account_id);
  let accountData = "";
  if (!account_password){
      const updateResult = await accountModel.updateAccount(
          account_firstname, 
          account_lastname, 
          account_email,
          account_id,
      )

      if(updateResult){

          req.flash(
              "notice",
              `Congratulations, your information has been updated.`
          );
          accountData = await accountModel.getAccountByEmail(account_email);
      }

  }else{
      //Handle password update
      //By Comparing the given password with the hashed password in the database
      let hashedPassword = await bcrypt.hashSync(account_password, 10);
      const updateResult = await accountModel.updatePassword(hashedPassword, account_id);
      if(updateResult){

          req.flash(
              "notice",
              `Congratulations, your information has been updated.`
          );
          accountData = updateResult;
      }
  }

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET);
      // Setting the token in a cookie
      if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
  res.redirect("/account");
}

async function logout(req, res, next){
  res.cookie('jwt', '', {maxAge:1});
  res.redirect("/");
}

async function editReview(req, res, next){
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id)
  const account_id = res.locals.accountData.account_id;
  const getReview = await accountModel.getReview(account_id,inv_id);
  const reviewText = getReview[0].review_text;
  const review_id = getReview[0].review_id;
  const vehicleName = `${getReview[0].inv_year} ${getReview[0].inv_make} ${getReview[0].inv_model}`;
  const date = Date();
  res.render("account/update-review", {
      title: "Edit " + vehicleName,
      nav,
      inv_id,
      review_id,
      date,
      reviewText,
      errors: null,
  })
}

async function updatedReview(req, res, next){
  const {review_text, review_id} = req.body;
  const review_date = new Date();
  const data = await accountModel.updateReview(review_text, review_date, review_id)
  if (data){
      res.redirect("/account")
  }else{
      console.log("there is a problem with the updateReview query");
  }
}

async function deleteReview(req, res, next){
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id)
  const account_id = res.locals.accountData.account_id;
  const getReview = await accountModel.getReview(account_id,inv_id);
  const reviewText = getReview[0].review_text;
  const review_id = getReview[0].review_id;
  const vehicleName = `${getReview[0].inv_year} ${getReview[0].inv_make} ${getReview[0].inv_model}`;
  const date = Date();
  res.render("account/delete-review", {
      title: "Delete " + vehicleName,
      nav,
      inv_id,
      review_id,
      date,
      reviewText,
      errors: null,
  })
}
async function deletedReview(req, res, next){
  const {review_id} = req.body;
  const data = await accountModel.deleteReview(review_id)
  if (data){
      res.redirect("/account")
  }else{
      console.log("there is a problem with the updateReview query");
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, accountManagementView, buildUpdateAccount, updateAccount, logout, editReview, updatedReview, deleteReview, deletedReview }