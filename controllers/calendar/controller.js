const controller = {};
const service = require('./service.js');


controller.birthdays = async(req, res, next) => {
  let id_company = req.params.id_company;

  let birthdays = await service.birthdays(id_company); 

  res.send(birthdays)
}

module.exports = controller