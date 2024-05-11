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

invCont.errorHandling = (req, res, next) => {
  const error = new Error("This is an error");
  next(error);
}

module.exports = invCont