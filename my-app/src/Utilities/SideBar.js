//import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MdBedroomParent, MdLogout, MdModeEdit } from "react-icons/md";
import { BsArrowLeftRight, BsBackpack4Fill, BsCalendar2DateFill, BsClipboardCheckFill, BsFillFilePersonFill, BsFillPersonVcardFill, BsGlobeCentralSouthAsia } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  //  console.log('lllll', localStorage.getItem('type'));

  const type = localStorage.getItem('type');

  return (
    <div style={{ width: '20%', backgroundColor: '#212529', color: 'white' }}>
      <div className='p-2 sidebar'>
        <h4 className='my-3 text-center'> لوحة التحكم </h4>

        <p className='text-right my-3'>   <BsFillFilePersonFill />  {localStorage.getItem('email')} </p>
        {
          type == 'admin' && <NavLink className='link my-3' to={'/rooms'}>
            <span style={{ display: "flex", gap: "10px" }}>
              <div>
                <MdBedroomParent />
              </div>
              <div>
                ادارة الغرف
              </div>
            </span>
          </NavLink>
        }

        {
          type == 'admin' &&
          <>
            <NavLink className='link my-3' to={'/users'}>
              <span style={{ display: "flex", gap: "10px" }}>
                <div>
                  <BsGlobeCentralSouthAsia />
                </div>
                <div>
                  ادارة الموظفين
                </div>
              </span>
            </NavLink>

            <NavLink className='link my-3' to={'/archives'}>
              <span style={{ display: "flex", gap: "10px" }}>
                <div>
                  <BsCalendar2DateFill />
                </div>
                <div>
                  الارشيف
                </div>
              </span>
            </NavLink>
          </>
        }

        {
          type !== 'accountant' &&
          <NavLink className='link my-3' to={'/guests'}>
            <span style={{ display: "flex", gap: "10px" }}>
              <div>
                <BsFillPersonVcardFill />
              </div>
              <div>
                سجل العملاء
              </div>
            </span>
          </NavLink>
        }

        {
          type !== 'accountant' && <NavLink className={`link my-3 ${location?.pathname.includes('bookings') ? 'active' : ''}`} to={'/bookings'}>
            <span style={{ display: "flex", gap: "10px" }}>
              <div>
                <BsArrowLeftRight />
              </div>
              <div>
                ادارة الحجوزات
              </div>
            </span>
          </NavLink>
        }


        {
          type !== 'accountant' &&
          <NavLink className='link my-3' to={'/booking/search'}>
            <span style={{ display: "flex", gap: "10px" }}>
              <div>
                <BsClipboardCheckFill />
              </div>
              <div>
                اصدار فاتورة
              </div>
            </span>
          </NavLink>
        }

        <NavLink className='link my-3' to={'/accountant/search'}>
          <span style={{ display: "flex", gap: "10px" }}>
            <div>
              <BsBackpack4Fill />
            </div>
            <div>
              طباعة فاتورة
            </div>
          </span>
        </NavLink>


        {
          type == 'accountant' &&
          <NavLink className='link my-3' to={'/archives'}>
            <span style={{ display: "flex", gap: "10px" }}>
              <div>
                <BsCalendar2DateFill />
              </div>
              <div>
                الارشيف
              </div>
            </span>
          </NavLink>
        }

        {
          type == 'admin' && <NavLink className='link my-3' to={'/pill/edit'}>
            <span style={{ display: "flex", gap: "10px" }}>
              <div>
              <MdModeEdit />
              </div>
              <div>
                تعديل الفاتورة
              </div>
            </span>
          </NavLink>
        }

        <NavLink className='link my-3' to={'/Warnnings'}>
          <span style={{ display: "flex", gap: "10px" }}>
            <div>
              <FaCircleInfo />
            </div>
            <div>
              ارشادات وتنبيهات
            </div>
          </span>
        </NavLink>



        {/* Invoice */}

        {/* 
        <NavLink className='link my-2' to={'/Invoice'}>
          <span> <BsBackpack4Fill />  طباعة  </span>
        </NavLink> 
        */}



        <button onClick={() => {
          localStorage.removeItem('type');
          localStorage.removeItem('email');
          navigate('/');
        }} className=' my-2 mx-auto w-100 btn btn-danger' style={{
        }}>
          <span> <MdLogout />  تسجيل الخروج  </span>
        </button>


      </div>

    </div>
  )
}




