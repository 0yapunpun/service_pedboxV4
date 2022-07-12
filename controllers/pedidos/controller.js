const controller = {};
const fetch = require('node-fetch');
const service = require('./service.js');
const config = require('../../config.js');
const crypto = require("crypto");

const options = (method, body) => { 
  var opt = {method: method, headers: {'Content-Type': 'application/json'}}; 
  if (method == 'post' || method == 'put' || method == 'delete') opt['body'] = JSON.stringify(body);
  return opt;
}

const makeRequest = async (url, options) => {
  try {
      var resp = await fetch(url, options || {});
      if (!resp.ok) return {'err': 'Error obteniendo los datos'};
      const json = await resp.json();
      return {'result': json};
  } catch(error) {
      return {'err': 'Error obteniendo los datos', 'err_service': error};
  }
}

const makeRequestXML = async (url, options) => {
  try {
      var resp = await fetch(url, options || {});
      let xml = await resp.text();
      const json = xml_json.xml2json(xml, {compact: false, spaces: 2, trim: true})
      return {'result': JSON.parse(json)};
  } catch(error) {
      showLog('REQUEST URL: '+url, error);
      return {'err': 'Error obteniendo los datos', 'err_service': error};
  }
}

controller.sendOrder = async(req, res, next) => {
  let data = req.body;
  let bodyRequest = null;
  let responseService = null;
  let hasPermission = false;

  let userRole = await service.getUserRole(data.user_request, data.id_company); 

  if (userRole.result.length) {
    let roleHasPermission = await service.getRolePermissions(userRole.result[0].id_role);
    if (roleHasPermission.result.length) {
      if (roleHasPermission.result[0].content == 'S') {
        hasPermission = true;
      } 
    } 
  }
    
  if (!hasPermission) {
    bodyRequest = {
      pbodega: data.seller['id_warehouse'].toString(),
      pnit: data.nit.toString(),
      pvendedor: data.seller['nit'].toString() || data.seller['id_seller'].toString(),
      pfecha: data.date.replace(/(\-)/g, ''),
      pfechadespacho: data.date.replace(/(\-)/g, '') ,
      pdireccion: data.address || '',
      popt1: data.address_code || '',
      pdescuento: data.total_disocunt.toString(),
      ptotal: data.total.toString(),
      pnota: data.note,   
      pequipo: data.equipo,
      plongitud: data.longitude || '',
      platitud: data.latitude || '',
      pempresa: data.id_company,
      pimei: data.imei || '0.0.0.0',
      pusuario: data.usuario,
      pitems: data.items,
      ptipo: "1",
      popt2: "0",
      op: "pedido",
      pdocumento: "",
      pdias: '0',
      pcondicion: '0',
    };
  } else {
    bodyRequest = {
      createMonitoring: "true",
      Sellers: [data.seller['nit'].toString() || data.seller['id_seller'].toString()],
      Monitoring: [],
      EncQuotation: {
        imei: data.imei || '0.0.0.0',
        id_company: data.id_company,
        nit_customer: data.nit_customer.toString(),
        id_warehouse: data.seller['id_warehouse'].toString(),
        id_seller: data.seller['id_seller'].toString(),
        id_user: data.seller['id_seller'].toString(),
        longitude: data.longitude || '',
        latitude: data.latitude || '',
        state: hasPermission ? 1 : 0,
        id_address: data.address_code || '0', 
        amount: Math.round(data.total).toString(),
        note: data.note || '',
        date: data.date.replace(/(\-)/g, ''),
        date_send: '',
        document_ref: '',
        equipment: data.equipo,
        type: 2000,
        id_mobile: '',
        id_payment_way: '0',
        id_limit_time: '0',
        tax: Math.round(data.iva_total).toString() 
      },
      Parameters: {
        setNumQuotation: "true",
        sendMail: hasPermission,
        createMonitoring: "true"
      },
      DetQuotation: data.DetQuotation, 
    }; 
  }

  console.log(bodyRequest)
  // return res.send(true)

  if (!hasPermission) {
    let randomIdentifier = crypto.randomBytes(16).toString("hex");
    let url = "http://localhost/genesis4/wsdata.asmx?wsdl"
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'text/xml' },
      body: `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <pedido xmlns="${url}">
              <pbodega>${bodyRequest.pbodega}</pbodega>
              <pnumero>${bodyRequest.pnumero || randomIdentifier}</pnumero> 
              <pnit>${bodyRequest.pnit}</pnit>
              <pvendedor>${bodyRequest.pvendedor}</pvendedor>
              <pfecha>${bodyRequest.pfecha}</pfecha>
              <pcondicion>${bodyRequest.pcondicion}</pcondicion>
              <pdias>${bodyRequest.pdias}</pdias>
              <pdescuento>${bodyRequest.pdiapdescuentos}</pdescuento>
              <ptotal>${bodyRequest.ptotal}</ptotal>
              <pnota>${bodyRequest.pnota}</pnota>
              <pequipo>${bodyRequest.pequipo}</pequipo>
              <pitems>${bodyRequest.pitems}</pitems>
              <plongitud>${bodyRequest.plongitud}</plongitud>
              <platitud>${bodyRequest.platitud}</platitud>
              <pempresa>${bodyRequest.pempresa}</pempresa>
              <pimei>${bodyRequest.pimei}</pimei>
              <pusuario>${bodyRequest.pusuario}</pusuario>
              <pfechadespacho>${bodyRequest.pfechadespacho}</pfechadespacho>
              <ptipo>${bodyRequest.ptipo}</ptipo>
              <pdireccion>${bodyRequest.pdireccion}</pdireccion>
              <pdocumento>${bodyRequest.pdocumento}</pdocumento>
              <popt1>${bodyRequest.popt1}</popt1>
              <popt2>${bodyRequest.popt2}</popt2>
            </pedido>
          </soap:Body>
        </soap:Envelope>
      `,
    }
    responseService = await makeRequestXML(url, options);
  } else {
    responseService = await makeRequest('https://api.pedbox.co:8590/extranetQuotation', options('post', bodyRequest))
  }

  res.send(responseService)
}

module.exports = controller