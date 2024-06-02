const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

// console.log(data)
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  Util.BuildPageView = async function(data) {
    let pageView; 
    
    pageView = "<div id=pageView>";
    
    data.forEach(vehicle => {
        
        pageView += "<div id=PagePicture>";
        pageView += '<img src="' + vehicle.inv_thumbnail +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors"/>';
        pageView += "</div>"; 
        pageView += "<div id=PagePictureDetail>";
        pageView += "<h3>" + vehicle.inv_make + ' '+ vehicle.inv_model + " Details </h3>";
        pageView += "<p><strong>Mileage:</strong> " + ' ' + vehicle.inv_miles + "</p>";
        pageView += "<p><strong>Price:</strong> " + ' ' + vehicle.inv_price + "</p>";
        pageView += "<p><strong>Color:</strong> " + ' ' + vehicle.inv_color + "</p>";
        pageView += "<p><strong>Description:</strong> " + ' ' + vehicle.inv_description + "</p>";
        
        
        pageView += "</div>";
    });
    
    // Close the single view container
    pageView += "</div>";
    
    // Return the built single view HTML
    return pageView;
}

Util.getManagementLinks = async function(req, res, next){
  return links = `<div id="management-links">
                    <a href="/inv/add-classification">Add New Classification</a><br><br>
                    <a href="/inv/add-inventory">Add new Vehicle</a>
                    </div>`;
}

Util.buildNewClassification = async function(res, req, next){
  return form = `<form action="/inv/add-classification" id="newClassifactorForm" method="post">
                  <h3><i>FIELD IS REQUIRED</i></h3>
                  <fieldset>
                  <h3>Classification Name</h3>
                  <label for="classificationName">NAME MUST BE ALPHABETIC CHARACTERS ONLY</label>
                  <input type="text" id="classification-name" name="classificationName" required>
                  <button type="submit">Add Classification</button>
                  </fieldset>
              </form>`
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = `<select name="classification_id" id="classificationList" class="classification-update-list" required>`
      classificationList += "<option value=''>Choose a Classification</option>"
      data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
          classification_id != null &&
          row.classification_id == classification_id
      ) {
          classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
      })
      classificationList += "</select>"
      
      return classificationList
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 // Middleware to check account type
// Util.checkAccountType = (req, res, next) => {
//   if (res.locals.accountData && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
//     next();
//   } else {
//     req.flash("error", "Unauthorized access");
//     res.redirect("/login");
//   }
// };


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
*  Check Login and Role
* ************************************ */
Util.checkEmpAdminPermissions = (req, res, next) => {
  // Check if the user is logged in
  if (!res.locals.loggedin) {
    req.flash("notice", " Please log in first");
    return res.redirect("/account/login");
  }
 
  // Check if the user has the role of "Employee" or "Admin"
  if (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin") {
    console.log("Permissions OK account type:", res.locals.accountData.account_type)
    // User has the required role, allow them to proceed
    next();
  } else {
    // User does not have the required role, redirect them with a flash message
    console.log("No permissions account type:", res.locals.accountData.account_type)
    req.flash("notice", "You do not have permission to access this page.");
    return res.redirect("/account/login"); // Redirect to a suitable page
  }
};

Util.reviewInventoryView = async function(review) {
  let reviewList;
  reviewList = "<ul>"

  // Ensure 'review' is an array and iterate over it
  if (Array.isArray(review) && review.length > 0) {
    review.forEach(element => {
        reviewList += `<li><p><strong>${element.account_firstname}</strong> wrote on the ${element.review_date}<p>
            <hr>
            <p>${element.review_text}</p>
        </li>`;
    });
  } else {
    // Handle case where there are no reviews
    reviewList +='<p id="no-reviews-message">No reviews available. Be the first to write a review.</p>';
  }
  
  reviewList += "</ul>";
  return reviewList;
}

Util.manageReviews = (data) =>{
  let dataTable = "<table><thead>";
  dataTable += "<tr><th>My reviews</th><td>&nbsp;</td><td>&nbsp;</td></tr>"; // Table header row
  dataTable += "</thead>";
  // Set up the table body
  dataTable += "<tbody>";
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) { // Loop through each vehicle data
      // Populate table rows with vehicle information and action links
      dataTable += `<tr><td>Reviewed the ${element.inv_year} ${element.inv_make} ${element.inv_model} on ${element.review_date}</td>`; // Vehicle make and model
      dataTable += `<td><a href='/account/review/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; // Link to edit the vehicle
      dataTable += `<td><a href='/account/review/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; // Link to delete the vehicle
  });
  dataTable += "</tbody></table>";
  return dataTable;
}


module.exports = Util