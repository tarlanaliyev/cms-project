module.exports = {
    isEmpty: function(obj) {
        for(let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    // isEmpty: function(obj) {
    //     for(let key in obj) {
    //        console.log(`key: ${key}, value: ${obj[key]}`);
    //     }
    //     return true;
    // }

}