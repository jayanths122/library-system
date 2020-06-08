/**
 * Checks if current time is between 10 AM and 5 PM. 
 *
 * @param {number} req Request object.
 * @param {number} res Response object.
 * @return {Boolean} true || false 
*/
module.exports.validTime = function () {

    console.log('Is valid time called ', validTime());

    var startTime = '10:00:00';
    var endTime = '17:00:00';
    
    currentDate = new Date()   
    
    startDate = new Date(currentDate.getTime());
    startDate.setHours(startTime.split(":")[0]);
    startDate.setMinutes(startTime.split(":")[1]);
    startDate.setSeconds(startTime.split(":")[2]);
    
    endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds(endTime.split(":")[2]);
    
    return (startDate < currentDate && endDate > currentDate);
}