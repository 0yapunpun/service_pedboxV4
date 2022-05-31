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
    SELECT SUBSTRING(code,1,5) codep, SUBSTRING(code,6,9) codeC, description, image, image_array 
    FROM tbl_gen_item WHERE id_company = ${id_company} group by SUBSTRING(code,1,5) 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.catalogGyWPrueba = async(id_company) => {
  let query = `
    SELECT code, description, image, image_array, id
    FROM tbl_gen_item WHERE id_company = ${id_company} 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.catalogAttributeByIdItem = async(id_item) => {
  let query = `
    SELECT id_item, id_detail_attribute
    FROM tbl_gen_item_attribute WHERE id_item = ${id_item} 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

// ***
service.catalogAttributeDetailDesc = async(id_attribute) => { 
  let query = `
    SELECT id, id_attribute, description
    FROM tbl_gen_attribute_detail
    WHERE id = ${id_attribute}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.catalogAttributeDesc = async(id) => { 
  let query = `
    SELECT id, description
    FROM tbl_gen_attribute
    WHERE id = ${id}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}
// ***

service.catalogAttributeAndDetailDescription = async(id_attribute) => { 
  let query = `
    SELECT a.description, a.id, d.description, d.id
    FROM tbl_gen_attribute_detail d
    LEFT JOIN tbl_gen_attribute a
    ON  a.id = d.id_attribute 
    WHERE d.id = ${id_attribute}
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

service.getCodesSubstringCatalog = async(id_company) => {  // TODO
  let query = `
    SELECT SUBSTRING(code,1,5) codep, description
    FROM tbl_gen_item 
    WHERE id_company = ${id_company} group by SUBSTRING(code,1,5) 
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

service.getAttachmentsCatalog = async(id_company) => { 
  let query = `
    SELECT id_item, group_concat(id) id, group_concat(url) url,  group_concat(seq) seq
    FROM tbl_gen_item_attachments
    where id_company = ${id_company}
    GROUP BY id_item
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

service.getProductsById = async(id) => { 
  let query = `
    SELECT code, id
    FROM tbl_gen_item
    WHERE id = "${id}" 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getProductsByCodeSubstring = async(code, id_company) => { 
  let query = `
    SELECT code, id
    FROM tbl_gen_item
    WHERE code LIKE "${code}%" and id_company = ${id_company}
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

service.removeImgProduct = async(code, id_company) => { 
  let query = `
    UPDATE tbl_gen_item 
    SET image = ""
    WHERE code = "${code}" and id_company = ${id_company}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.addAttachments = async(data) => { 
  let query = `
    INSERT INTO tbl_gen_item_attachments (id_company, id_item, type, url, name_file, in_quotation,  description, seq)
    VALUES (${data.id_company}, ${data.id_item}, "${data.type}", "${data.url}", "${data.name_file}", ${data.in_quotation}, "${data.description}", ${data.sequence});
    SELECT LAST_INSERT_ID()
  `;

  const { e, r } = await mysql.aQuery(query);
  
  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getImageByIdItem = async(id_item) => { 
  let query = `
    SELECT *
    FROM tbl_gen_item 
    WHERE code = ${id_item}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getAttachmentsById = async(id_item) => { 
  let query = `
    SELECT *
    FROM tbl_gen_item_attachments 
    WHERE id = ${id_item}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.relateImagesArrayToItem = async(id_item, image_array) => { 
  let query = `
    UPDATE tbl_gen_item 
    SET image_array = "${image_array}"
    WHERE code = ${id_item}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getProductBycodeColor = async (code, code_color) => { 
  let query = `
    SELECT *
    FROM tbl_gen_item
    WHERE code LIKE "${code}%${code_color}" 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getAttributesDestailCatalog = async (id_company) => { 
  let query = `
    SELECT * 
    FROM tbl_gen_attribute_detail 
    WHERE id_company = ${id_company};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getAttributesCatalog = async (id_company) => { 
  let query = `
    SELECT * 
    FROM tbl_gen_attribute 
    WHERE id_company = ${id_company};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.addAttributeItem = async (body, id_item) => { 
  let query = `
    INSERT INTO tbl_gen_item_attribute (id_company, id_item, id_detail_attribute, status, id_user)
    VALUES (${body.id_company}, ${id_item}, ${body.id_attribute}, ${body.status}, ${body.idUser});
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.catalogAttributesByAttributeId = async (id_attribute) => { 
  let query = `
    SELECT id_item
    FROM tbl_gen_item_attribute
    WHERE id_detail_attribute = ${id_attribute}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.deleteAttributeById = async(id, id_attribute) => { 
  let query = `
    DELETE 
    FROM tbl_gen_item_attribute 
    WHERE id_item = "${id}" AND id_detail_attribute = ${id_attribute}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.deleteAttachmentDetailAttribute = async(id_imgage, id_attribute) => { 
  let query = `
    DELETE 
    FROM tbl_gen_attribute_detail_attachments 
    WHERE id = "${id_imgage}" AND id_attribute_detail = ${id_attribute}
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}





module.exports = service