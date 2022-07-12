const service = {};
const mysql = require("../../lib/mysql_shikamaru");

mysql.crearconexion();

service.getUserRole = async(user, id_company) => { 
  let query = `
    SELECT id_role FROM tbl_gen_user where user = '${user}' and id_company = ${id_company}; 
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.getRolePermissions = async(id_role) => { 
  let query = `
    SELECT content FROM tbl_gen_configuration_role where id_role = ${id_role} AND id_configuration = 305
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}



module.exports = service