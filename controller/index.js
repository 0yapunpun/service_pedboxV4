const controller = {};
const mysql = require("../lib/mysql");

mysql.crearconexion();

controller.index = async(req, res, next) => {
  res.send({success: true})
}

module.exports = controller