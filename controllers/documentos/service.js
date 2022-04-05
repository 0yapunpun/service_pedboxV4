const service = {};
const mysql = require("../../lib/mysql");

mysql.crearconexion();

service.createDocumentRegister = async(data) => {
  let query = `
    INSERT INTO tbl_b2b_files (id_company, nit, year, id_type_file, type, name_file)
    VALUES (${data.id_company}, "${data.nit}", ${data.year}, ${data.id_type_file}, "${data.type}", "${data.name_file}");
    SELECT LAST_INSERT_ID()
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getMasters = async() => {
  let query = `
    SELECT * FROM tbl_b2b_master_files
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.deleteDocumentRegister = async(id) => {
  let query = `
    DELETE FROM tbl_b2b_files WHERE id = ${id};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getDocuments = async(id_company) => {
  let query = `
    SELECT * FROM tbl_b2b_files WHERE id_company = ${id_company};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getDocumentNameById = async(id) => {
  let query = `
    SELECT name_file FROM tbl_b2b_files WHERE id = ${id};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

module.exports = service