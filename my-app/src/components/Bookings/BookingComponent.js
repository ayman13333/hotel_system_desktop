import { useEffect, useState } from "react";
import Card from "./Card";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

export default function BookingComponent() {
  const [rooms, setRooms] = useState(null);
  const [from, setFrom] = useState('');
  // const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState('');
  // const [to, setTo] = useState(new Date());
  const [emptyRooms, setEmptyRooms] = useState('');
  const [bookedRooms, setBookedRooms] = useState(''); 
  const[isLoading,setIsLoading]=useState(false);




  // console.log('from', typeof(from));
  useEffect(() => {
    const get = async () => {
      const data = {
        from:new Date(Date.now()),
        to:new Date(Date.now()),
      };
      let result = await window?.electron?.searchForRoom(data);
      console.log('result', result?.rooms);
   //   setRooms(result?.rooms?.empty_rooms);
      setEmptyRooms(result?.empty_room_count);
      setBookedRooms(result?.booked_room_count);
    }

    get();
  }, []);

  const onKeyEnter = (event)=>{
    if( event.key == "Enter"){
        search();
      
    
    }
  }


  const search = async () => {
    try {
      const data = {
        from,
        to
      };

 

      const from_date = new Date(new Date(from).getFullYear(), new Date(from).getMonth(), new Date(from).getDate()); 

      const to_date = new Date(new Date(to).getFullYear(), new Date(to).getMonth(), new Date(to).getDate()); 

      const myNowNoTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());







      console.log("RRRRRRRRRRRR from date from",from_date);
      console.log("RRRRRRRRRRR to date to",to_date);
      console.log("RRRRRRRRRRR now date now",myNowNoTime);


if(from_date.getTime() === to_date.getTime()||to_date<from_date||from_date<myNowNoTime||to_date<myNowNoTime){

  setRooms([]);
  return toast.error("تم ادخال التاريخ بشكل غير دقيق");
}







setIsLoading(true);
let result = await window?.electron?.searchForRoom(data);
setIsLoading(false);

console.log('result', result?.rooms);
      setRooms(result?.rooms?.empty_rooms);
      setEmptyRooms(result?.empty_room_count);
      setBookedRooms(result?.booked_room_count);

    } catch (error) {
      console.log("error", error);
    }
  }



  return (

    <div className='w-100 h-100'>
      <h1 style={{fontSize:"28px" , fontWeight:"700"}}> ادارة الحجوزات </h1>
    <br/>
      <div className="d-flex gap-3 justify-content-center my-3">
        <div className="form-group">
          {/* //-------------MOKHTAR Date ----------------------------------- */}
        {/* <div>
      <label htmlFor="datePicker">Select date:</label>
      <Flatpickr
        id="datePicker"
        value={from}
        onChange={handleDateChange}
        options={{
          dateFormat: "d/m/Y",
          altInput: true,
          altFormat: "d/m/Y",
        }}
      />
    </div> */}
          {/* //-------------MOKHTAR Date ----------------------------------- */}
       
          <label className="my-2">تاريخ بدء الحجز  </label>
          <input value={from} data-date-format="DD MMMM YYYY" onKeyPress={onKeyEnter} onChange={(e) => setFrom(e.target.value)} type="date" className="form-control" />
        </div>

        <div className="form-group">
          {/* //-------------MOKHTAR Date ----------------------------------- */}

        {/* <div>
      <label htmlFor="datePicker">Select date:</label>
      <Flatpickr
        id="datePicker"
        value={to}
        onChange={handleDateChangeTo}
        options={{
          dateFormat: "d/m/Y",
          altInput: true,
          altFormat: "d/m/Y",
        }}
      />
    </div> */}
          {/* //-------------MOKHTAR Date ----------------------------------- */}

          <label className="my-2">تاريخ نهاية الحجز  </label>
          <input value={to} onKeyPress={onKeyEnter} onChange={(e) => setTo(e.target.value)} type="date" className="form-control" />
        </div>

        <div className="form-group d-flex flex-column justify-content-end" style={{ width: '10%' }}>
          <button onClick={() => search()} className="btn btn-success">  بحث </button>
        </div>

        <div>
        {isLoading&&<Spinner />}
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-center my-3">
        <div className="card w-25">
          <div className="d-flex card-body justify-content-between">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h5 className="card-title"> الكل </h5>
            </div>
            <h5 className="text-center" style={{ display: 'flex', alignItems: 'center' }}>
              {Number(emptyRooms + bookedRooms)}
            </h5>

          </div>
        </div>
        <div className="card w-25">
          <div className="d-flex card-body justify-content-between">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h5 className="card-title"> الوحدات المشغولة </h5>
            </div>
            <h5 className="text-center" style={{ display: 'flex', alignItems: 'center' }}>{Number(bookedRooms)}</h5>

          </div>
        </div>
        <div className="card w-25">
          <div className="d-flex card-body justify-content-between">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h5 className="card-title"> الوحدات الخالية </h5>
            </div>
            <h5 className="text-center" style={{ display: 'flex', alignItems: 'center' }}>{emptyRooms}</h5>

          </div>
        </div>
      </div>

      <div className="row d-flex" style={{ gap: '2%' }}>
        {
          rooms && rooms?.length==0 ?
          <div class="alert alert-danger text-center" role="alert">
              لا توجد غرف متاحة في هذا التوقيت
          </div>
          :
           rooms?.map((el, i) => <Card key={i} el={el} from={from} to={to} />
          )
        }

      </div>
    </div>

  )
}
