const invModel = require("../models/inventory-model")
const Util = {}

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
  return form = `<form action="/inv/add-classification" id="newClassificationForm" method="post">
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
  let classificationList = `<form class="new-vehicle-form" action="/inv/add-inventory" method="post">
      <select name="classification_id" id="classificationList" required>`
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
      classificationList += `<label for="make">Make</label>
                              <input type="text" id="make" name="inv_make" required>

                              <label for="model">Model</label>
                              <input type="text" id="model" name="inv_model"required>

                              <label for="description">Description</label>
                              <textarea type="text" id="description" name="inv_description"required></textarea>

                              <label id="image">image Path</label>
                              <input type="text" id="image" name="inv_image" value="/images/vehicles/no-image.png" required>

                              <label id="thumbnail">thumbnail Path</label>
                              <input type="text" id="thumbnail" name="inv_thumbnail" value="/images/vehicles/no-image.png" required>


                              <label id="price">Price</label>
                              <input type="decimal" id="price" name="inv_price" placeholder="decimal or integer"  required>


                              <label id="year">Year</label>
                              <input type="number" id="year" name="inv_year" placeholder="4-digit year" pattern="^\d{4}$" required>


                              <label id="miles">Miles</label>
                              <input type="number" id="miles" name="inv_miles" placeholder="digits only" pattern="^\d+$" required>


                              <label id="color">Color</label>
                              <input type="text" id="color" name="inv_color"required>


                              <button type="submit">Add Vehicle</button>
                              </form>`
      return classificationList
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util