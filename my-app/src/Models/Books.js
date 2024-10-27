const mongoose = require('mongoose');

const BookingsSchema = mongoose.Schema({
    serialNumber: {
        type: String
    },
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    type: {
        type: String,
        enum: ['madany', 'darMember', 'army', 'admin', 'reception']
    },
    // رقم الغرفة
    roomNumber:{
        type:String
    },
    // ملاحظات
    // notes:{
    //     type:String
    // },
    // اسم الموظف
    // reception_name:{
    //     type:String
    // },
    // سعر الغرفة
    roomPrice: {
        type: String
    },
    numberOfDays: {
        type: String
    },
    // المبلغ المدفوع
    paidPrice: {
        type: String
    },
    // مبلغ التأمين
    ensurancePrice: {
        type: String,
      //  default:'0'
    },
    // حجز من غير مبلغ تأمين
    zeroEnsurancePrice:{
        type:Boolean,
        default:false
    },
    // المبلغ النهائي
    finalPrice: {
        type: String
    },
    // مبلغ الاستكمال
    completePrice: {
        type: String,
        default:'0'
    },
    // رسوم اضافية
    extraPrice: {
        type: String,
        default:'0'
    },
    // المستقطع من التأمين
    subEnsurancePrice:{
         type: String,
        default:'0'
    },
    // الحجز المبلغ المسترد في حالة نقل
    transferPrice:{
         type: String,
        default:'0'
    },
    bookerName:{
        type:String
    },
    bookDate:{
        type:Date
    },
    notes:{
        type:String
    },
    cardNumber:{
        type:String
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    prevRoomID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: false
    },
    status:{
        type:String
    },
    //  استرداد المبلغ المدفوع في حالة الالغاء
    cancelPrice:{
        type:String,
        default:'0'
    },
    // استرداد جزء من المبلغ غادر مبكرا
    earlyLeavePrice:{
        type:String,
        default:'0'
    },
    disabled:{
        type:Boolean,
        default:false
    },
    // arrival date
    arrivalDate:{
        type:Date,
        default:null
    },
    leaveDate:{
        type:Date,
        default:null
    },
    cancelDate:{
        type:Date,
        default:null
    },
    // نقل الحجز
    isTransferred:{
        type:Boolean,
        default:false
    },
    userName:{
        type:String
    },
    errorCashBack:{
        type:String,
        default:'0'
    },
    editDate:{
        type:Date,
        default:null
    },

    isEdit:{
       type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
);

  

module.exports = mongoose.model('Book', BookingsSchema);