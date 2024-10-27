import { useEffect } from "react";
import AllRoomsComponent from "../../components/Rooms/AllRoomsComponent";
import SideBar from "../../Utilities/SideBar";

export default function AllRooms() {

  useEffect(()=>{ 
    const handleWheel = (event) => {
      // event.preventDefault();
      // Optionally blur the input to remove focus and further prevent interaction
      event.currentTarget.blur();
    };

   // let inputsElements=document.getElementsByTagName('input');

    const numberInputs = document.querySelectorAll('input[type="number"]');

    console.log('numberInputs',numberInputs);
    numberInputs.forEach(input => {
      input.addEventListener('wheel', handleWheel);
    });


  },[]);
    //console.log('xxxxxxxxxxx');
  return (
    <div className='parent'>
        <SideBar />
        <div className="p-4 w-100">
        <AllRoomsComponent />
        </div>    
    </div>
  )
}
