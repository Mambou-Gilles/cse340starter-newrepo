// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classificationValidator = require("../utilities/management-account-validation")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the inventory Single View page of the vehicle.
router.get("/detail/:vehicleViewId", invController.BuildVehiclePageViewId);

// Route to Handle Error.
router.get("/err", invController.errorHandling);
router.get('/', invController.buildManagement);


router.get('/add-classification', invController.buildAddClassification);
router.post(
    '/add-classification', 
    classificationValidator.classificationRules(),
    classificationValidator.checkClassificationData,
    invController.addClassification);

router.get('/add-inventory', invController.buildAddInventory);
router.post('/add-inventory', 
            classificationValidator.inventoryRules(), 
            classificationValidator.checkInventoryData,
            invController.addVehicleInventory);

module.exports = router;