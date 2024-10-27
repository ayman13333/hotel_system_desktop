import { useEffect } from "react";
import SideBar from "../../Utilities/SideBar";
import MoveBookingComponent from '../../components/Bookings/MoveBookingComponent';

export default function MoveBookingPage() {

    useEffect(()=>{ 
        const handleWheel = (event) => {
          // event.preventDefault();
          // Optionally blur the input to remove focus and further prevent interaction
          event.currentTarget.blur();
        };
        const numberInputs = document.querySelectorAll('input[type="number"]');
    
        // console.log('numberInputs',numberInputs);
        numberInputs.forEach(input => {
          input.addEventListener('wheel', handleWheel);
        });
      },[]);
  return (
    <div className="parent">
    <SideBar />
    <div className="p-4 w-100">
        <MoveBookingComponent />
    </div>
  </div>
  )
}
