const controller = {};
const service = require('./service.js');


controller.birthdays = async(req, res, next) => {
  let birthdays = await service.birthdays(req.params.id_company); 
  res.send(birthdays)
}

controller.currentBirthdays = async(req, res, next) => {  
  let birthdays = await service.birthdays(req.params.id_company); 
  if (birthdays.success && birthdays.result.length) {
    birthdays = birthdays.result;
    let currentDate = new Date();
    let currentBirthdays = [];
    
    for (let i = 0; i < birthdays.length; i++) {
      let day = new Date(birthdays[i].date_birth);
      if ((day.getDate() + 1 == currentDate.getDate()) && (day.getMonth() == currentDate.getMonth())) {
        currentBirthdays.push(birthdays[i])
      }
    }
    res.send(currentBirthdays)
  } else {
    res.send([])
  }
}

module.exports = controller