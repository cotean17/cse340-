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


// Build vehicle detail view
async function buildVehicleDetail(vehicle) {
  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model} - full vehicle image">
      <div>
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> $${Number(vehicle.inv_price).toLocaleString()}</p>
        <p><strong>Miles:</strong> ${Number(vehicle.inv_miles).toLocaleString()}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p>${vehicle.inv_description}</p> 
      </div>
    </div>
  `;
}

// Build classification grid view (clean version)
async function buildClassificationGrid(data) {
  let grid = '<ul id="inv-display">';
  data.forEach(vehicle => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Thumbnail of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        </a>

      </li>
    `;
  });
  grid += "</ul>";
  return grid;
}

module.exports = {
  getNav,
  buildVehicleDetail,
  buildClassificationGrid
};
