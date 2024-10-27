const mongoose = require('mongoose');

const RoomsSchema=new mongoose.Schema({
    room_number:{
        type:String
    },
    // 'room','sweet','shaleh
    type:{
        type:String,
        enum:['room','sweet','shaleh']
    },
    priceForUser:{
        type:String,
        default:'0'
    },
    priceForArmy:{
        type:String,
        default:'0'
    },
    priceForDarMember:{
        type:String,
        default:'0'
    }
});

module.exports=mongoose.model('Room',RoomsSchema);