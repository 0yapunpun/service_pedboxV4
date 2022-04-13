const service = {};
const mysql = require("../../lib/mysql");

mysql.crearconexion();

service.getNotifications = async(id_user) => {
  let query = `
    SELECT * FROM tbl_gen_notifications WHERE id_user = ${id_user};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.createNotification = async(data) => {
  let query = `
    INSERT INTO tbl_gen_notifications (kind, id_company, id_user, open, title, message, type, params, date)
    VALUES (${data.kind}, ${data.id_company}, ${data.id_user}, ${data.open}, "${data.title}", "${data.message}", "${data.type}", "${data.params}", "${data.date}");
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}

service.removeNotificationByKind = async(id_user, kind) => {
  let query = `
    DELETE FROM tbl_gen_notifications WHERE id_user = ${id_user} AND kind = ${kind};
  `;

  const { e, r } = await mysql.aQuery(query);

  if (e) { console.log("Query Failed", e); return {'success': false }};
  return {'success': true, 'result': r };
}



module.exports = service