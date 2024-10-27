import React, { useEffect, useState } from 'react'
import { Spinner, Tab, Tabs } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormatDate from '../../Utilities/FormatDate';

export default function SearchAccountantComponent() {

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


  useEffect(() => {
    const get = async () => {
      let result = await window?.electron?.getLastPill();

      setLastPillInfo(result?.book);
    }

    get();
  }, []);

  const onKeyEnter = (event) => {
    if (event.key == "Enter") {
      searchForPill();

    }
  }

  const searchForPill = async () => {

    // if (searchForBillType === '') return alert('من فضلك اختر نوع البحث');
    if (searchForBillType === '') return toast.error("من فضلك اختر نوع البحث");
    if (cardNumberForSearch === '') return toast.error("من فضلك اكتب ما تريد البحث عنه");

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
        // new Date(result?.book?.from).toISOString().split('T')[0]
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

  const user_type = localStorage.getItem('type');

  const printPill = () => {

    if (pill?.status == 'حجز جديد') {
      navigate('/NewInvoice', {
        state: { ...pill, print: true }
      });
      return;
    }

    if (pill?.status == 'فاتورة دخول') {
      navigate('/EnterInvoice', {
        state: { ...pill, print: true }
      });
      return;
    }

    // ExitInvoice
    if (pill?.status == 'فاتورة خروج') {
      navigate('/ExitInvoice', {
        state: { ...pill, print: true }
      });
      return;
    }

    // CancelInvoice
    if (pill?.status == 'الغاء الحجز') {
      navigate('/CancelInvoice', {
        state: { ...pill, print: true }
      });
      return;
    }
  }


  return (
    <div className='w-100 h-100'>
      <h1> طباعة فاتورة  </h1>
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

          <form>
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

                 pill?.isEdit == true && <div style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "0 62px",
                  padding: "10px",
                  margin: "20px",
                  borderRadius: "8px",
                  background: "#FF6347"
                }}>{`تم اجراء تعديل علي هذه الفاتورة بواسطة الادمن بتاريخ    ${FormatDate(new Date(pill?.editDate))}`}</div>
              }

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
                  if (type == 'madany') price = location?.state?.priceForUser;
                  if (type == 'army') price = location?.state?.priceForArmy;
                  if (type == 'darMember') price = location?.state?.priceForDarMember;

                  setRoomPrice(price);
                  // setFinalPrice('');

                  setFinalPrice(Number(price * numberOfDays) + Number(ensurancePrice));
                  setCompletePrice('');
                  setPaidPrice('');

                }} className="form-control" required disabled={true}>
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
                  <input value={paidPrice} type="number" className="form-control" placeholder="المبلغ المدفوع" disabled />
                </div>

                <div className="form-group w-50">
                  <label className="my-2"> مبلغ الاستكمال</label>
                  <input value={completePrice} type="number" className="form-control" placeholder="مبلغ الاستكمال" disabled />
                </div>
              </div>

              <div className='d-flex gap-3 my-3'>
                <div className="form-group w-50">
                  <label className="my-2"> مبلغ التأمين</label>
                  <input className="form-control" value={ensurancePrice} disabled />
                </div>

                <div className="form-group w-50">
                  <label className="my-2"> المبلغ النهائي</label>
                  <input value={finalPrice} type="number" className="form-control" placeholder="المبلغ النهائي" disabled />
                </div>
              </div>

              <div className='d-flex gap-3 my-3'>
                <div className="form-group w-50">
                  <label className="my-2"> رسوم اضافية </label>
                  <input value={extraPrice} type="number" disabled className="form-control" placeholder="رسوم اضافية" />
                </div>


                {/* <div className="form-group w-50">
                  <label className="my-2"> المبلغ النهائي</label>
                  <input value={finalPrice} type="number" className="form-control" placeholder="المبلغ النهائي" disabled />
                </div> */}
              </div>

              {
                <>
                  <div className='d-flex gap-3 my-3'>
                    <div className="form-group w-50">
                      <label className="my-2"> المبلغ المستقطع من التأمين </label>
                      <input
                        value={subEnsurancePrice}
                        disabled
                        type="number" className="form-control" placeholder="المبلغ المستقطع من التأمين" />
                    </div>

                    <div className="form-group w-50">
                      <label className="my-2"> المبلغ المسترد من التأمين </label>
                      <input
                        value={Number(ensurancePrice) - Number(subEnsurancePrice)}
                        disabled
                        type="number" className="form-control" placeholder="المبلغ المسترد من التأمين" />
                    </div>

                  </div>
                </>
              }

              <div className='d-flex gap-3 my-3'>
                {
                  pill?.isTransferred && <div className="form-group w-50">
                    <label className="my-2"> استرداد نقدي مبلغ فرق الحجز</label>
                    <input value={transferPrice} type="number" className="form-control" placeholder="استرداد نقدي مبلغ فرق الحجز" disabled />
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
                      type="number" className="form-control" disabled />
                  </div>
                </>
              }


              {
                pill?.status == 'فاتورة خروج' && <>
                  <div className="form-group my-2">
                    <label className="my-2">  المبلغ المسترد في حالة الخروج مبكرا </label>
                    <input
                      value={earlyLeavePrice}
                      type="number" className="form-control" disabled />
                  </div>
                </>
              }

              <div className="form-group">
                <label className="my-2"> تاريخ الحجز </label>
                <input value={bookDate} onChange={(e) => setBookDate(e.target.value)} type="text" className="form-control" disabled />
              </div>

              <div className='form-group'>
                <label className="my-2"> ملاحظات </label>
                <textarea value={notes} className="form-control" style={{ height: '100px' }} disabled>

                </textarea>
              </div>

            </div>

            {isLoading && <Spinner />}

            <div className='d-flex justify-content-center my-3 gap-2'>
              <button className='btn btn-success' onClick={() => printPill()} >
                طباعة
              </button>
            </div>

          </form>


        </Tab>

      </Tabs>
    </div>
  )
}
