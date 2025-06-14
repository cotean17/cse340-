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

async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getAllClassifications() {
  const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");
  return result.rows;
}

async function addVehicle(data) {
  const sql = `
    INSERT INTO inventory (
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  `;
  const values = [
    data.classification_id,
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
  ];
  return await pool.query(sql, values);
}


module.exports = {
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  getAllClassifications,
  addVehicle,
};

