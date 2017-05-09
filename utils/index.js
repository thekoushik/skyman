var mongoose = require('mongoose');
module.exports.userDTOProps='_id name email username dateCreated enabled';
module.exports.userDTOPropsFull='_id name email username dateCreated enabled accountNonLocked accountNonExpired credentialsNonExpired';
module.exports.createId=function(str){
    return new mongoose.Types.ObjectId(str);
}