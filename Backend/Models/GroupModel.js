const mongoose = require('mongoose');



const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    groupDescription: {
        type: String,
        required: true
    },
    userDetail : {
        type : Object,
    } ,
    groupMembers : {
        type : Array,
    } ,
    groupRequests : {
        type : Array,
    } ,
    topics: []
}, { timestamps: true });

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
