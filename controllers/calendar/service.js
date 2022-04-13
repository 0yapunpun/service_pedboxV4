const service = {};
const mysql = require("../../lib/mysql");

mysql.crearconexion();

service.birthdays = async(id_company) => {
  let query = `
    SELECT u.id, p.num_identification, p.date_birth, p.first_name, p.first_name, p.second_name, p.first_lastname, p.photo 
    FROM tbl_gen_person p 
    INNER JOIN tbl_gen_user u ON p.id = u.id_person and p.id_company = u.id_company
    where p.id_company = ${id_company} and p.is_employee = 1 and u.status = 1 AND p.date_birth <> '0000-00-00'
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

module.exports = service