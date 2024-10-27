import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Pages/Login';
import AllUsersPage from './Pages/users/AllUsersPage';
import AllRooms from './Pages/Rooms/AllRooms';
import AddRoom from './Pages/Rooms/AddRoom';
import AllBookingsPage from './Pages/Bookings/AllBookingsPage';
import AddBookingPage from './Pages/Bookings/AddBookingPage';
import SearchForBookPage from './Pages/Bookings/SearchForBookPage';
import SearchAccountantPage from './Pages/Bookings/SearchAccountantPage';
import GuestsPage from './Pages/users/GuestsPage';
import NewInvoice from './Pages/invoices/NewInvoice';
import EnterInvoice from './Pages/invoices/EnterInvoice';
import ExitInvoice from './Pages/invoices/ExitInvoice';
import CancelInvoice from './Pages/invoices/CancelInvoice';

//import 'react-toastify/dist/ReactToastify.css';  // EditBookingPage
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArchivesPage from './Pages/Archives/ArchivesPage';
import MoveBookingPage from './Pages/Bookings/MoveBookingPage';
import Warnnings from './Pages/warrnings/Warnnings';
import EditBookingPage from './Pages/Bookings/EditBookingPage';


 const App=()=> {

 // const location = useLocation();
  // const [path,setPath]=useState(window.location.hash);
  // useEffect(()=>{

  //   setPath(window.location.hash);

  //   const handleWheel = (event) => {
  //     // event.preventDefault();
  //     // Optionally blur the input to remove focus and further prevent interaction
  //     event.currentTarget.blur();
  //   };

  //  // let inputsElements=document.getElementsByTagName('input');

  //   const numberInputs = document.querySelectorAll('input[type="number"]');

  //   console.log('numberInputs',numberInputs);
  //   numberInputs.forEach(input => {
  //     input.addEventListener('wheel', handleWheel);
  //   });


  // },[]);


 // console.log('path',path);

  return (
    <div className="App">
   
      <HashRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path='/users' element={<AllUsersPage />} />
          <Route path='/guests' element={<GuestsPage />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/add' element={<AddRoom />} />
          <Route path='/rooms/edit' element={<AddRoom />} />
           {/* الحجوزات */}
          <Route path='/bookings' element={<AllBookingsPage />} />
          <Route path='/bookings/add' element={<AddBookingPage />} />
          {/* اضدار فاتورة */}
          <Route path='/booking/search' element={<SearchForBookPage />} />
          <Route path='/booking/move' element={<MoveBookingPage />} />
          {/* صفحة الطباعة */}
          <Route path='/accountant/search' element={<SearchAccountantPage />} />
          <Route path='/NewInvoice' element={<NewInvoice />} />
          <Route path='/EnterInvoice' element={<EnterInvoice />} />
          <Route path='/ExitInvoice' element={<ExitInvoice />} />
          <Route path='/CancelInvoice' element={<CancelInvoice />} />
          {/* ارشادات وتنبيهات */}
          <Route path='/Warnnings' element={<Warnnings />} />
          {/* الارشيف */}
          <Route path='/archives' element={<ArchivesPage />} />

            {/* تعديل الفاتورة */}
          <Route path='/pill/edit' element={<EditBookingPage />} />


        </Routes>

        <ToastContainer />
      </HashRouter>
    </div>
  );
}

export default App;
