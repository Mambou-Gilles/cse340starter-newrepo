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
  const classificationSelect = await utilities.buildClassificationList()
  const links = await utilities.getManagementLinks();
  res.render ("./inventory/management", {
    title: "Vehicle Management",
    nav,
    links,
    errors: null,
    classificationSelect,
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
  // Building classification select list
  const SelectList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
      title : "Add New Vehicle",
      nav, 
      SelectList,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.errorHandling = (req, res, next) => {
  const error = new Error("This is an error");
  next(error);
}

/**********************************
 * Code to build Edit Inventory View
 **********************************/
invCont.editInventoryView = async function(req, res, next){
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventory(inv_id);
    const classificationSelectList = await utilities.buildClassificationList(itemData[0]);
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/edit-inventory", {
        title : "Edit " + itemName,
        nav, 
        classificationSelectList,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        classification_id: itemData[0].classification_id
    })
}


/**********************************
 * Code to Update Inventory
 **********************************/
// invCont.updateInventory = async function(req, res, next){
//   const inv_id = parseInt(req.params.inv_id)
//   let nav = await utilities.getNav();
//   const itemData = await invModel.getInventory(inv_id);
//   const classificationSelectList = await utilities.buildClassificationList(itemData[0]);
//   const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
//   res.render("./inventory/edit-inventory", {
//       title : "Edit " + itemName,
//       nav, 
//       classificationSelectList,
//       errors: null,
//       inv_id: itemData[0].inv_id,
//       inv_make: itemData[0].inv_make,
//       inv_model: itemData[0].inv_model,
//       inv_year: itemData[0].inv_year,
//       inv_description: itemData[0].inv_description,
//       inv_image: itemData[0].inv_image,
//       inv_thumbnail: itemData[0].inv_thumbnail,
//       inv_price: itemData[0].inv_price,
//       inv_miles: itemData[0].inv_miles,
//       inv_color: itemData[0].inv_color,
//       classification_id: itemData[0].classification_id
//   })


// }


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  // Handling success or failure of updating inventory data
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Delete Confirmation of Inventory View Data
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
   // Extraction of inventory ID from request body
   const inv_id = parseInt(req.body.inv_id)
   let nav = await utilities.getNav()
  const itemData = await invModel.getInventory(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav, // Navigation data
    errors:null,
    inv_id: inventoryData[0].inv_id,
    inv_make: inventoryData[0].inv_make,
    inv_model: inventoryData[0].inv_model,
    inv_year: inventoryData[0].inv_year,
    inv_price: inventoryData[0].inv_price,
  })  
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */

// Controller function to delete inventory data
invCont.deleteInventory = async function (req, res, next) {
  // Extracting inventory ID from request body
  const inv_id = parseInt(req.body.inv_id)
  // Deleting inventory item
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  // Handling success or failure of deleting inventory data
  if (deleteResult) {
      req.flash("notice", `The item was successfully deleted.`);
      res.redirect("/inv/");
  } else {
      const itemName = `${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, the delete failed.");
      res.redirect("inventory/delete/inv_id");
  }
}

module.exports = invCont