/**
 * Checks if current time is between 10 AM and 5 PM. 
 *
 * @param {number} req Request object.
 * @param {number} res Response object.
 * @return {Boolean} true || false 
*/
module.exports.validTime = function () {

    var startTime = '10:00:00';
    var endTime = '17:00:00';
    
    const currentDate = new Date(new Date().toISOString())   
    
    startDate = new Date(currentDate.getTime());
    startDate.setHours(startTime.split(":")[0]);
    startDate.setMinutes(startTime.split(":")[1]);
    startDate.setSeconds(startTime.split(":")[2]);
    
    endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds(endTime.split(":")[2]);
    
    console.log('Is valid time ?', startDate < currentDate && endDate > currentDate);
    console.log('Start date = ', startDate, '; Current = ', currentDate, '; End date = ', endTime);
    

    return (startDate < currentDate && endDate > currentDate);
}