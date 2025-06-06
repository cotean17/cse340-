const pool = require("../database");

async function getInventoryByClassificationId(classification_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM inventory AS i
       JOIN classification AS c ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Database query failed: " + error);
  }
}

async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
        `SELECT i.*, c.classification_name 
        FROM inventory i
        JOIN classification c ON i.classification_id = c.classification_id
        WHERE inv_id = $1`,
       [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    throw new Error("Error getting vehicle by ID");
  }
}

module.exports = {
  getInventoryByClassificationId,
  getVehicleById
};
