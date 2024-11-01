import { useState } from "react";
import logo from "../images/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[isLoading,setIsLoading]=useState(false);

    const navigate=useNavigate();

    const login=async()=>{

       // navigate('/bookings');

        //  login
        const data={
            email,password
        }
        setIsLoading(true);
        let result = await window?.electron?.login(data);
        setIsLoading(false);

        // localStorage.setItem('type','admin');

        // navigate('/bookings');

        if(result?.success){
            localStorage.setItem('type',result?.user.type);
            localStorage.setItem('email',result?.user.email);

            if(result?.user.type=='accountant') navigate('/accountant/search');
            else navigate('/bookings');
        }

        console.log("result",result);
    }

    console.log('ppppppppppppppppppppppppppp');
    
    return (
        <div className="d-flex justify-content-center" style={{
            height: '100vh',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <img src={logo} alt="" />
            <form
            className="w-100 d-flex justify-content-center flex-column"
             onSubmit={(e)=>{
                e.preventDefault();
                login();
            }}>
                <div className="d-flex justify-content-center flex-column" style={{
                    alignItems:'center'
                }}>
                <div className="form-group w-50 items-center">
                    <label className="my-2">  الأيميل </label>
                    <input
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required
                        type="text" className="form-control" placeholder="الأيميل" />
                </div>

                <div className="form-group w-50">
                    <label className="my-2">  كلمة المرور </label>
                    <input
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password" className="form-control" placeholder="كلمة المرور" />
                </div>

                <div className="form-group w-50 my-3">
                    <button type="submit" className="btn btn-success w-100">
                        {isLoading&&<Spinner />} 
                        تسجيل الدخول 
                        </button>
                </div>
                </div>
             
            </form>

        </div>
    )
}
