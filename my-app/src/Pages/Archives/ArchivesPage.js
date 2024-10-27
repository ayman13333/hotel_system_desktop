import { useEffect } from "react";
import ArchivesCompnent from "../../components/Archives/ArchivesCompnent";
import SideBar from "../../Utilities/SideBar";
import EditBookingComponent from "../../components/Bookings/EditBookingComponent";

export default function ArchivesPage() {

  useEffect(() => {
    const handleWheel = (event) => {
      // event.preventDefault();
      // Optionally blur the input to remove focus and further prevent interaction
      event.currentTarget.blur();
    };

    // let inputsElements=document.getElementsByTagName('input');

    const numberInputs = document.querySelectorAll('input[type="number"]');

    console.log('numberInputs', numberInputs);
    numberInputs.forEach(input => {
      input.addEventListener('wheel', handleWheel);
    });


  }, []);
  return (
    <div className="parent">
      <SideBar />
      <div className="p-4 w-100">
        <ArchivesCompnent />
      </div>
    </div>
  )
}
