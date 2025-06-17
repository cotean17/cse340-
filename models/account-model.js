const pool = require("../database/");

async function registerAccount(firstname, lastname, email, password) {
  const sql = `
    INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  return pool.query(sql, [firstname, lastname, email, password]);
}

async function getAccountByEmail(email) {
  const sql = `SELECT * FROM account WHERE account_email = $1;`;
  const result = await pool.query(sql, [email]);
  return result.rows[0];
}

async function updateAccount(account_id, firstname, lastname, email) {
    try {
      const sql = `
        UPDATE account
        SET account_firstname = $1,
            account_lastname = $2,
            account_email = $3
        WHERE account_id = $4
        RETURNING *;
      `;
      const data = await pool.query(sql, [firstname, lastname, email, account_id]);
      return data.rows[0];
    } catch (error) {
      console.error("Update account error:", error);
      return null;
    }
  }
  

async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *;
  `;
  const result = await pool.query(sql, [hashedPassword, account_id]);
  return result.rowCount;
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  updateAccount,
  updatePassword
};
