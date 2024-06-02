const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }


/**** GET INVENTORY BY ID FOR THE VEHICLES */
async function getInventory(vehicle_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = ${vehicle_id}`
    );
    return data.rows;
  } catch (error) {
    console.error("getInventory error " + error);
  }
}

async function addClassification(newClassification){
  try{
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [newClassification])
  }catch (error){
    console.error("addClassification error" + error);
  }
}

async function addVehicleInventory( 
  classification_id, 
  inv_make, 
  inv_model, 
  inv_description, 
  inv_image, 
  inv_thumbnail, 
  inv_price, 
  inv_year, 
  inv_miles, 
  inv_color){
    try{
      const sql = `INSERT INTO public.inventory 
                    (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
      return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    }catch (error){
      console.error("addVehicle error" + error);
    }
  }


  /* ***************************
 *  Checking for Existing Classifications
  ******************************/
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification = $1"
    return classTable = await pool.query(sql, [classification_name])
    return classTable.rowCount
    } catch (error) {
      return error.message
    }
}
  
// async function addVehicleInventory( classification_id, inv_make, 
//   inv_model, 
//   inv_description, 
//   inv_image, 
//   inv_thumbnail, 
//   inv_price, 
//   inv_year, 
//   inv_miles, 
//   inv_color){
//     try{
//       const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
//       return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
//     }catch (error){
//       console.error("addVehicle error" + error);
//     }
//   }


  /* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    // Performing a database query to delete an inventory item
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    // Error handling: creating a new error object
    new Error("Delete Inventory Error");
  }
}

/* ***************************
 *  Add Review Inventory Item
 * ************************** */
async function addAReview(review_description, date, inv_id, account_id){
  try{
    const sql = `INSERT INTO review (review_text, review_date, inv_id, account_id) VALUES( $1, $2, $3, $4) RETURNING*`;
    const data = await pool.query(sql, [review_description, date, inv_id, account_id]);
    return data;
  }catch (error) {
    new Error("Add review to the inventory error");
  }
}

async function getReviews(vehicle_id){
  try{
    const sql = `SELECT account_firstname, review_date, review_text FROM public.review AS rview JOIN public.account AS acc 
    ON rview.account_id = acc.account_id WHERE rview.inv_id = $1;`;
    const data = await pool.query(sql, [vehicle_id]);
    return data.rows;
  }catch{
    new Error ("get review failed.");
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventory, addClassification, checkExistingClassification, addVehicleInventory, updateInventory, deleteInventoryItem, addAReview, getReviews};

