const mysql = require('mysql'); //conector sql server.
const { promisify } = require('util')

//Atributos
var poolconnection;
//generador de string de consultas sql server
var conexionmysql = exports = module.exports = {};
//Configuración de conexión Mysql
var config = {
  host: '104.236.159.193',
  user: 'Pedbox_pyme',
  password: 'pyme2017',
  database: 'kakashi',
  timezone: 'America/Bogota',
  multipleStatements: true,
  connectionTimeout: 1000,
  requestTimeout: 1000,
  debug: false,
  AcquireTimeout: 1000,
  idleTimeoutMillis: 1000,
  pool: {
    max: 1000,
    min: 0,
    AcquireTimeout: 1000,
    idleTimeoutMillis: 1000,
  }
};

conexionmysql.crearconexion = (configaux) => {
  poolconnection = poolconnection || mysql.createPool(config);
}

conexionmysql.aQuery = async (strQuery) => {
  const conn = await (promisify(poolconnection.getConnection).bind(poolconnection))();
  const query = promisify(poolconnection.query).bind(poolconnection);

  try{
    const result = await query(strQuery);
    conn.release();
    return {'e': null, 'r': result};
  } catch(err) {
    return {'e': err};
  }
}

conexionmysql.query = function(strquery,callback) {
  poolconnection.getConnection(function(err, connection) {
    if (err) {
      callback(err, undefined);
    } else {
      connection.query(strquery, function (err, result) {
        if (err) {
            connection.release();
            callback(err,undefined)
        } else {
            connection.release();
            callback(undefined,result)
        }
      });
    }
  });
};
