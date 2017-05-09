var mongoose = require('mongoose');
module.exports.userDTOProps='_id name email username dateCreated';
module.exports.userDTOPropsFull='_id name email username dateCreated enabled accountNonLocked accountNonExpired credentialsNonExpired roles';
module.exports.createId=function(str){
    return new mongoose.Types.ObjectId(str);
}