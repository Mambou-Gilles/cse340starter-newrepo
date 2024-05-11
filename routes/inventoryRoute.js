// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the inventory Single View page of the vehicle.
router.get("/detail/:vehicleViewId", invController.BuildVehiclePageViewId);

// Route to Handle Error.
router.get("/err", invController.errorHandling);

module.exports = router;