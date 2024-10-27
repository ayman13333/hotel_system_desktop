import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import Notify from '../../Utilities/notify';
import { toast } from 'react-toastify';
import FormatDate, { CheckToDate } from '../../Utilities/FormatDate';

export default function AddBookingComponent({ print = false }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmExitInvoiceModal, setShowConfirmExitInvoiceModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);




  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [type, setType] = useState(0);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const [cardNumberForSearch, setCardNumberForSearch] = useState('');
  const [foundUser, setFoundUser] = useState(false);
  const [userID, setUserID] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [reservationType, setReservationType] = useState(0);
  const [bookerName, setBookerName] = useState(localStorage.getItem('email'));
  const [bookDate, setBookDate] = useState(
    FormatDate(new Date())

  );
  const [notes, setNotes] = useState('');
  const [cancelPrice, setCancelPrice] = useState('');
  const [earlyLeavePrice, setEarlyLeavePrice] = useState('');

  // FormatDate(new Date(location?.state?.arrivalDate)
  // const [from, setFrom] = useState(location?.state?.from ? location?.state?.from : '');
  const [from, setFrom] = useState(location?.state?.from ? FormatDate(new Date(location?.state?.from)) : '');

  const [to, setTo] = useState(location?.state?.to ? location?.state?.to : '');
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [roomNumber, setRoomNumber] = useState(
    location?.state?.room_number ? location?.state?.room_number : ''
  );

  // نقل حجز
  const [roomTransfered, setRoomTransfered] = useState(false);

  const [lastPillInfo, setLastPillInfo] = useState(null);


  console.log('roomTransfered', roomTransfered);
  // console.log('bookDate', bookDate);

  // console.log('lastPillInfo',lastPillInfo);

  //
  const [roomType, setRoomType] = useState(
    location?.state?.type ? location?.state?.type : ''
  )

  const [pill, setPill] = useState();

  const user_type = localStorage.getItem('type');

  useEffect(() => {

    const get = async () => {
      if (location?.state?.from) {
        const start = new Date(location?.state?.from);
        const end = new Date(location?.state?.to);
        const differenceInTime = end - start;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        setNumberOfDays(differenceInDays);
      }

      let result = await window?.electron?.getLastPill();

      setLastPillInfo(result?.book);
    }

    get();
    // طرح التاريخين

  }, []);

  // بحث بالفاتورة
  const [searchForBillType, setSearchForPillType] = useState('');

  // الايعار
  // المبلغ المدفوع
  const [paidPrice, setPaidPrice] = useState('');
  // المبلغ النهائي
  const [finalPrice, setFinalPrice] = useState('');
  //مبلغ التأمين
  const [ensurancePrice, setEnsurancePrice] = useState('');
  // مبلغ الاستكمال
  const [completePrice, setCompletePrice] = useState('');

  // غادر مبكرا
  const [error, setError] = useState(false);
  const [book_type, setBook_type] = useState(false);

  // نقل الحجز
  const [showMoveRecervation, setShowMoveRecervation] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [movementRoom, setMovementRoom] = useState(null);
  const [extraPrice, setExtraPeice] = useState(0);
  const [subEnsurancePrice, setSubEnsurancePrice] = useState(0);
  const [transferPrice, setTransferPrice] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////




  /* //////////////////////////////////////////////////////////////////////////////////////////////// SEARCH IN EDIT nd  ADD BILL    */


  console.log('rooms', rooms);
  console.log('location', location?.state);

  // بحث بالمستخدم
  const search = async () => {
    // getOneUser
    const data = {
      cardNumber: cardNumberForSearch
    }

    setIsLoading(true);
    let result = await window?.electron?.getOneUser(data);
    setIsLoading(false);

    if (result?._id) {
      setFullName(result?.fullName);
      setCardNumber(result?.cardNumber);
      setType(result?.type);
      setMobile(result?.mobile);
      setAddress(result?.address);
      setUserID(result?._id);
      setFoundUser(true);
    }
    else {
      setFullName('');
      setCardNumber('');
      setType(0);
      setMobile('');
      setAddress('');

      setFoundUser(false);
    }
  }

  const addNewUser = async () => {
    try {
      if (type == 0) return toast.error("من فضلك اختر تصنيف العميل");

      const data = {
        fullName,
        cardNumber,
        type,
        mobile,
        address,
        typeOfUser: 'user'
      };

      setIsLoading(true);
      let result = await window?.electron?.addUser(data);
      setIsLoading(false);

      if (result?.newUser?._id) setUserID(result?.newUser?._id);

      console.log("result", result);

    } catch (error) {
      console.log("error", error);
    }

  }

  /* ////////////////////////////////////////////////////////////////////////////////////////////////  ADD BILL    */
  // حجز غرفة
  const addNewBook = async () => {
    if (userID == '') {
      setError(true);
      setTimeout(() => {
        //console.log('bbbbbbbbbbbbbbbbb');
        setError(false);
      }, 3000);
      return;
    }

    if (reservationType == 0) {
      toast.error("ادخل تصنيف العميل");
      setFinalPrice('');
      setEnsurancePrice('');

      return;
    }

    // نقص يوم من تاريخ النهاية
    let to = new Date(location?.state?.to);
    // from=new Date(data.from);

    to = to.setDate(to.getDate() - 1);

    to = new Date(to);

    // if(reservationType=='0'){
    //   toast.error("ادخل تصنيف العميل");
    //   return;
    // }

    if (Number(paidPrice) > Number(finalPrice) || Number(paidPrice) <= 0) {

      // console.log('oooooooooooooooooooooooooooooooo');
      toast.error("تأكد من المبلغ المدفوع");
      return;
    }

    if (Number(ensurancePrice) < 0) {

      // console.log('oooooooooooooooooooooooooooooooo');
      toast.error("تأكد من مبلغ التأمين");
      return;
    }

    if (Number(extraPrice) < 0) {

      // console.log('oooooooooooooooooooooooooooooooo');
      toast.error("تأكد من  مبلغ الرسوم الاضافية");
      return;
    }

    console.log("DS pppppppppp : ", Number(finalPrice), "  eee ppppppp : ", Number(completePrice));



    let data = {
      from: location?.state?.from,
      to: to,
      type: reservationType,
      roomPrice,
      numberOfDays,
      paidPrice,
      ensurancePrice,
      finalPrice,
      completePrice,
      userID,
      roomID: location?.state?._id,
      bookerName,
      bookDate: new Date(Date.now()),
      notes,
      cardNumber,
      extraPrice,
      roomNumber,
      userName: fullName,
      status: 'حجز جديد'
    }

    // return  console.log('data',data);

    if (ensurancePrice == 0 || ensurancePrice == '') data.zeroEnsurancePrice = true;


    console.log("data", data);
    setIsLoading(true);
    let result = await window?.electron?.addBook(data);
    setIsLoading(false);


    console.log('result',result);
    
    if (result?.success) {
      navigate('/NewInvoice', {
        state: result?.newBook
      });
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  const getDifferentInDays = ({ startDate, endDate }) => {
    // function normalizeToMidnight(date) {
    //   return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // }
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());


    // Normalize both dates to midnight
    let normalizedStartDate = startDate;
    let normalizedEndDate = endDate;
    // Subtract the normalized dates to get the difference in milliseconds
    let differenceInMilliseconds = normalizedEndDate - normalizedStartDate;
    // Convert the difference to days
    let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    console.log('differenceInDays', differenceInDays);
    return differenceInDays

  }

  const onKeyEnter = (event) => {
    if (event.key == "Enter") {

      if (print) {
        searchForPill();
      }
      else { search(); }

    }
  }



  const onKeyEnter2 = (event) => {
    if (event.key == "Enter") {
      if (fullName !== "" && cardNumber !== "" && mobile !== "" && address !== "" && type !== 0) {
        if (!print) {
          addNewBook();
        }
      }


    }
  }


  const calculate = ({
    roomPricee,
   startDatee,
   finalDatee,
    paidPriceee,
    ensurancePriceee,
    subEnsurancePriceee,
    extraPriceee,
    cancelPriceee,
    earlyLeavePriceee,
    comingFromTransefer = null,

  }) => {


    let FinalPricee = 0;
    let completePricee = 0
    let paidPricee = paidPriceee == "" ? 0 : paidPriceee;
    let ensurancePricee = ensurancePriceee == "" ? 0 : ensurancePriceee;
    let subEnsurancePricee = subEnsurancePriceee == "" ? 0 : subEnsurancePriceee;
    let cancelPricee = cancelPriceee == "" ? 0 : cancelPriceee;

    let extraPricee = extraPriceee == "" ? 0 : extraPriceee;
    let earlyLeavePricee = earlyLeavePriceee == "" ? 0 : earlyLeavePriceee;
    let numberOfDayss = getDifferentInDays({ startDate: startDatee, endDate: finalDatee });


    // startDatee = new Date(startDatee);
    // finalDatee = new Date(finalDatee);


    const myStartDate = new Date(new Date(startDatee).getFullYear(), new Date(startDatee).getMonth(), new Date(startDatee).getDate())
    const myNowNoTime = new Date( new Date().getFullYear(),  new Date().getMonth(),  new Date().getDate());
    const pillFromNoTime = new Date( pill?.from.getFullYear(),  pill?.from.getMonth(),  pill?.from.getDate());




     
  //    console.log("TTTTTTTTT  myPillFromNoTime start TTTTTTTTTTTTTTTTTTTt,",myPillFromNoTime);
  //  console.log("TTTTTTTTTTTTT my now TTTTTTTTTTTTTTTt,",myNowNoTime);

  //  console.log("TTTTTTTTTTTTT myStartDate TTTTTTTTTTTTTTTt,",myStartDate);




    if (myStartDate >= myNowNoTime && (comingFromTransefer == true || roomTransfered == true)) {

      console.log('  حاله النقل >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');


      FinalPricee = Number(roomPricee * numberOfDayss) + Number(extraPricee) + Number(ensurancePricee);

      completePricee = (myStartDate > pillFromNoTime) ? FinalPricee - (Number(pill?.roomPrice * numberOfDayss))


        : (Number(FinalPricee) -   (  Number(pill?.completePrice) == 0 ? Number(pill?.finalPrice) : Number(pill?.paidPrice))   );



      setPaidPrice(Number(pill?.completePrice) == 0 ? Number(pill?.finalPrice) : 0);


      if (myStartDate > pillFromNoTime) {
        console.log("--------------------- نقل في وسط المده ");
        /// لما نقل في نص المده يبقي الاستكمال القديم يساوي صفر ويبقي عندك حل من اتنين
        /// ياما نقلت لغرف نفس السعر وساعتها المدفوع هيكون صفر نقل مجاني 
        /// او ان المدفوع بالقيمه السابقه للفاتةره و انت ياما هتستكمل ياما هيرجعلك باقي
        /// او لو كان هيرجعله فلوس فبيتعدل من تحت لوحده تاني 
        setPaidPrice(0);
      }


      if (completePricee < 0) {
        console.log(" yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",);
        completePricee = Math.abs(completePricee)
        console.log(" 3333333333333333333333333 ", completePricee);
        setTransferPrice(completePricee);
        paidPricee = FinalPricee;
        setPaidPrice(paidPricee);
        console.log(" 4444444444444444444444444444444 ", paidPrice);
        setCompletePrice(0);

      }
      else {
        setTransferPrice(0);
        setCompletePrice(completePricee);
        console.log(" UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUuu",);

      }
      setEnsurancePrice(ensurancePricee);
      setExtraPeice(extraPricee);
      setFinalPrice(FinalPricee);

      return;

    }




    else {
      //  لسا مدخلش او دخل ةبعدل عليه


      FinalPricee = Number(roomPricee * numberOfDayss) + Number(ensurancePricee) + Number(extraPriceee);

      if (print == true) {
        console.log(' حاله التعديل >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        paidPricee = pill?.paidPrice;
        completePricee = (FinalPricee != pill?.finalPrice) ? (Number(FinalPricee) - Number(pill?.finalPrice) + Number(pill?.completePrice)) : pill?.completePrice;
        setFinalPrice(FinalPricee);
        setPaidPrice(paidPricee);
        setCompletePrice(completePricee);
       // setRoomTransfered(true);
      }




      else {
        // ده في حاله الحجز فقد
        console.log(" kkkkkkkkkkkkkkkkkkkkkkknkkkkkkkkkkkkkkkkkkkkkkkkkkk", "حاله احجز");
        completePricee = Number(FinalPricee) - Number(paidPricee);
        paidPricee = completePricee == 0 ? FinalPricee : (Number(FinalPricee) - Number(completePricee));
        completePricee = completePricee == 0 ? 0 : (Number(FinalPricee) - Number(paidPricee));
        setCompletePrice(completePricee);
        setFinalPrice(FinalPricee);
        setPaidPrice(paidPricee);

      }

    }



    setEnsurancePrice(ensurancePricee);
    setSubEnsurancePrice(subEnsurancePricee);
    setExtraPeice(extraPricee);
    setCancelPrice(cancelPricee);
    setEarlyLeavePrice(earlyLeavePricee);
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////// SEARCH FOR BILL FUNCTION
  const searchForPill = async () => {

    if (searchForBillType === '') return toast.error("من فضلك اختر نوع البحث");
    if (cardNumberForSearch === '') return toast.error("من فضلك اكتب ما تريد البحث عنه");
    else {
      let data = {
        type: searchForBillType,
        value: cardNumberForSearch
      };

      console.log('data', data);
      setRoomTransfered(false);

      setIsLoading(true);
      let result = await window?.electron?.searchForBook(data);
      setIsLoading(false);

      if (result?.book?._id) {
        if (result?.book?._id) {
          setFullName(result?.book?.userID?.fullName);
          setCardNumber(result?.book?.userID?.cardNumber);
          setType(result?.book?.userID?.type);
          setMobile(result?.book?.userID?.mobile);
          setAddress(result?.book?.userID?.address);
          setUserID(result?.book?.userID?._id);
          // {FormatDate(new Date(result?.book?.from))}
          setFrom(FormatDate(new Date(result?.book?.from)));
          setTo(FormatDate(new Date(result?.book?.to)));
          setReservationType(result?.book?.type);
          setRoomPrice(result?.book?.roomPrice);
          setNumberOfDays(result?.book?.numberOfDays);
          setPaidPrice(result?.book?.paidPrice);
          //setPaidPrice(0);

          setEnsurancePrice(result?.book?.ensurancePrice);
          setFinalPrice(result?.book?.finalPrice);
          setCompletePrice(result?.book?.completePrice);
          setBookerName(result?.book?.bookerName);
          setNotes(result?.book?.notes);
          setBookDate(FormatDate(new Date(result?.book?.bookDate)));
          setPill(result?.book);
          setRoomNumber(result?.book?.roomID?.room_number);
          setRoomType(result?.book?.roomID?.type);

          setExtraPeice(result?.book?.extraPrice);

          setCancelPrice(result?.book?.cancelPrice);
          setEarlyLeavePrice(result?.book?.earlyLeavePrice);

          setSubEnsurancePrice(result?.book?.subEnsurancePrice);
          setTransferPrice(result?.book?.transferPrice);
          setFoundUser(true);


          console.log('result', result?.arrivalDate);

        }


      }
    }
    // console.log("result", result);


  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// edit bill
  const updateBill = async (typeofBook) => {

    // updatePill
    let data = {
      _id: pill?._id,
      paidPrice,
      ensurancePrice,
      finalPrice,
      completePrice,
      notes,
      extraPrice,
      subEnsurancePrice,
      numberOfDays,
      from
    };

     if(
      Number( ensurancePrice)<0||
        Number( extraPrice)<0||
          Number( subEnsurancePrice)<0||
      
            Number( cancelPrice)<0||
              Number( earlyLeavePrice)<0
    
    ) return toast.error(" تأكد انه لا يوجد مبالغ اقل من صفر");






    // setRoomNumber(result?.book?.roomID?.room_number);
    if (typeofBook == 'فاتورة دخول') {

      // data.completePrice = 0;
      data.status = typeofBook;
      // if (pill?.arrivalDate == null || pill?.arrivalDate == undefined) data.arrivalDate = new Date();
      data.arrivalDate = new Date();
      data.subEnsurancePrice = 0;
      data.cancelPrice = 0;
      data.earlyLeavePrice = 0;
      // نقل حجز
      if (roomTransfered) {
        console.log("roomTransfered obj");
        data.roomID = rooms?.find(el => el?.room_number == roomNumber)?._id;
        data.isTransferred = true;
        data.transferPrice = transferPrice;
        data.prevRoomID = pill?.roomID;
        data.roomPrice = roomPrice;
        data.roomNumber=roomNumber;

      }

    }

    // return console.log('data', data);

    if (typeofBook == 'فاتورة خروج') {

      data.cancelPrice = 0;
      // data.completePrice = 0;
      if (Number(subEnsurancePrice) > Number(ensurancePrice)) {
        setExtraPeice(pill?.extraPrice);
        return toast.error('يجب الا تزيد قيمه المستقطع من التامين عن قيمه التامين');
      }
      else if (Number(extraPrice) < Number(pill?.extraPrice)) {
        setPaidPrice(pill?.paidPrice);
        setFinalPrice(pill?.finalPrice);
        setCompletePrice(pill?.completePrice);
        setExtraPeice(pill?.extraPrice);
        return toast.error('لا يمكن اضافه مبلغ رسوم اقل من المبلغ المضاف سابقا');
      }

      data.status = typeofBook;
      // data.ensurancePrice = 0;
      data.earlyLeavePrice = earlyLeavePrice;
      data.disabled = true;
      if (pill?.leaveDate == null || pill?.leaveDate == undefined) data.leaveDate = new Date();

    }

    if (typeofBook == 'الغاء الحجز') {

      data.earlyLeavePrice = 0;

      if (Number(subEnsurancePrice) > Number(ensurancePrice)) {
        setExtraPeice(pill?.extraPrice);
        return toast.error('يجب الا تزيد قيمه المستقطع من التامين عن قيمه التامين');
      }
      else if (Number(extraPrice) < Number(pill?.extraPrice)) {
        setPaidPrice(pill?.paidPrice);
        setFinalPrice(pill?.finalPrice);
        setCompletePrice(pill?.completePrice);
        setExtraPeice(pill?.extraPrice);
        return toast.error('لا يمكن اضافه مبلغ رسوم اقل من المبلغ المضاف سابقا');
      }

      // data.completePrice=0;
      data.status = typeofBook;
      data.cancelPrice = cancelPrice;
      data.disabled = true;
      // cancelDate
      if (pill?.cancelDate == null || pill?.cancelDate == undefined) data.cancelDate = new Date();


      if (showConfirmModal == false) {
        //setConfirm(true);
        setShowConfirmModal(true);
        // alert('هل حقا تريد الغاء الحجز');
        return;
      }

    }

    // // نقل حجز
    // if(roomTransfered){
    //   data.status = 'نقل حجز';
    //   data.roomID=roomNumber;

    // }

    console.log('data', data);

    // return;
    setIsLoading(true);
    let result = await window?.electron?.updatePill(data);
    setIsLoading(false);

    console.log('result?.book', result);

    //   return;

    if (result?.success) {
      //EnterInvoice
      if (typeofBook == 'فاتورة دخول') {
        navigate('/EnterInvoice', {
          state: result?.book
        });
        return;
      }

      // ExitInvoice
      if (typeofBook == 'فاتورة خروج') {
        navigate('/ExitInvoice', {
          state: result?.book
        });
        return;
      }

      // CancelInvoice
      if (typeofBook == 'الغاء الحجز') {
        navigate('/CancelInvoice', {
          state: result?.book
        });
        return;
      }





      navigate('/bookings');
    }


  }

  // console.log("type", type);

  //////////////////////////////////////////////////////////////////////////////////////////////// 
  const moveBooking = async () => {

    if (movementRoom == '0') return toast.error('من فضلك اختر الغرفة');

    const movementRoomObj = rooms.find(el => el?._id == movementRoom);




    console.log('movementRoomObj', movementRoomObj);
    setRoomNumber(movementRoomObj?.room_number);

    let newRoomPrice = 0;
    if (reservationType == 'madany') newRoomPrice = movementRoomObj?.priceForUser;
    if (reservationType == 'army') newRoomPrice = movementRoomObj?.priceForArmy;
    if (reservationType == 'darMember') newRoomPrice = movementRoomObj?.priceForDarMember;



    setRoomPrice(newRoomPrice);
    setRoomTransfered(true);
    setShowMoveRecervation(false);
    let finalDate;

    // let from_date = Date(from);
  


    const myFromNoTime = new Date(pill?.from.getFullYear(),pill?.from.getMonth(),pill?.from.getMonth());
    const myNowNoTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    // console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDate(from)', myFromNoTime);
    // console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDate.(now)', myNowNoTime);


    if (myFromNoTime < myNowNoTime) {
      // console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', Date.now);
      // console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', from);


      setFrom(FormatDate(myNowNoTime));
      finalDate = FormatDate(myNowNoTime);

      console.log('finalDate', finalDate);
      console.log('to', to);

      // let new_number_of_days=new Date(to)-new Date(finalDate);

      const start = new Date(); // Create a Date object for the current date and time
      start.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to normalize to midnight

      let end = new Date(to); // Create a Date object from the 'to' variable
      end.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to normalize to midnight

      console.log('start', start);
      console.log('end', end);

      // Calculate the difference in time in milliseconds
      const differenceInTime = end.getTime() - start.getTime();

      // Convert the difference to days
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      setNumberOfDays(differenceInDays); // Set the number of days
      console.log("differenceInDays", differenceInDays);


      // console.log('new_number_of_days',new_number_of_days);
    }
    else {
      finalDate = from;
      console.log('final date in else ', from);
    }
    calculate({
      roomPricee: newRoomPrice,
      startDatee: finalDate,
      finalDatee: to,
      comingFromTransefer: true,
      paidPriceee: 0,
      ensurancePriceee: 0,
      subEnsurancePriceee: 0,
      extraPriceee: 0,
      cancelPriceee: 0,
      earlyLeavePriceee: 0,
      oldRoomPricee: pill?.roomPrice,
      oldExtraPricee: 0,
      oldEnsurancePricee: 0,
      oldPaidPricee: Number(pill?.completePrice) == 0 ? Number(pill.finalPrice) : Number(pill?.paidPrice)
      ,
    });



    setEnsurancePrice(0);
    setExtraPeice(0);
    setMovementRoom('0');


  }

  const handleWheel = (event) => {
    // event.preventDefault();
    // Optionally blur the input to remove focus and further prevent interaction
    event.currentTarget.blur();
  };


  // console.log('Date(from)',Date(from)?.getTime());
  // console.log('Date.now()',Date.now());




  console.log("pill", pill);
  //////////////////////////////////////////////////////////////////////////// البدايه
  /////////////////////////////////////////////////////////////////////////////// searck 8**/  
  const myFromNoTime = new Date(
    pill?.from.getFullYear(),
    pill?.from.getMonth(),
    pill?.from.getDate()
  );

  
  const myToNoTime = new Date(
    pill?.to.getFullYear(),
    pill?.to.getMonth(),
    pill?.to.getDate()
  );
  const myNowNoTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // console.log("---------qqََََََََََََََqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", myToNoTime);

  // myFromNoTime
  // myToNoTime
  // myNowNoTime


  // console.log("myFromNoTime ---------------------------", myFromNoTime);
  // console.log("myToNoTime ---------------------------", myToNoTime);
  // console.log("myNowNoTime ---------------------------", myNowNoTime);




  // const start11 = new Date(pill?.from);
  // const end11 = new Date(location?.state?.to);
  // const nowDate11 = Date.now();
  // console.log("GomaaStartDate",start11);
  // console.log("GomaaEndDate",end11);
  // console.log("GomaaDateNow",nowDate11);

  // if (start11 > nowDate11) {
  //   console.log("111111111111111111", start11);

  // } else {
  //   console.log("2222222222222222222222222", start11);
  // }

  // console.log("location.state",location?.state);




  return (
    <div className='w-100 h-100'>
      <h1> {print ? 'اصدار فاتوره' : 'اضافة حجز'}  </h1>
      {print && <h4 className='my-3'> رقم امر الدفع الاخير : {lastPillInfo?.serialNumber} </h4>}

      {isLoading && <Spinner />}

      <div className="form-group d-flex justify-content-center my-4 gap-3">

        {
          print ?
            <>
              <select required value={searchForBillType} onKeyPress={onKeyEnter} onChange={(e) => setSearchForPillType(e.target.value)} className='form-control w-25'>
                <option value={''}> اختر نوع البحث </option>
                <option value={'cardNumber'}> رقم تحقيق الشخصية </option>
                <option value={'serialNumber'}> رقم الفاتورة </option>
              </select>
              <input
                value={cardNumberForSearch} onKeyPress={onKeyEnter} onChange={(e) => setCardNumberForSearch(e.target.value)}
                type="number" className="form-control w-50"
                placeholder="ابحث هنا" />
              <button onClick={() => searchForPill()} className='btn btn-success'>  بحث </button>
            </>
            :
            <>
              <input
                value={cardNumberForSearch} onKeyPress={onKeyEnter} onChange={(e) => setCardNumberForSearch(e.target.value)}
                type="number" className="form-control w-50"
                placeholder="ابحث برقم تحقيق الشخصية" />
              <button onClick={() => search()} className='btn btn-success'> بحث </button>
            </>
        }


      </div>
      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////  add client*/}
      <Tabs
        defaultActiveKey="home"
        id="justify-tab-example"
        className="mb-3"
        justify
        activeKey={activeTab}
        onSelect={(k) => {
          if (userID == '') {
            return toast.error('من فضلك ادخل بيانات العميل');
            // return;
          }
          else {
            setActiveTab(k);
          }

          if (k === 'profile') {
            //  
            // Optionally, you could prevent tab switch or perform any other action here
          }
          // setActiveTab(k)
        }}
      >
        <Tab eventKey="home" title=" معلومات العميل" tabClassName='notActiveTab'>
          <div className='w-75'>
            <form onSubmit={(e) => {
              e.preventDefault();
              addNewUser();
            }}>
              <div className="form-group">
                <label className="my-2">تصنيف العميل</label>
                <select
                  disabled={foundUser}
                  value={type} onChange={(e) => setType(e.target.value)}
                  required
                  onKeyPress={onKeyEnter2}
                  className="form-control">
                  <option value={0}> من فضلك اختر تصنيف العميل </option>
                  <option value={'madany'}> مدني </option>
                  <option value={'army'}> قوات مسلحة </option>
                  <option value={'darMember'}> عضو دار </option>
                </select>
              </div>





              <div className="form-group">
                <label className="my-2"> الاسم رباعي </label>
                <input
                  disabled={foundUser}
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                  required
                  onKeyPress={onKeyEnter2}
                  type="text" className="form-control" placeholder=" الاسم رباعي" />
              </div>

              <div className="form-group">
                <label className="my-2"> رقم تحقيق الشخصية </label>
                <input
                  disabled={foundUser}
                  required
                  onKeyPress={onKeyEnter2}
                  value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                  type="number" className="form-control" placeholder=" رقم تحقيق الشخصية" />
              </div>



              <div className="form-group">
                <label className="my-2"> رقم التليفون </label>
                <input disabled={foundUser} onKeyPress={onKeyEnter2} value={mobile} onChange={(e) => setMobile(e.target.value)} type="number" className="form-control" placeholder=" رقم التليفون" />
              </div>


              <div className="form-group">
                <label className="my-2"> عنوان </label>
                <input disabled={foundUser} onKeyPress={onKeyEnter2} value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" placeholder=" عنوان" />
              </div>
              {
                !foundUser && !print && <div className='d-flex justify-content-start my-3'>
                  <button type='submit' className='btn btn-success'>   اضافة </button>
                </div>
              }

            </form>


          </div>

        </Tab>
        {/* ////////////////////////////////////////////////////////////////////////////////////////////////  تابه معلومات الحجز */}

        <Tab eventKey="profile" title="معلومات الحجز" tabClassName='notActiveTab'>


          <form onSubmit={(e) => {
            e.preventDefault();
            if (!print) {
              addNewBook();
            }
            else {

            }

          }}>
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////  من الي   */}

            <div className='d-flex gap-3 w-100 justify-content-center'>

              <div className="form-group">
                <label className="my-2">من </label>
                <input type="text" value={from} className="form-control" disabled />
              </div>

              <div className="form-group">
                <label className="my-2">الي  </label>
                <input type="text" value={to} className="form-control" disabled />
              </div>

            </div>
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////  نوع الفاتوره   */}


            {

              print && pill?.isEdit == true && <div style={{
                display: "flex",
                justifyContent: "center",
                margin: "0 62px",
                padding: "10px",
                margin: "20px",
                borderRadius: "8px",
                background: "#FF6347"
              }}>{`تم اجراء تعديل علي هذه الفاتورة بواسطة الادمن بتاريخ    ${FormatDate(new Date(pill?.editDate))}`}</div>
            }
            <div className='w-75'>
              {
                print && <div className="form-group">
                  <label className="my-2">
                    نوع الفاتورة
                  </label>
                  <input value={pill?.status == 'فاتورة دخول' ?
                    `فاتورة استكمال ${pill?.isTransferred ? `( نقل حجز )  - رقم الغرفه السابقه :  ${pill?.prevRoomID?.room_number}` : ''}`
                    : pill?.status} type="text" className="form-control" disabled />
                </div>
              }
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////  رقم الفاتةره   */}

              {
                pill?._id && <>
                  <div className="form-group">
                    <label className="my-2">
                      رقم امر الدفع
                    </label>
                    <input value={pill?.serialNumber} type="text" className="form-control" disabled />
                  </div>
                </>
              }
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////  نةع الغرفه   */}

              <div className="form-group">
                <label className="my-2">
                  {roomType == 'room' && 'رقم الغرفة'}
                  {roomType == 'shaleh' && 'رقم الشاليه'}
                  {roomType == 'sweet' && 'رقم السويت'}
                </label>
                <input value={roomNumber} type="text" className="form-control" disabled />
              </div>
            </div>
            {/* ////////////////////////////////////////////////////////////////////////////////////////////////  اسم العميل   */}

            <div className='w-75'>
              <div className="form-group">
                <label className="my-2"> اسم العميل</label>
                <input value={fullName} type="text" className="form-control" placeholder="اسم العميل" disabled />
              </div>
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////  تصنيف العميل    */}

              <div className="form-group">
                <label className="my-2"> تصنيف العميل</label>
                <select value={reservationType} onChange={(e) => {
                  const type = e.target.value;
                  let price = 0;

                  setReservationType(type);
                  if (type == 'madany') price = location?.state?.priceForUser;
                  if (type == 'army') price = location?.state?.priceForArmy;
                  if (type == 'darMember') price = location?.state?.priceForDarMember;

                  setRoomPrice(price);
                  // setFinalPrice('');

                  // setFinalPrice(Number(price * numberOfDays) + Number(ensurancePrice));
                  // setCompletePrice('');
                  // setPaidPrice('');


                  calculate({
                    roomPricee: price,
                    startDatee: from,
                    finalDatee: to,

                    // comingFromTransfer:false,

                    paidPriceee: 0,
                    ensurancePriceee: 0,
                    subEnsurancePriceee: 0,
                    extraPriceee: 0,
                    cancelPriceee: 0,
                    earlyLeavePriceee: 0,

                    oldRoomPricee: 0,
                    oldExtraPricee: 0,
                    oldEnsurancePricee: 0,
                    oldPaidPricee: 0,
                  });

                }} className="form-control" required disabled={print}>
                  <option value={0}> من فضلك اختر تصنيف العميل </option>
                  <option value={'madany'}> مدني </option>
                  <option value={'army'}> قوات مسلحة </option>
                  <option value={'darMember'}> عضو دار </option>
                </select>
              </div>
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////  سعر  اليله   */}

              {
                reservationType != 0 && <>

                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2">  سعر الليلة </label>
                      <input value={roomPrice} type="number" className="form-control" placeholder="سعر الليلة" disabled />
                    </div>
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////////  عدد الايام    */}
                    <div className="form-group w-50">
                      <label className="my-2"> عدد الايام</label>
                      <input value={numberOfDays} type="number" className="form-control" placeholder="عدد الايام" disabled />
                    </div>
                  </div>
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////  المبلغ المدفوع    */}
                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> المبلغ المدفوع</label>
                      <input value={paidPrice} onChange={(e) => {

                        // toast.success("This is a success message!");
                        //if(Number e.target.value > Number(finalPrice))

                        // let price = e.target.value;
                        // setPaidPrice(price);
                        //e.target.value==""?return:

                        // if (e.target.value === "") {
                        //    setPaidPrice(""); // Optionally clear the state as well
                        //   return;
                        // }

                        calculate({
                          roomPricee: roomPrice,
                          startDatee: from,
                          finalDatee: to,
                          paidPriceee: e.target.value,
                          ensurancePriceee: ensurancePrice,
                          subEnsurancePriceee: subEnsurancePrice,
                          extraPriceee: extraPrice,
                          cancelPriceee: cancelPrice,
                          earlyLeavePriceee: earlyLeavePrice,
                          // comingFromTransfer:false,


                          oldRoomPricee: 0,
                          oldExtraPricee: 0,
                          oldEnsurancePricee: 0,
                          oldPaidPricee: pill?.paidPrice ? pill?.paidPrice : 0,
                        });



                        //setPaidPrice(e.target.value);



                        // let complete_price;

                        // console.log("Paid Price ===== > ", price);
                        // console.log("Paid Price Back ===== > ", pill?.paidPrice);
                        // if (pill?.paidPrice) {
                        //   complete_price =
                        //     Number(finalPrice) - Number(pill?.paidPrice) <= 0 ?
                        //       Number(finalPrice) - Number(price) - Number(pill?.paidPrice) :
                        //       Number(finalPrice) - (Number(price) + Number(pill?.paidPrice));

                        //   console.log("Complete One ==     > ", Number(finalPrice) - Number(price));
                        //   console.log("Complete Two ==     > ", Number(price) + Number(pill?.paidPrice));

                        // }


                        // else complete_price = Number(finalPrice) - Number(price);

                        // //Number(finalPrice) - Number(price)-Number(pill?.paidPrice)
                        // setCompletePrice(complete_price);

                      }}
                        disabled={(print == false) ? false : true}
                        type="number" className="form-control" placeholder="المبلغ المدفوع"
                        onWheel={handleWheel}
                        required />
                    </div>
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////////  مبلغ الاستكمال    */}
                    <div className="form-group w-25">
                      <label className="my-2"> مبلغ الاستكمال</label>
                      <input value={completePrice} type="number" className="form-control" placeholder="مبلغ الاستكمال" disabled />
                    </div>

                    {
                      print && <div className="form-group w-25 d-flex justify-content-end flex-column">
                        <button onClick={() => {

                          if (roomTransfered) {
                            setPaidPrice(completePrice);
                            setCompletePrice(0);
                            return;
                          }
                          if (Number(extraPrice) < Number(pill?.extraPrice)) {
                            setPaidPrice(pill?.paidPrice);
                            setFinalPrice(pill?.finalPrice);
                            setCompletePrice(pill?.completePrice);
                            setExtraPeice(pill?.extraPrice);
                            return toast.error('لا يمكن اضافه مبلغ رسوم اقل من المبلغ المضاف ثابقا');
                          }
                          else {
                            setPaidPrice(completePrice);
                            setCompletePrice(0);

                          }
                        }} disabled={completePrice == 0 ? true : false} className="btn btn-primary"> دفع </button>
                      </div>
                    }

                  </div>
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////  مبلغ التأمين    */}
                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> مبلغ التأمين</label>
                      <input value={ensurancePrice} onChange={(e) => {

                        //toast.success("This is a success message!");

                        // if (print == false) {
                        //   setEnsurancePrice(e.target.value);
                        //   //setFinalPrice(price*numberOfDays);
                        //   let price = Number(roomPrice * numberOfDays) + Number(e.target.value);
                        //   // let price = e.target.value;
                        //   // setPaidPrice(price);
                        //   let complete_price = 0;
                        //   complete_price = (Number(price) - Number(paidPrice)) < 0 ? 0 : (Number(price) - Number(paidPrice));
                        //   // console.log('xxxxxxx', Math.abs(Number(price) - Number(paidPrice)));
                        //   setCompletePrice(complete_price);
                        //   setFinalPrice(price);
                        // }
                        // else {

                        //   setEnsurancePrice(e.target.value);
                        //   let price = Number(roomPrice * numberOfDays) + Number(e.target.value);
                        //   let complete_price = 0;
                        //   complete_price = (Number(price) - Number(paidPrice)) < 0 ? 0 : (Number(price) - Number(paidPrice));
                        //   // console.log('xxxxxxx', Math.abs(Number(price) - Number(paidPrice)));
                        //   setCompletePrice(complete_price - Number(pill?.paidPrice ?? 0));
                        //   setFinalPrice(price);
                        //   // setPaidPrice(price);
                        // }



                        calculate({
                          roomPricee: roomPrice,
                          startDatee: from,
                          finalDatee: to,
                          paidPriceee: paidPrice,
                          ensurancePriceee: e.target.value,
                          subEnsurancePriceee: subEnsurancePrice,
                          extraPriceee: extraPrice,
                          cancelPriceee: cancelPrice,
                          earlyLeavePriceee: earlyLeavePrice,

                          // comingFromTransfer:false,

                          oldRoomPricee: 0,
                          oldExtraPricee: 0,
                          oldEnsurancePricee: 0,
                          oldPaidPricee: 0,
                        });








                        // jkjkkkklkklkllkkl

                      }}
                        onWheel={handleWheel}
                        disabled={((roomTransfered == true || print == false)) ? false : true}

                        // disabled={completePrice==0 ? true : false} 
                        type="number" className="form-control" placeholder="مبلغ التأمين" required />
                    </div>
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////////  المبلغ النهايي    */}
                    <div className="form-group w-50">
                      <label className="my-2"> المبلغ النهائي</label>
                      <input value={finalPrice} type="number" className="form-control" placeholder="المبلغ النهائي" disabled />
                    </div>
                  </div>
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////  مباغ فرق الحجز    */}
                  {
                    (roomTransfered || pill?.isTransferred) &&
                    <div className='d-flex gap-3 my-3'>

                      <div className="form-group w-50">
                        <label className="my-2"> استرداد نقدي مبلغ فرق الحجز</label>
                        <input value={transferPrice} onChange={(e) => setTransferPrice(e.target.value)}
                          onWheel={handleWheel}
                          type="number" className="form-control" disabled placeholder="استرداد نقدي مبلغ فرق الحجز" />
                      </div>
                    </div>
                  }
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////  رسوم اضافيه    */}
                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> رسوم اضافية </label>
                      <input value={extraPrice}
                        onChange={(e) => {
                          // let price=Number(finalPrice) + Number(e.target.value);

                          // let price = Number(roomPrice * numberOfDays) + Number(ensurancePrice) + Number(e.target.value);
                          // let complete_price = 0;

                          // complete_price = (Number(price) - Number(paidPrice)) < 0 ? 0 : (Number(price) - Number(paidPrice) - Number(pill?.paidPrice ?? 0));

                          // // complete_price = (Number(price) - Number(paidPrice)) < 0 ? 0 : (Number(price) - Number(paidPrice));

                          // setCompletePrice(complete_price);
                          // setFinalPrice(price);
                          // setExtraPeice(e.target.value);

                          // let value=0;

                          // if(print) value= e.target.value<extraPrice ? extraPrice : e.target.value;
                          // else value=e.target.value;
                          // setExtraPeice(e.target.value);

                          //   return;

                          calculate({
                            roomPricee: roomPrice,
                            startDatee: from,
                            finalDatee: to,
                            paidPriceee: paidPrice,
                            ensurancePriceee: ensurancePrice,
                            subEnsurancePriceee: subEnsurancePrice,
                            extraPriceee: e.target.value,
                            cancelPriceee: cancelPrice,
                            earlyLeavePriceee: earlyLeavePrice,


                            oldRoomPricee: 0,
                            oldExtraPricee: 0,
                            oldEnsurancePricee: 0,
                            oldPaidPricee: 0,
                          });









                        }}

                        type="number"
                        onWheel={handleWheel}
                        disabled={(print && pill?.isTransferred==true) ? true : false}
                        // disabled={(completePrice == 0 || completePrice == '' || pill?.status == 'فاتورة دخول') ? true : false} 
                        className="form-control" placeholder="رسوم اضافية" />
                    </div>
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////////  مستقطع من التامين    */}
                    {
                      print && myNowNoTime >= myFromNoTime &&
                      <div className="form-group w-50">
                        <label className="my-2"> المبلغ المستقطع من التأمين </label>
                        <input
                          value={subEnsurancePrice}
                          onChange={(e) => {
                            setSubEnsurancePrice(e.target.value);
                            // calculate({
                            //   roomPricee: roomPrice,
                            //   startDatee: from,
                            //   finalDatee: to,
                            //   paidPriceee: paidPrice,
                            //   ensurancePriceee: ensurancePrice,
                            //   subEnsurancePriceee: e.target.value,
                            //   extraPriceee: extraPrice,
                            //   cancelPriceee: cancelPrice,
                            //   earlyLeavePriceee: earlyLeavePrice,


                            //   oldRoomPricee: 0,
                            //   oldExtraPricee: 0,
                            //   oldEnsurancePricee: 0,
                            //   oldPaidPricee: 0,
                            // });

                            // if (Number(e.target.value) > Number(ensurancePrice)) {
                            //   //   toast.warning("Warning Notification!", {
                            //   //    // position: toast.POSITION.BOTTOM_RIGHT,
                            //   //     autoClose: 5000,
                            //   // });


                            //   setSubEnsurancePrice(0);
                            // }

                            // // alert('يجب ان يكون المبلغ المستقطع اقل او يساوي مبلغ التأمين');
                            // else setSubEnsurancePrice(e.target.value)
                          }}
                          disabled={(ensurancePrice == 0) ? true : false}
                          type="number" onWheel={handleWheel} className="form-control" placeholder="المبلغ المستقطع من التأمين" />
                      </div>

                    }
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////////  اسم الموظف    */}
                  </div>

                  <div className="form-group">
                    <label className="my-2"> اسم الموظف </label>
                    <input
                      value={bookerName} onChange={(e) => setBookerName(e.target.value)} disabled={true}
                      type="text" className="form-control" placeholder=" اسم الموظف" required />
                  </div>
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////  مبلغ الالغاء الحجز    */}
                  {
                    print && <>
                      {
                        // pill?.status == 'حجز جديد' &&
                        <div className="form-group my-2">
                          <label className="my-2"> المبلغ المسترد في حالة الغاء الحجز </label>
                          <input
                            value={cancelPrice} onChange={(e) =>

                              setCancelPrice(e.target.value)



                            }
                            type="number" onWheel={handleWheel} className="form-control" />
                        </div>
                      }
                      {/* ////////////////////////////////////////////////////////////////////////////////////////////////  مبلغ الحروج مبكرا    */}
                      {
                        print && myNowNoTime >= myFromNoTime &&
                        <>
                          <div className="form-group my-2">
                            <label className="my-2">  المبلغ المسترد في حالة الخروج مبكرا </label>
                            <input
                              value={earlyLeavePrice} onChange={(e) => setEarlyLeavePrice(e.target.value)}
                              type="number" onWheel={handleWheel} className="form-control" />
                          </div>
                        </>
                      }


                    </>
                  }

                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////  تاريخ الحجز    */}
                  <div className="form-group">
                    <label className="my-2"> تاريخ الحجز </label>
                    <input value={bookDate} onChange={(e) => setBookDate(e.target.value)} type="text" className="form-control" disabled />
                  </div>
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////  ملاحاظات    */}
                  <div className='form-group'>
                    <label className="my-2"> ملاحظات </label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-control" style={{ height: '100px' }}>

                    </textarea>
                  </div>

                  {

                    !print && !isLoading && <div className='d-flex justify-content-center my-3'>
                      <button type='submit' className='btn btn-success'>  احجز الان </button>
                    </div>
                  }

                </>
              }

            </div>
          </form>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Buttons */}

          {
            print && (pill?.status != 'فاتورة خروج') && <div className='d-flex justify-content-center my-3 gap-2'>
              {pill?.status != 'الغاء الحجز' &&
                // pill?.status!='الغاء الحجز'&&
                (

                  // (pill?.status == 'حجز جديد' || (pill?.status != 'فاتورة خروج' && pill?.status != 'فاتورة دخول' )) ?
                  <>
                    {isLoading && <Spinner />}

                    {/* <---- فاتورة استكمال ---> */}
                    <button className='btn btn-success' onClick={() => {
                      setBook_type('فاتورة دخول');
                      updateBill('فاتورة دخول');

                    }}



  // myFromNoTime
  // myToNoTime
  // myNowNoTime




                      disabled={(completePrice == 0 &&myNowNoTime<myToNoTime)? false : true}
                    > فاتورة استكمال </button>


                    {/* <---- فاتورة نقل الحجز ---> */}
                    <button onClick={async () => {
                      const data = {
                        from,
                        to
                      };
                      let result = await window?.electron?.searchForRoom(data);
                      console.log('result', result?.rooms);
                      setRooms(result?.rooms?.empty_rooms);

                      setShowMoveRecervation(true);

                    }}
                    disabled={(myNowNoTime>=myToNoTime)? true : false}

                     className="btn btn-info" >نقل الحجز</button>

                    {/* <---- فاتورة خروج ---> */}
                    <button className='btn btn-warning' onClick={() => {
                      setShowConfirmExitInvoiceModal(true);

                      // setBook_type('فاتورة خروج');
                      // updateBill('فاتورة خروج');

                    }}

                      // myFromNoTime
                      // myToNoTime
                      // myNowNoTime


                      disabled={(completePrice == 0 && myNowNoTime >= myFromNoTime) ? false : true}
                    > فاتورة خروج </button>


                    {/* <---- فاتورة الغاء حجز ---> */}
                    {user_type == 'admin' && <button className='btn btn-danger' onClick={() => updateBill('الغاء الحجز')} 
                      
                    //  disabled={(myNowNoTime<myToNoTime)? false : true}

                      
                      
                      > الغاء الحجز </button>}
                  </>


                )

              }
            </div>
          }

          {
            showConfirmExitInvoiceModal && <>
              <Modal show={showConfirmExitInvoiceModal} onHide={() => setShowConfirmExitInvoiceModal(false)}>
                <Modal.Header>
                  <Modal.Title>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <div className="form-group">
                    <label className="my-2"> هل حقا تريد  اصدار فاتورة خروج </label>
                  </div>

                  <div className="d-flex my-3 justify-content-between">

                    <Button onClick={() => {
                      setBook_type('فاتورة خروج');
                      updateBill('فاتورة خروج');
                    }} variant="danger" >
                      نعم
                    </Button>

                    <Button className="gap-2" variant="secondary" onClick={() => {
                      setShowConfirmExitInvoiceModal(false);
                    }}>
                      لا
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          }

          {
            showConfirmModal && <>
              <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header>
                  <Modal.Title>
                    {/* {isEdit ? ' تعديل المستخدم' : 'اضافة مستخدم'} */}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <div className="form-group">
                    <label className="my-2"> هل حقا تريد الغاء الحجز </label>

                  </div>

                  <div className="d-flex my-3 justify-content-between">

                    <Button onClick={() => {
                      setBook_type('الغاء الحجز');
                      updateBill('الغاء الحجز');
                    }} variant="danger" >
                      نعم
                    </Button>

                    <Button className="gap-2" variant="secondary" onClick={() => {
                      setShowConfirmModal(false);
                    }}>
                      لا
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          }

          {
            showMoveRecervation && <>
              <Modal show={showMoveRecervation} onHide={() => setShowMoveRecervation(false)}>
                <Modal.Header>
                  <Modal.Title>
                    {/* {isEdit ? ' تعديل المستخدم' : 'اضافة مستخدم'} */}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <div className="form-group">
                    <label className="my-2">نقل الحجز من الغرفه : {pill?.roomNumber}   </label>
                    <br/>
                   
                    <label className="my-2"> سعر اليله  قبل النقل : {pill?.roomPrice}  LE</label>
                 

                    <div className="form-group">
                      <label className="my-2">  اختر الغرفة </label>
                      <select value={movementRoom} onChange={(e) => setMovementRoom(e.target.value)} className='form-control'>
                        <option value={0}> اختر الغرفة </option>
                        {
                          rooms && rooms?.map((el, i) => <option value={el?._id} key={i}>{el?.room_number}</option>)
                        }

                      </select>
                    </div>

                    <div className='d-flex justify-content-between'>
                      <button onClick={() => moveBooking()} className="btn btn-secondary my-3"> نقل </button>
                      <Button className="gap-2 my-3" variant="danger" onClick={() => {
                        setShowMoveRecervation(false);
                      }}>
                        لا
                      </Button>

                    </div>


                  </div>

                  <div className="d-flex my-3 justify-content-between">

                    {/* <Button onClick={() => {
                      setBook_type('الغاء الحجز');
                      updateBill('الغاء الحجز');
                    }} variant="danger" >
                      نعم
                    </Button>

                    <Button className="gap-2" variant="secondary" onClick={() => {
                      setShowConfirmModal(false);
                    }}>
                      لا
                    </Button> */}
                  </div>
                </Modal.Body>
              </Modal>
            </>
          }





        </Tab>

      </Tabs>

      {/* <ToastContainer /> */}

    </div>
  )
}
