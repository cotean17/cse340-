const pool = require("../database/");

// Add a favorite
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("addFavorite error:", error);
  }
}

// Check if a favorite already exists
async function checkFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT * FROM favorites
      WHERE account_id = $1 AND inv_id = $2;
    `;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("checkFavorite error:", error);
  }
}

// Get all favorites for an account
async function getFavorites(account_id) {
  try {
    const sql = `
    SELECT f.*, i.inv_make, i.inv_model, i.inv_year, i.inv_thumbnail
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY i.inv_make, i.inv_model;
  `;
  
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("getFavorites error:", error);
  }
}

module.exports = {
  addFavorite,
  checkFavorite,
  getFavorites,
};
