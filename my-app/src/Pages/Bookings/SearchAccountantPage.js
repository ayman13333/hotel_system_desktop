import React, { useEffect } from 'react'
import SideBar from '../../Utilities/SideBar'
import SearchAccountantComponent from '../../components/Bookings/SearchAccountantComponent'

export default function SearchAccountantPage() {
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
        <SearchAccountantComponent />

      </div>
    </div>
  )
}
