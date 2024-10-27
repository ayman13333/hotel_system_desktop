import React, { useState } from "react";

//import Notify from "../../Utilities/notify";

import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export const AddOrEditRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [roomNumber, setRoomNumber] = useState(location?.state?.room_number ? location?.state.room_number : '');
  const [roomType, setRoomType] = useState(location?.state?.type ? location?.state.type : 0);
  const [result, setResult] = useState(null);
  const [priceForUser, setPriceForUser] = useState(location?.state?.priceForUser ? location?.state.priceForUser : '');
  const [priceForArmy, setPriceForArmy] = useState(location?.state?.priceForArmy ? location?.state.priceForArmy : '');
  const [priceForDarMember, setPriceForDarMember] = useState(location?.state?.priceForDarMember ? location?.state.priceForDarMember : '');
  const[isLoading,setIsLoading]=useState(false);
  //const location=useLocation();

  console.log('location', location?.state);

  //-------------------------------------------
  const handleWheel = (event) => {
    // event.preventDefault();
    // Optionally blur the input to remove focus and further prevent interaction
    event.currentTarget.blur();
  };
  //-------------------------------------------
  const onSubmit = async () => {
    try {
      let data = {
        room_number: roomNumber,
        type: roomType,
        priceForUser,
        priceForArmy,
        priceForDarMember,
      }
      //  const response = await ipcRenderer.invoke('create-room', data);

      if (roomNumber == "" || roomType == 0 || priceForUser == "" || priceForArmy == "" || priceForDarMember == "") {
        return toast.error("من فضلك اكمل بيانات الغرفة");
      }

      let result = {};

      if (location?.state?._id) {
        data._id = location?.state?._id;

        setIsLoading(true);
        result = await window?.electron?.editRoom(data);
        setIsLoading(false);

      }
      else {
        setIsLoading(true);
        result = await window?.electron?.createRoom(data);
        setIsLoading(false);
      }

      console.log('result', result);
      navigate('/rooms');

      // setResult(result);
      // setRoomNumber("");
      // setRoomType(0);
      // setResult(null);
      // setPriceForUser('');
      // setPriceForArmy('');
      // setPriceForDarMember('');
      // toast.success('تم الاضافة بنجاح');



    } catch (error) {
      console.error(error);
      const result = { success: false };
      setResult(result);
    }

    setTimeout(() => {
      //console.log('bbbbbbbbbbbbbbbbb');
      setResult(null);
    }, 3000);
  }

  //toast.success('تم الاضافة بنجاح');


  // new Notification({ title: 'Room Created' }).show();
  //-------------------------------------------------------------------
  // roomNumber
  // roomType
  // priceForUser
  // priceForArmy
  // priceForDarMember

  // for gomaa cheak
  // if(roomNumber == "" || roomType =="" || priceForUser =="" || priceForArmy =="" || priceForDarMember=="" ){
  //   toast.error("من فضلك اكمل بيانات الغرفة");
  // }

  //-------------------------------------------------------------------

  return <div className="container">
    {/* {
      result?.success == true && <Notify msg={`${location?.state?._id ? 'تم التعديل بنجاح' : 'تم الاضافة بنجاح'}`} type='success' />
    }

    {
      result?.success == false && <Notify msg='حدث خطأ اثناء عملية الاضافة' type='danger' />
    } */}

    <h1> {location?.state?._id ? ' تعديل غرفة' : ' اضافة غرفة'}</h1>

    <div className="form-group">
      <label className="my-2">رقم الغرفة</label>
      <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} type="text" className="form-control" placeholder="رقم الغرفة" onWheel={handleWheel} />
    </div>

    <div className="form-group">
      <label className="my-2">نوع الغرفة</label>
      <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="form-control">
        <option value={0}> من فضلك اختر نوع الغرفة </option>
        <option value={'room'}> غرفة </option>
        <option value={'shaleh'}> شالية </option>
        <option value={'sweet'}> سويت </option>
      </select>
    </div>

    <div className="form-group">
      <label className="my-2"> السعر بالنسبة للمدني</label>
      <input value={priceForUser} onChange={(e) => setPriceForUser(e.target.value)} type="number" className="form-control" placeholder="السعر بالنسبة للمدني" />
    </div>

    <div className="form-group">
      <label className="my-2"> السعر بالنسبة لعضو الدار </label>
      <input value={priceForDarMember} onChange={(e) => setPriceForDarMember(e.target.value)} type="number" className="form-control" placeholder="السعر بالنسبة لعضو الدار" />
    </div>

    <div className="form-group">
      <label className="my-2"> السعر بالنسبة للقوات المسلحة</label>
      <input value={priceForArmy} onChange={(e) => setPriceForArmy(e.target.value)} type="number" className="form-control" placeholder="السعر بالنسبة للقوات المسلحة" />
    </div>

    <div className="d-flex justify-content-between">
      <button onClick={() => onSubmit()} className={`${location?.state?._id ? 'btn btn-warning mt-3' : 'btn btn-success mt-3'}`}>
        {location?.state?._id ? 'تعديل' : 'اضافة'}
      </button>

      <button onClick={() => navigate(-1)} className="btn btn-secondary mt-3"> رجوع </button>
    </div>

    {isLoading&&<Spinner />}

  </div>


}
