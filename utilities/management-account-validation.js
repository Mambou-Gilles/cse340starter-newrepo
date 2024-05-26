const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/***********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
      body("classificationName")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
        .custom(async (classification_name) => {
            const classificationExists = await accountModel.checkExistingClassification(classification_name)
            if (classificationExists){
              throw new Error("Email exists. Please log in or use different email")
            }
          }),      
    ]
  }

  /***********************************
*  Classification Data Check
* ********************************* */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors =validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        const form = await utilities.buildNewClassification()
        res.render("/inventory/add-classification", {
            errors,
            title: "Add new Classifications",
            nav,
            form,
            classification_name,
        })
        return
    }
    next()
}

validate.inventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please select a classification"), // on error this message is sent.
    
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a make name, min 3 character."), // on error this message is sent.
    
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please enter a description min 10 character."),
        
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 6 })
            .withMessage("Please enter a valid price"),

        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4 })
            .isLength({ max: 4 })
            // .isNumeric()
            .withMessage("Please enter a valid year"),


        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4 })
            // .isNumeric()
            .withMessage("Please enter a valid price"),
// ,

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a valid color"),

        ]
    }


validate.checkInventoryData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const list = await utilities.buildClassificationList();
        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            errors,
            list,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color
        })
        return
        }
        next()
    }


validate.checkUpdateData = async (req, res, next) => {
    const {inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const list = await utilities.buildClassificationList();
        res.render("inventory/edit-inventory", {
            title: "Edit",
            nav,
            errors,
            list,
            inv_id,
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
        })
        return
    }
        next()
}

module.exports = validate;