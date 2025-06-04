const pool = require("../database");

// Build dynamic nav
async function getNav() {
  try {
    const data = await pool.query("SELECT * FROM classification ORDER BY classification_name");
    let nav = '<ul>';
    nav += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach(row => {
      nav += `<li><a href="/inv/${row.classification_id}" title="View our ${row.classification_name} product line">${row.classification_name}</a></li>`;
    });
    nav += '</ul>';
    return nav;
  } catch (error) {
    console.error("Error building navigation:", error);
    throw error;
  }
}

// Build vehicle detail
async function buildVehicleDetail(vehicle) {
  let detail = `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div>
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> $${vehicle.inv_price.toLocaleString()}</p>
        <p><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString()}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p>${vehicle.inv_description}</p>
      </div>
    </div>
  `;
  return detail;
}

// Build classification grid
async function buildClassificationGrid(data) {
  let grid = '<ul id="inv-display">';
  data.forEach(vehicle => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <div>
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
        </div>
      </li>
    `;
  });
  grid += "</ul>";
  return grid;
}

module.exports = { getNav, buildVehicleDetail, buildClassificationGrid };
