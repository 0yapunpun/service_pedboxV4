const service = {};
const mysql = require("../../lib/mysql");

mysql.crearconexion();

service.getCatalogColors = async(id_company) => {
  let query = `
    SELECT * FROM tbl_gen_color WHERE id_company = ${id_company};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getCatalogGyW = async(id_company) => {
  let query = `
    SELECT SUBSTRING(code,1,5) codep, description 
    FROM tbl_gen_item WHERE id_company = ${id_company} group by SUBSTRING(code,1,5) 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getCatalogDetailGyW = async(id_company, productCode) => { // colores y tallas por porducto
  let query = `
    SELECT SUBSTRING(code,1,5) codep, code, SUBSTRING(code,6,2) size, SUBSTRING(code,8,2) color FROM tbl_gen_item 
    WHERE id_company = ${id_company} AND SUBSTRING(code,1,5) = '${productCode}'
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getCodesCatalog = async(id_company) => { 
  let query = `
    SELECT code
    FROM tbl_gen_item
    where id_company = ${id_company} 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getImagesCatalog = async(id_company) => { 
  let query = `
    SELECT group_concat(id) id, group_concat(code) code , image
    FROM tbl_gen_item
    where id_company = ${id_company} and image <> ''
    GROUP BY image
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getProductsByCode = async(code) => { 
  let query = `
    SELECT code, id
    FROM tbl_gen_item
    WHERE code = "${code}" 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.addImgProduct = async(code, imgUrl) => { 
  let query = `
    UPDATE tbl_gen_item 
    SET image = "${imgUrl}"
    WHERE code = "${code}" 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

module.exports = service