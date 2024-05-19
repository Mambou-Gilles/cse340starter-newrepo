const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ******************************
 *  Function to build single Inventory Page View
 * ************************** */
invCont.BuildVehiclePageViewId = async function(req, res, next) {    
  const vehicle_id = req.params.vehicleViewId;
  const data = await invModel.getInventory(vehicle_id);
  const vehicleView = await utilities.BuildPageView(data);
  let nav = await utilities.getNav();
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model} `;
  res.render("./inventory/vehicleView", {
      title: className, 
      nav, 
      vehicleView, 
  });
};

invCont.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav();
  const links = await utilities.getManagementLinks();
  res.render ("./inventory/management", {
    title: "Vehicle Management",
    nav,
    links
  })
}

invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav();
  const form = await utilities.buildNewClassification();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    form,
    errors: null,
  })

}

invCont.addClassification = async function(req, res, next){
  let nav = await utilities.getNav();
  const {classificationName} = req.body;
  const newClassification = await invModel.addClassification(classificationName);

  if(newClassification){
      req.flash(
          "notice", 
          `${classificationName} has been addedd as to classification.`
      )
      res.redirect("./")
  } else {
    req.flash("notice", "Classification not added, try again")
    res.status(501).render("inventory/add-classification", {
        title: "Add New Vehicle",
        nav
    })
  }
}


invCont.buildAddInventory = async function(req, res, next){
  let nav = await utilities.getNav();
  const list = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
      title : "Add New Vehicle",
      nav, 
      list,
      errors: null,
  })
}

invCont.addVehicleInventory = async function(req, res, next){
  let nav = await utilities.getNav();
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;
  const newVehicle = await invModel.addVehicleInventory(
      classification_id,
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color,
  );
  
  if (newVehicle) {
      req.flash(
          "notice",
          `${inv_make} ${inv_model} has been added.`
      )
      res.redirect("./")

  } else {
      req.flash("notice", "Classification not added, try again")
      res.status(501).render("inventory/add-inventory", {
          title: "Add New Inventory",
          nav,
      })
  }
}

invCont.errorHandling = (req, res, next) => {
  const error = new Error("This is an error");
  next(error);
}

module.exports = invCont