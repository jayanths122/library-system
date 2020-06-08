/**
 * Checks if current time is between 10 AM and 5 PM. 
 *
 * @param {number} req Request object.
 * @param {number} res Response object.
 * @return {Boolean} true || false 
*/
const moment = require('moment');

module.exports.validTime = function () {
 
    // var startTime = '10:00:00';
    // var endTime = '17:00:00';
    
    // const currentDate = new Date();   
    
    // startDate = new Date(currentDate.getTime());
    // startDate.setHours(startTime.split(":")[0]);
    // startDate.setMinutes(startTime.split(":")[1]);
    // startDate.setSeconds(startTime.split(":")[2]);
    
    // endDate = new Date(currentDate.getTime());
    // endDate.setHours(endTime.split(":")[0]);
    // endDate.setMinutes(endTime.split(":")[1]);
    // endDate.setSeconds(endTime.split(":")[2]);
    
    // console.log('Is valid time ?', startDate < currentDate && endDate > currentDate);
    // console.log('Start date = ', startDate, '; Current = ', currentDate, '; End date = ', endTime);
    
    // var time = moment() gives you current time. no format required.

    // return (startDate < currentDate && endDate > currentDate);

    const format = 'hh:mm:ss'
    const date = moment.utc().format();

    const time = moment.utc(date).local().format();

    const beforeTime = moment('09:00:00', format),
    afterTime = moment('17:00:00', format);

    console.log('Start date = ', beforeTime, '; Current = ', time, '; End date = ', afterTime);
    
    return time.isBetween(beforeTime, afterTime);
}
