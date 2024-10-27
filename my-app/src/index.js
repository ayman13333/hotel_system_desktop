import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
// import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import App from "./App";
//import ReactDOM from 'react-dom';

// const root = ReactDOM.createRoot(
//   document.getElementById('root')
// );

ReactDOM.render(<App />, document.getElementById('root'));

//console.log('ReactDOM',root);

// ReactDOM.render(<App />, document.getElementById('root') );

// root.render(
//     <BrowserRouter>
//     <Routes>
//       <Route index element={<Login />} />

//       <Route path='/users' element={<AllUsersPage />} />
//       <Route path='/rooms' element={<AllRooms />} />
//       <Route path='/rooms/add' element={<AddRoom />} />
//       <Route path='/rooms/edit' element={<AddRoom />} />
//       <Route path='/bookings' element={<AllBookingsPage />} />
//       <Route path='/bookings/add' element={<AddBookingPage />} />
//       <Route path='/booking/search' element={<SearchForBookPage />} />
//     </Routes>
//     </BrowserRouter>

//     // <ToastContainer />

  
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
