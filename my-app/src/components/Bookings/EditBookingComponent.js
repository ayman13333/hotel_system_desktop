import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormatDate from '../../Utilities/FormatDate';

export default function EditBookingComponent() {
  const location = useLocation();
  const navigate = useNavigate();

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
  const [bookerName, setBookerName] = useState('');
  const [bookDate, setBookDate] = useState(new Date(Date.now()).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [cancelPrice, setCancelPrice] = useState('');
  const [earlyLeavePrice, setEarlyLeavePrice] = useState('');

  const [from, setFrom] = useState(location?.state?.from ? location?.state?.from : '');



  const [to, setTo] = useState(location?.state?.to ? location?.state?.to : '');
  const [numberOfDays, setNumberOfDays] = useState(0);

  const [roomNumber, setRoomNumber] = useState(
    location?.state?.room_number ? location?.state?.room_number : ''
  );

  //
  const [roomType, setRoomType] = useState(
    location?.state?.type ? location?.state?.type : ''
  )

  const [pill, setPill] = useState();

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

  const [extraPrice, setExtraPeice] = useState(0);


  // غادر مبكرا
  const [error, setError] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [subEnsurancePrice, setSubEnsurancePrice] = useState(0);
  const [transferPrice, setTransferPrice] = useState(0);

  const [lastPillInfo, setLastPillInfo] = useState(null);

  const [activeTab, setActiveTab] = useState('home');

  const [isEdit, setIsEdit] = useState(false);

  const [errorCashBack, setErrorCashBack] = useState('');
  const [editDate, setEditDate] = useState('');

  const[showDeleteBookModal,setShowDeleteBookModal]=useState(null);


  const user_type = localStorage.getItem('type');


  useEffect(() => {
    const get = async () => {
      let result = await window?.electron?.getLastPill();

      setLastPillInfo(result?.book);
    }

    get();
  }, []);



  const onKeyEnter = (event) => {
    return;
    if (event.key == "Enter") {
      searchForPill();

    }
  }


  const searchForPill = async () => {

    if (searchForBillType === '') return toast.error("من فضلك اختر نوع البحث");
    if (cardNumberForSearch === '') return toast.error("من فضلك اكتب ما تريد البحث عنه");
    else {
      let data = {
        type: searchForBillType,
        value: cardNumberForSearch
      };

      console.log('data', data);

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
          setFrom(FormatDate(new Date(result?.book?.from)));

          setTo(FormatDate(new Date(result?.book?.to)));
          setReservationType(result?.book?.type);
          setRoomPrice(result?.book?.roomPrice);
          setNumberOfDays(result?.book?.numberOfDays);
          setPaidPrice(result?.book?.paidPrice);
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
          setSubEnsurancePrice(result?.book?.subEnsurancePrice);

          setCancelPrice(result?.book?.cancelPrice);
          setEarlyLeavePrice(result?.book?.earlyLeavePrice);

          setTransferPrice(result?.book?.transferPrice);

          setFoundUser(true);
        }
      }
      console.log("result", result);

    }


  }





  // const myFromNoTime = new Date(
  //   pill?.from.getFullYear(),
  //   pill?.from.getMonth(),
  //   pill?.from.getDate()
  // );


  // const myToNoTime = new Date(
  //   pill?.to.getFullYear(),
  //   pill?.to.getMonth(),
  //   pill?.to.getDate()
  // );

  // const lastnow = new Date();
  // const myNowNoTime = new Date(lastnow.getFullYear(), lastnow.getMonth(), lastnow.getDate());

 
   const updateBill = async (typeofBook) => {

    typeofBook = pill?.status;

    if (Number(paidPrice) < 0 ) {

      return toast.error("تأكد من المبلغ المدفوع لا يساوي صفر او اقل منه");

    }
    else if (
      Number(ensurancePrice) < 0 ||
      Number(extraPrice) < 0 ||
      Number(subEnsurancePrice) < 0 ||

      Number(cancelPrice) < 0 ||
      Number(earlyLeavePrice) < 0

    ) return toast.error(" تأكد انه لا يوجد مبالغ اقل من صفر");

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
      cancelPrice,
      transferPrice, earlyLeavePrice, roomPrice,
      type: reservationType,
      isEdit,
      editDate: new Date()
    };



    console.log('data', data);

    // return;
    setIsLoading(true);
    let result = await window?.electron?.updatePill(data);
    setIsLoading(false);

    console.log('result?.book', result);

    //   return;

    if (result?.success) {

      if (pill?.status == 'حجز جديد') {
        navigate('/NewInvoice', {
          state: {
            ...result?.book,
            print: true
          }
        });
        return;
      }

      //EnterInvoice
      if (typeofBook == 'فاتورة دخول') {
        navigate('/EnterInvoice', {
          state: {
            ...result?.book,
            print: true
          }
        });
        return;
      }

      // ExitInvoice
      if (typeofBook == 'فاتورة خروج') {
        navigate('/ExitInvoice', {
          state: {
            ...result?.book,
            print: true
          }
        });
        return;
      }

      // CancelInvoice
      if (typeofBook == 'الغاء الحجز') {
        navigate('/CancelInvoice', {
          state: {
            ...result?.book,
            print: true
          }
        });
        return;
      }

    }

  }

  const printPill = () => {

    if (pill?.status == 'حجز جديد') {
      navigate('/NewInvoice', {
        state: {
          ...pill,
          print: true
        }
      });
      return;
    }

    if (pill?.status == 'فاتورة دخول') {
      navigate('/EnterInvoice', {
        state: {
          ...pill,
          print: true
        }
      });
      return;
    }

    // ExitInvoice
    if (pill?.status == 'فاتورة خروج') {
      navigate('/ExitInvoice', {
        state: {
          ...pill,
          print: true
        }
      });
      return;
    }

    // CancelInvoice
    if (pill?.status == 'الغاء الحجز') {
      navigate('/CancelInvoice', {
        state: {
          ...pill,
          print: true
        }
      });
      return;
    }


  }

  const deletePill=async()=>{
    try {
      // pill
      const id=pill?._id;

      let data={
        id
      };

      setIsLoading(true);
    let result = await window?.electron?.deletePill(data);
    setIsLoading(false);

    if(result?.success){
       toast.success("تم حذف الفاتورة بنجاح");

       setShowDeleteBookModal(false);

      setTimeout(()=>{
          navigate('/bookings');
      },1500);

    }
    else{
      return toast.error("فشل في الحذف حاول مرة اخري");
    }

    } catch (error) {
      return toast.error("فشل في الحذف حاول مرة اخري");
    }
  }

  //console.log("searchForBillType",searchForBillType);

  return (
    <div className='w-100 h-100'>

      <h1> تعديل فاتورة  </h1>

      <h4 className='my-3'> رقم امر الدفع الاخير : {lastPillInfo?.serialNumber} </h4>

      {isLoading && <Spinner />}
      <div className='form-group d-flex justify-content-center my-4 gap-3'>
        <select required value={searchForBillType} onKeyPress={onKeyEnter} onChange={(e) => setSearchForPillType(e.target.value)} className='form-control w-25'>
          <option value={''}> اختر نوع البحث </option>
          <option value={'cardNumber'}> رقم تحقيق الشخصية </option>
          <option value={'serialNumber'}> رقم الفاتورة </option>
        </select>
        <input
          value={cardNumberForSearch} onKeyPress={onKeyEnter} onChange={(e) => setCardNumberForSearch(e.target.value)}
          type="number" className="form-control w-50"
          placeholder="ابحث هنا" />
        <button onClick={() => searchForPill()} className='btn btn-success'> بحث </button>
      </div>


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
            <form>
              <div className="form-group">
                <label className="my-2">تصنيف العميل</label>
                <select
                  disabled
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
                  disabled
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                  required
                  type="text" className="form-control" placeholder=" الاسم رباعي" />
              </div>

              <div className="form-group">
                <label className="my-2"> رقم تحقيق الشخصية </label>
                <input
                  disabled
                  required
                  value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                  type="number" className="form-control" placeholder=" رقم تحقيق الشخصية" />
              </div>



              <div className="form-group">
                <label className="my-2"> رقم التليفون </label>
                <input disabled value={mobile} onChange={(e) => setMobile(e.target.value)} type="number" className="form-control" placeholder=" رقم التليفون" />
              </div>


              <div className="form-group">
                <label className="my-2"> عنوان </label>
                <input disabled value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" placeholder=" عنوان" />
              </div>

            </form>


          </div>

        </Tab>
        <Tab eventKey="profile" title="معلومات الحجز" tabClassName='notActiveTab'>

         
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

              <div className="form-group">
                <label className="my-2">
                  نوع الفاتورة
                </label>
                <input value={pill?.status == 'فاتورة دخول' ?
                  `فاتورة استكمال ${pill?.isTransferred ? `( نقل حجز )  - رقم الغرفه السابقه :  ${pill?.prevRoomID?.room_number}` : ''}`
                  : pill?.status} type="text" className="form-control" disabled />
              </div>

              {
                pill?._id && <div className="form-group">
                  <label className="my-2">
                    رقم امر الدفع
                  </label>
                  <input value={pill?.serialNumber} type="text" className="form-control" disabled />
                </div>
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
                <label className="my-2">تصنيف العميل</label>
                <select value={reservationType} onChange={(e) => {
                  const type = e.target.value;
                  let price = 0;

                  setReservationType(type);
                  if (type == 'madany') price = pill?.roomID?.priceForUser;
                  if (type == 'army') price = pill?.roomID?.priceForArmy;
                  if (type == 'darMember') price = pill?.roomID?.priceForDarMember;

                  setRoomPrice(price);


                }} className="form-control" required disabled={pill?.status == 'حجز جديد' ? false : true}>
                  <option value={0}> من فضلك اختر تصنيف العميل </option>
                  <option value={'madany'}> مدني </option>
                  <option value={'army'}> قوات مسلحة </option>
                  <option value={'darMember'}> عضو دار </option>
                </select>
              </div>

              <div className='d-flex gap-3 my-3'>
                <div className="form-group w-50">
                  <label className="my-2"> سعر الليلة </label>
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
                    setPaidPrice(e.target.value);
                    setIsEdit(true);
                  }} type="number" className="form-control" placeholder="المبلغ المدفوع" />
                </div>

                <div className="form-group w-50">
                  <label className="my-2"> مبلغ الاستكمال</label>
                  <input value={completePrice} onChange={(e) => {
                    setIsEdit(true);
                    setCompletePrice(e.target.value);
                  }} type="number" className="form-control" placeholder="مبلغ الاستكمال" />
                </div>
              </div>

              <div className='d-flex gap-3 my-3'>
                <div className="form-group w-50">
                  <label className="my-2"> مبلغ التأمين</label>
                  <input
                    className="form-control"
                    value={ensurancePrice}
                    onChange={(e) => {
                     
                      setEnsurancePrice(e.target.value);
                      setIsEdit(true);
                    }}
                  />
                </div>

                <div className="form-group w-50">
                  <label className="my-2"> المبلغ النهائي</label>
                  <input value={finalPrice} onChange={(e) => {
                    setIsEdit(true);
                    setFinalPrice(e.target.value);
                  }} type="number" className="form-control" placeholder="المبلغ النهائي" />
                </div>
              </div>

              <div className='d-flex gap-3 my-3'>
                <div className="form-group w-50">
                  <label className="my-2"> رسوم اضافية </label>
                  <input
                    value={extraPrice}
                    onChange={(e) => {
                    
                      setExtraPeice(e.target.value);
                      setIsEdit(true);
                    }}

                    type="number" className="form-control" placeholder="رسوم اضافية" />
                </div>


               
              </div>

              {
                <>
                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> المبلغ المستقطع من التأمين </label>
                      <input
                        value={subEnsurancePrice}
                        onChange={(e) => {

                          if (Number(e.target.value) > Number(ensurancePrice)) setSubEnsurancePrice(pill?.subEnsurancePrice);
                          else {
                            setSubEnsurancePrice(e.target.value);
                            setIsEdit(true);
                          }

                        }}
                        type="number" className="form-control" placeholder="المبلغ المستقطع من التأمين" />
                    </div>

                    {/* <div className="form-group w-50">
                      <label className="my-2"> المبلغ المسترد من التأمين </label>
                      <input
                        value={Number(ensurancePrice) - Number(subEnsurancePrice)}
                        disabled
                        type="number" className="form-control" placeholder="المبلغ المسترد من التأمين" />
                    </div> */}

                  </div>
                </>
              }

              <div className='d-flex gap-3 my-3'>
                {
                  pill?.isTransferred && <div className="form-group w-50">
                    <label className="my-2"> استرداد نقدي مبلغ فرق الحجز</label>
                    <input value={transferPrice} onChange={(e) => {
                      setIsEdit(true);
                      setTransferPrice(e.target.value);
                    }} type="number" className="form-control" placeholder="استرداد نقدي مبلغ فرق الحجز" />
                  </div>
                }

              </div>



              {/* {Number(location?.state?.ensurancePrice) - Number(location?.state?.subEnsurancePrice)} */}

              <div className="form-group">
                <label className="my-2"> اسم الموظف </label>
                <input
                  value={bookerName} onChange={(e) => setBookerName(e.target.value)} disabled={true}
                  type="text" className="form-control" placeholder=" اسم الموظف" required />
              </div>


              {
                pill?.status == 'الغاء الحجز' && <>
                  <div className="form-group my-2">
                    <label className="my-2"> المبلغ المسترد في حالة الغاء الحجز </label>
                    <input
                      value={cancelPrice}
                      onChange={(e) => {
                        setIsEdit(true);
                        setCancelPrice(e.target.value);
                      }
                      }
                      type="number" className="form-control" />
                  </div>
                </>
              }


              {
                pill?.status == 'فاتورة خروج' && <>
                  <div className="form-group my-2">
                    <label className="my-2">  المبلغ المسترد في حالة الخروج مبكرا </label>
                    <input
                      onChange={(e) => {
                        setEarlyLeavePrice(e.target.value);
                        setIsEdit(true);
                      }}
                      value={earlyLeavePrice}
                      type="number" className="form-control" />
                  </div>
                </>
              }

              <div className="form-group">
                <label className="my-2"> تاريخ الحجز </label>
                <input value={bookDate} onChange={(e) => setBookDate(e.target.value)} type="text" className="form-control" disabled />
              </div>

              <div className='form-group'>
                <label className="my-2"> ملاحظات </label>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setIsEdit(true);
                  }}
                  className="form-control" style={{ height: '100px' }} >

                </textarea>
              </div>

            </div>

            {isLoading && <Spinner />}

            <div className='d-flex justify-content-center my-3 gap-2'>

              <button className='btn btn-success' onClick={() => {
                if (isEdit == true) {
                  console.log('updateBill');
                  updateBill();
                }
                else {
                  console.log('printPill');
                  printPill();
                }
              }} >
                طباعة
              </button>

              <button  type='button' onClick={()=>{
                setShowDeleteBookModal(true);
              }} className='btn btn-danger'>
                حذف الفاتورة
              </button>

              {/* pop up - حذف الفاتورة */}

              {showDeleteBookModal &&
                 <Modal show={showDeleteBookModal} 
                 onHide={() =>{
                  setShowDeleteBookModal(false);
                 }}
                 >
                 <Modal.Header>
                   <Modal.Title>
                     {/* {isEdit ? ' تعديل المستخدم' : 'اضافة مستخدم'} */}
                   </Modal.Title>
                 </Modal.Header>
                 <Modal.Body>
 
                   <div className="form-group">
                     <label className="my-2"> هل حقا تريد  حذف الفاتورة </label>
 
                   </div>
 
                   <div className="d-flex my-3 justify-content-between">
 
                     <Button onClick={() => {
                    
                      deletePill();
                     }} variant="danger" >
                       نعم
                     </Button>
 
                     <Button className="gap-2" variant="secondary" 
                     onClick={() => {
                       setShowDeleteBookModal(false);
                     }}
                     >
                       لا
                     </Button>
                   </div>
                 </Modal.Body>
               </Modal>
              }
            </div>

          


        </Tab>

      </Tabs>
    </div>
  )

}
