import { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import Notify from "../../Utilities/notify";

export default function MoveBookingComponent() {
  const location=useLocation();
  const navigate=useNavigate();

  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [type, setType] = useState(0);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const [cardNumberForSearch, setCardNumberForSearch] = useState('');
  const [foundUser, setFoundUser] = useState(false);
  const [userID, setUserID] = useState('');
  const [roomPrice, setRoomPrice] = useState(location?.state?.price_room?.price_room);
  const [reservationType, setReservationType] = useState(0);
  const [bookerName, setBookerName] = useState(localStorage.getItem('email'));
  const [bookDate, setBookDate] = useState(new Date(Date.now()).toLocaleDateString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [cancelPrice, setCancelPrice] = useState('');
  const [earlyLeavePrice, setEarlyLeavePrice] = useState('');

  const [from, setFrom] = useState(location?.state?.from ? location?.state?.from : '');
  const [to, setTo] = useState(location?.state?.to ? location?.state?.to : '');
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [roomNumber, setRoomNumber] = useState(
    location?.state?.movementRoomObj?.room_number
  );

  // نقل حجز
  const [roomTransfered, setRoomTransfered] = useState(false);

  const [lastPillInfo, setLastPillInfo] = useState(null);

  // console.log('bookDate', bookDate);

  // console.log('lastPillInfo',lastPillInfo);

  //
  const [roomType, setRoomType] = useState(
    location?.state?.type ? location?.state?.type : ''
  )

  const [pill, setPill] = useState(location?.state?.pill);

  const user_type = localStorage.getItem('type');

  useEffect(() => {

    const get = async () => {
      // if (location?.state?.from) {
      //   const start = new Date(location?.state?.from);
      //   const end = new Date(location?.state?.to);
      //   const differenceInTime = end - start;
      //   const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      //   setNumberOfDays(differenceInDays);
      // }

      // let result = await window?.electron?.getLastPill();

      // setLastPillInfo(result?.book);
      let data = {
        type: 'serialNumber',
        value: location?.state?.pill?.serialNumber
      };
  
      console.log('data', data);
  
      let result = await window?.electron?.searchForBook(data);
  
      if (result?.book?._id) {
        if (result?.book?._id) {
          setFullName(result?.book?.userID?.fullName);
          setCardNumber(result?.book?.userID?.cardNumber);
          setType(result?.book?.userID?.type);
          setMobile(result?.book?.userID?.mobile);
          setAddress(result?.book?.userID?.address);
          setUserID(result?.book?.userID?._id);
          setFrom(new Date(result?.book?.from).toISOString().split('T')[0]);
          setTo(new Date(result?.book?.to).toISOString().split('T')[0]);
          setReservationType(result?.book?.type);
        //  setRoomPrice(result?.book?.roomPrice);
          setNumberOfDays(result?.book?.numberOfDays);
          setPaidPrice(result?.book?.paidPrice);
          setEnsurancePrice(result?.book?.ensurancePrice);
          setFinalPrice(result?.book?.finalPrice);
          setCompletePrice(result?.book?.completePrice);
          setBookerName(result?.book?.bookerName);
          setNotes(result?.book?.notes);
          setBookDate(new Date(result?.book?.bookDate).toISOString().split('T')[0]);
          setPill(result?.book);
         // setRoomNumber(result?.book?.roomID?.room_number);
          setRoomType(result?.book?.roomID?.type);
  
          setExtraPeice(result?.book?.extraPrice);
  
          setSubEnsurancePrice(result?.book?.subEnsurancePrice);
          setTransferPrice(result?.book?.transferPrice);
          setFoundUser(true);
        }
      }
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
 
 // const user_type = localStorage.getItem('type');

  const handleWheel = (event) => {
    // event.preventDefault();
    // Optionally blur the input to remove focus and further prevent interaction
    event.currentTarget.blur();
  };

  const updateBill = async (typeofBook) => {

    // updatePill

    // + Number(pill?.paidPrice)
    let data = {
      _id: pill?._id,
      // - Number(transferPrice)

      paidPrice: Number(paidPrice) + pill?.isTransferred ? (Number(pill?.finalPrice)) : Number(Number(pill?.finalPrice) == Number(pill?.paidPrice) ? 0 : pill?.paidPrice),
      ensurancePrice,
      finalPrice,
      completePrice,
      notes,
      extraPrice,
      subEnsurancePrice
    };

    // setRoomNumber(result?.book?.roomID?.room_number);
    if (typeofBook == 'فاتورة دخول') {
      data.completePrice = 0;
      data.status = typeofBook;
      if (pill?.arrivalDate == null || pill?.arrivalDate == undefined) data.arrivalDate = new Date();
      // نقل حجز
      if (roomTransfered) {
        console.log("roomTransfered obj");
        data.roomID = rooms?.find(el => el?.room_number == roomNumber)?._id;
        data.isTransferred = true;
        data.transferPrice = transferPrice;
        data.prevRoomID = pill?.roomID;
        data.roomPrice = roomPrice;

      }

    }

    if (typeofBook == 'فاتورة خروج') {
      // data.completePrice = 0;
      data.status = typeofBook;
      // data.ensurancePrice = 0;
      data.earlyLeavePrice = earlyLeavePrice;
      data.disabled = true;
      if (pill?.leaveDate == null || pill?.leaveDate == undefined) data.leaveDate = new Date();

    }

    if (typeofBook == 'الغاء الحجز') {
      // data.completePrice=0;
      data.status = typeofBook;
      data.cancelPrice = cancelPrice;
      data.disabled = true;
      // cancelDate
      if (pill?.cancelDate == null || pill?.cancelDate == undefined) data.cancelDate = new Date();


      // if (showConfirmModal == false) {
      //   //setConfirm(true);
      //   setShowConfirmModal(true);
      //   // alert('هل حقا تريد الغاء الحجز');
      //   return;
      // }

    }

    // // نقل حجز
    // if(roomTransfered){
    //   data.status = 'نقل حجز';
    //   data.roomID=roomNumber;

    // }

    console.log('data', data);

    // return;

    let result = await window?.electron?.updatePill(data);

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





     // navigate('/bookings');
    }


  }

  



  console.log('location',location);

  console.log('pill',pill);


  return (
    <div>
      <h1 className="my-4"> {'نقل حجز '}  </h1>
        <Tabs
        defaultActiveKey="home"
        id="justify-tab-example"
        className="mb-3"
        justify
        activeKey={activeTab}
        onSelect={(k)=>{
          if(userID==''){
           return toast.error('من فضلك ادخل بيانات العميل');
           // return;
          } 
          else{
            setActiveTab(k);
          }

    
          if (k === 'profile') {
            //  
              // Optionally, you could prevent tab switch or perform any other action here
            } 
            // setActiveTab(k)
        } }
      >
        <Tab eventKey="home" title=" معلومات العميل" tabClassName='notActiveTab'>
          <div className='w-75'>
            <form onSubmit={(e) => {
             // e.preventDefault();
             // addNewUser();
            }}>
              <div className="form-group">
                <label className="my-2">تصنيف العميل</label>
                <select
                  disabled={foundUser}
                  value={type} onChange={(e) => setType(e.target.value)}
                  required
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
                  type="text" className="form-control" placeholder=" الاسم رباعي" />
              </div>

              <div className="form-group">
                <label className="my-2"> رقم تحقيق الشخصية </label>
                <input
                  disabled={foundUser}
                  required
                  value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                  type="number" className="form-control" placeholder=" رقم تحقيق الشخصية" />
              </div>



              <div className="form-group">
                <label className="my-2"> رقم التليفون </label>
                <input disabled={foundUser} value={mobile} onChange={(e) => setMobile(e.target.value)} type="number" className="form-control" placeholder=" رقم التليفون" />
              </div>


              <div className="form-group">
                <label className="my-2"> عنوان </label>
                <input disabled={foundUser} value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" placeholder=" عنوان" />
              </div>
              {
                !foundUser &&  <div className='d-flex justify-content-start my-3'>
                  <button type='submit' className='btn btn-success'>   اضافة </button>
                </div>
              }

            </form>


          </div>

        </Tab>
        <Tab eventKey="profile" title="معلومات الحجز" tabClassName='notActiveTab'>


          <form onSubmit={(e) => {
            e.preventDefault();
            // if (!print) {
            //   addNewBook();
            // }
            // else {

            // }

          }}>
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


            <div className='w-75'>
              {
                 <div className="form-group">
                  <label className="my-2">
                    نوع الفاتورة
                  </label>
                  <input value={pill?.status == 'فاتورة دخول' ? 'فاتورة استكمال' : pill?.status} type="text" className="form-control" disabled />
                </div>
              }

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

              <div className="form-group">
                <label className="my-2">
                  {roomType == 'room' && 'رقم الغرفة'}
                  {roomType == 'shaleh' && 'رقم الشاليه'}
                  {roomType == 'sweet' && 'رقم السويت'}
                </label>
                <input value={roomNumber} type="text" className="form-control" disabled />
              </div>
            </div>

            <div className='w-75'>
              <div className="form-group">
                <label className="my-2"> اسم العميل</label>
                <input value={fullName} type="text" className="form-control" placeholder="اسم العميل" disabled />
              </div>

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

                  setFinalPrice(Number(price * numberOfDays) + Number(ensurancePrice));
                  setCompletePrice('');
                  setPaidPrice('');

                }} className="form-control" required disabled>
                  <option value={0}> من فضلك اختر تصنيف العميل </option>
                  <option value={'madany'}> مدني </option>
                  <option value={'army'}> قوات مسلحة </option>
                  <option value={'darMember'}> عضو دار </option>
                </select>
              </div>

              {
                reservationType != 0 && <>

                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2">  سعر الليلة </label>
                      <input value={roomPrice} type="number" className="form-control" placeholder="سعر الليلة" disabled />
                    </div>

                    <div className="form-group w-50">
                      <label className="my-2"> عدد الايام</label>
                      <input value={numberOfDays} type="number" className="form-control" placeholder="عدد الايام" disabled />
                    </div>
                  </div>

                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> المبلغ المدفوع</label>
                      <input value={paidPrice} onChange={(e) => {

                        // toast.success("This is a success message!");
                        //if(Number e.target.value > Number(finalPrice))

                        let price = e.target.value;
                        setPaidPrice(price);

                        let complete_price;

                        if (pill?.paidPrice) complete_price =
                          Number(finalPrice) - Number(pill?.paidPrice) < 0 ?
                            Number(finalPrice) - Number(price) :
                            Number(finalPrice) - Number(price) - Number(pill?.paidPrice);

                        else complete_price = Number(finalPrice) - Number(price);

                        //Number(finalPrice) - Number(price)-Number(pill?.paidPrice)
                        setCompletePrice(complete_price);

                      }}
                        // disabled={(pill?.status != 'حجز جديد' && print) ? true : false}
                        type="number" className="form-control" placeholder="المبلغ المدفوع"
                        onWheel={handleWheel}
                        required />
                    </div>

                    <div className="form-group w-50">
                      <label className="my-2"> مبلغ الاستكمال</label>
                      <input value={completePrice} type="number" className="form-control" placeholder="مبلغ الاستكمال" disabled />
                    </div>
                  </div>

                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> مبلغ التأمين</label>
                      <input value={ensurancePrice} onChange={(e) => {

                        //toast.success("This is a success message!");
                          setEnsurancePrice(e.target.value);
                          let price = Number(roomPrice * numberOfDays) + Number(e.target.value);
                          let complete_price = 0;
                          complete_price = (Number(price) - Number(paidPrice)) < 0 ? 0 : (Number(price) - Number(paidPrice));
                          // console.log('xxxxxxx', Math.abs(Number(price) - Number(paidPrice)));
                          setCompletePrice(complete_price - Number(pill?.paidPrice ?? 0));
                          setFinalPrice(price);
                          // setPaidPrice(price);
                      }}
                        onWheel={handleWheel}
                        // disabled={pill?._id ? true : false} 
                        type="number" className="form-control" placeholder="مبلغ التأمين" required />
                    </div>

                    <div className="form-group w-50">
                      <label className="my-2"> المبلغ النهائي</label>
                      <input value={finalPrice} type="number" className="form-control" placeholder="المبلغ النهائي" disabled />
                    </div>
                  </div>

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

                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> رسوم اضافية </label>
                      <input value={extraPrice} onChange={(e) => {
                        // let price=Number(finalPrice) + Number(e.target.value);

                        let price = Number(roomPrice * numberOfDays) + Number(ensurancePrice) + Number(e.target.value);
                        let complete_price = 0;
                        complete_price = (Number(price) - Number(paidPrice)) < 0 ? 0 : (Number(price) - Number(paidPrice) - Number(pill?.paidPrice ?? 0));

                        setCompletePrice(complete_price);
                        setFinalPrice(price);
                        setExtraPeice(e.target.value);
                      }} type="number"
                      onWheel={handleWheel}
                        // disabled={(completePrice == 0 || completePrice == '' || pill?.status == 'فاتورة دخول') ? true : false} 
                        className="form-control" placeholder="رسوم اضافية" />
                    </div>

                      <div className="form-group w-50">
                        <label className="my-2"> المبلغ المستقطع من التأمين </label>
                        <input
                          value={subEnsurancePrice}
                          onChange={(e) => {
                            if (Number(e.target.value) > Number(ensurancePrice)) {
                              //   toast.warning("Warning Notification!", {
                              //    // position: toast.POSITION.BOTTOM_RIGHT,
                              //     autoClose: 5000,
                              // });


                              setSubEnsurancePrice(0);
                            }

                            // alert('يجب ان يكون المبلغ المستقطع اقل او يساوي مبلغ التأمين');
                            else setSubEnsurancePrice(e.target.value)
                          }}
                          disabled={(ensurancePrice == 0 || pill?.status == 'حجز جديد') ? true : false}
                          type="number" onWheel={handleWheel} className="form-control" placeholder="المبلغ المستقطع من التأمين" />
                      </div>
                   
                  </div>

                  <div className="form-group">
                    <label className="my-2"> اسم الموظف </label>
                    <input
                      value={bookerName} onChange={(e) => setBookerName(e.target.value)} disabled={true}
                      type="text" className="form-control" placeholder=" اسم الموظف" required />
                  </div>

                  {
                   pill?.status != 'حجز جديد' && <>
                      {
                        pill?.status == 'حجز جديد' &&
                        <div className="form-group my-2">
                          <label className="my-2"> المبلغ المسترد في حالة الغاء الحجز </label>
                          <input
                            value={cancelPrice} onChange={(e) => setCancelPrice(e.target.value)}
                            type="number" onWheel={handleWheel} className="form-control" />
                        </div>
                      }

                      {
                        pill?.status != 'حجز جديد' &&
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


                  <div className="form-group">
                    <label className="my-2"> تاريخ الحجز </label>
                    <input value={bookDate} onChange={(e) => setBookDate(e.target.value)} type="text" className="form-control" disabled />
                  </div>

                  <div className='form-group'>
                    <label className="my-2"> ملاحظات </label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-control" style={{ height: '100px' }}>

                    </textarea>
                  </div>
                  {error && <Notify msg='من فضلك تأكد من اختيار المستخدم' type='danger' />}
                </>
              }

            </div>
          </form>


          {
            <div className='d-flex justify-content-center my-3 gap-2'>
              {
                (pill?.status == 'حجز جديد' || (pill?.status != 'فاتورة خروج' && pill?.status != 'فاتورة دخول')) ?
                  <>
                    <button className='btn btn-success' onClick={() => {
                      setBook_type('فاتورة دخول');
                      updateBill('فاتورة دخول');
                    }}
                      disabled={completePrice == 0 ? false : true}
                    > فاتورة استكمال </button>

                    <button onClick={async () => {
                      const data = {
                        from,
                        to
                      };
                      let result = await window?.electron?.searchForRoom(data);
                      console.log('result', result?.rooms);
                      setRooms(result?.rooms?.empty_rooms);

                      setShowMoveRecervation(true);

                    }} className="btn btn-info">نقل الحجز</button>

                    {user_type == 'admin' && <button className='btn btn-danger' onClick={() => updateBill('الغاء الحجز')} > الغاء الحجز </button>}

                  </>
                  :
                  pill?.status != 'فاتورة خروج' && <>

                    <button className='btn btn-success' onClick={() => {
                      setBook_type('فاتورة دخول');
                      updateBill('فاتورة دخول');
                    }}
                      disabled={completePrice == 0 ? false : true}
                    > فاتورة استكمال </button>

                    <button onClick={async () => {
                      const data = {
                        from,
                        to
                      };
                      let result = await window?.electron?.searchForRoom(data);
                      console.log('result', result?.rooms);
                      setRooms(result?.rooms?.empty_rooms);

                      setShowMoveRecervation(true);

                    }} className="btn btn-info">نقل الحجز</button>

                    <button className='btn btn-warning' onClick={() => {
                      setBook_type('فاتورة خروج');
                      updateBill('فاتورة خروج');

                    }}  > فاتورة خروج </button>

                  </>


              }



            </div>
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
                    <label className="my-2"> نقل الحجز </label>

                    <div className="form-group">
                      <label className="my-2">من </label>
                      <input type="text" value={from} className="form-control" disabled />
                    </div>

                    <div className="form-group">
                      <label className="my-2">الي  </label>
                      <input type="text" value={to} className="form-control" disabled />
                    </div>

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
                      <button onClick={() =>{}} className="btn btn-secondary my-3"> نقل </button>
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
    </div>
  )
}
