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

async function loginAccount( account_email, account_password){
  try {
      const sql = "SELECT (account_email, account_password, account_type) WHERE account_email = $1  AND account_password = $2 AND account_type = 'Client'"
      return await pool.query(sql, [account_email, account_password])
  } catch (error) {
  return error.message
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

  module.exports = { registerAccount, checkExistingEmail, loginAccount, checkExistingPassword };