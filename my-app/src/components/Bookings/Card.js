import room from "../../images/room.jfif";
import sweet from "../../images/sweet.jfif";
import shaleh from "../../images/shaleh.jfif";
import { useNavigate } from "react-router-dom";
import Notify from "../../Utilities/notify";
import { useState } from "react";


export default function Card({ el, from, to }) {
    const navigate = useNavigate();
    const[error,setError]=useState(false);

   // console.log('from',from);

    let image = '';
    let type = '';

    if (el?.type == "sweet") {
        image = sweet;
        type = 'سويت';
    }
    if (el?.type == "room") {
        image = room;
        type = 'غرفة';
    }
    if (el?.type == "shaleh") {
        image = shaleh;
        type = 'شالية';
    }

    return (
        <div className="card my-2" style={{ width: '18rem' }}
        onClick={() => {
            if(from=='' || to==''){
                setError(true);
                setTimeout(() => {
                  setError(false);
                }, 3000);

                return;
            }
            navigate('/bookings/add', {
                state: {
                    ...el,
                    from, to
                }
            });
        }} 
        
        >
            {/* {error && <Notify msg='من فضلك  ادخل تاريخ البداية والنهاية' type='danger' />} */}
            <img className="card-img-top my-2" src={image} alt="" />
            <div className="card-body">
                <div className="my-4">
                    <h3 className="card-title text-center">{el?.room_number}</h3>
                    <h5 className="card-text text-center">
                        النوع : {type}
                    </h5>
                </div>

                <div className="d-flex justify-content-center">
                    <button onClick={() => {
                        if(from=='' || to==''){
                            setError(true);
                            setTimeout(() => {
                              setError(false);
                            }, 3000);

                            return;
                        }
                        navigate('/bookings/add', {
                            state: {
                                ...el,
                                from, to
                            }
                        });
                    }} className="btn btn-success"> احجز الان </button>
                </div>
            </div>
        </div>
    )
}
