import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsPlus } from 'react-icons/bs';
import { CiEdit } from "react-icons/ci";
import { useLocation, useNavigate } from 'react-router-dom';
import DataTableExtensions from "react-data-table-component-extensions";
import { Spinner } from 'react-bootstrap';



export default function AllRoomsComponent() {

  const navigate=useNavigate();
  const location=useLocation();

  const[rooms,setRooms]=useState(null);
  const[isLoading,setIsLoading]=useState(false);

  useEffect(()=>{
    const get=async()=>{
      setIsLoading(true);
      const result = await window?.electron?.getAllRooms();
      setIsLoading(false);
      console.log('result',result);

      setRooms(result?.rooms);
    }

    get();
  },[]);

  const columns = [
  {
    name: 'رقم الغرفة',
    selector: row => row.room_number,
    sortable: true,
  },
  {
    name: 'النوع',
    selector: row => row.type,
    sortable: true,
  },
  {
    name: 'مدني',
    selector: row => row.priceForUser,
    sortable: true,
  },
  {
    name: 'قوات مسلحة',
    selector: row => row.priceForArmy,
    sortable: true,
  },
  {
    name: 'عضو الدار',
    selector: row => row.priceForDarMember,
    sortable: true,
  },
  {
    name:'تحكم',
    cell:(row)=><button className='btn btn-warning' onClick={()=>navigate('/rooms/edit',{
      state:row
    })}> تحكم  <CiEdit /> </button>
  }
];

const tableData = {
  columns
};


  return (
    <div className='w-100 h-100'>
    <h1> ادارة الغرف   {isLoading&&<Spinner />} </h1>
    <button className='btn btn-success' onClick={()=>navigate('/rooms/add')}> اضافة <BsPlus /> </button>
   {
    rooms&&
    <DataTable
    // title="Arnold Movies"
    columns={columns}
    data={rooms}
    filter={true}
      filterPlaceholder={'ابحث هنا'}
    
    pagination
  />
   } 
  </div>
  )
}
