const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

// async function loginAccount( account_email, account_password){
//     try {
//         const sql = "SELECT (account_email, account_password, account_type) WHERE account_email = $1  AND account_password = $2 AND account_type = 'Client'"
//         const result = await pool.query(sql, [account_email, account_password])

//         if(result.rows.length === 0) {
//           return 'Invalid email or password'
//         }
//         return result.rows[0]
//     } catch (error) {
//     return error.message
//     }
// }

// // USE FOR ACCOUNT MANAGEMENT
// async function loginAccount( account_email, account_password){
//   try {
//       const sql = "SELECT account_email, account_password, account_type WHERE account_email = $1  AND account_password = $2 AND account_type = 'Client'"
//       return await pool.query(sql, [account_email, account_password])
//   } catch (error) {
//   return error.message
//   }
// }

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}



  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing password
 * ********************* */
async function checkExistingPassword(account_email){
  try {
    const sql = "SELECT account_password FROM account WHERE account_email = $1"
      const password = await pool.query(sql, [account_email])
      return password.rowCount
      } catch (error) {
      return error.message
      }
  }

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateAccount(
  account_firstname, 
  account_lastname, 
  account_email,
  account_id,
) {
  try {
    
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    // Error handling: logging the error to the console
    console.error("updateAccount error: " + error);
  }
}

/* ***************************
 *  Update Inventory PasswordData
 * ************************** */
async function updatePassword(
  account_password,
  account_id,
) {
  try {
    // Performing a database query to update inventory data
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [
      account_password,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    // Error handling: logging the error to the console
    console.error("updateAccount error: " + error);
  }
}

async function getInventoryByReview(account_id){
  try{
    const sql = `SELECT iv.inv_id, review_id, inv_year, inv_make, inv_model, review_date FROM public.review AS rv JOIN public.inventory AS iv
    ON rv.inv_id = iv.inv_id WHERE rv.account_id = $1`;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  }catch(error){
      return error.message;
  }
}

async function getReview(account_id, inv_id){
  try{
    const sql = `SELECT review_id, account_id, review_date, review_text, inv_year, inv_make, inv_model
                  FROM public.review AS rv JOIN public.inventory AS iv
                  ON rv.inv_id = iv.inv_id WHERE account_id = $1 AND iv.inv_id = $2`
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rows;
  }catch(error){
    new Error(`getReview model ${error}`);
  }
}
 
async function updateReview(review_text, review_date, review_id){
  try {
      const sql = `UPDATE public.review SET review_text = $1, review_date = $2 WHERE review_id = $3 RETURNING *`
      const data = await pool.query(sql, [review_text, review_date, review_id]);
      return data.rows[0];
  } catch (error) {
    new Error(`error in the query UpdateReview ${error}`)
  }
}
async function deleteReview(review_id){
  try {
      const sql = `DELETE FROM public.review WHERE review_id = $1 RETURNING *`
      const data = await pool.query(sql, [review_id]);
      return data.rows[0];
  } catch (error) {
    new Error(`error in the query UpdateReview ${error}`)
  }
}

  module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, checkExistingPassword, updatePassword, getInventoryByReview, getReview, updateReview, deleteReview   };