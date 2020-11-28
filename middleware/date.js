
exports.getDayNumber = function(){
     const today = new Date();
     return today.getDay();
}

exports.getDate = function(){

    const today = new Date();
    const options = {
      weekday:"long",
      day:"numeric",
      month:"long"
    };
    return today.toLocaleDateString("en-US",options);
     
}

exports.getDay = function(){
   
    const today = new Date();
    const dayOptions = {
        weekday:"long"
    }
    return today.toLocaleDateString("en-US",dayOptions);
    
}
