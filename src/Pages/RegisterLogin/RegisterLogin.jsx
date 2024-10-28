import React, { useEffect, useState } from 'react';
import StylesRegisterLogin from './RegisterLogin.module.css';
import LeftSideBar from '../../Components/RegisterLogin/LeftSideBar/LeftSideBar';
import Register from '../../Components/RegisterLogin/Register/Register';
import Login from '../../Components/RegisterLogin/Login/Login';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loading from '../../../public/Assets/loading.gif';



const RegisterLogin = () => {


    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [isRegisterVisible, setIsRegisterVisible] = useState(true);

    const handleToggleForm = () => {
        setIsRegisterVisible((prevIsRegisterVisible) => !prevIsRegisterVisible);
    };

    const [isLoading,setIsLoading]=useState(true)


    const isServerLive=async ()=>{



        const response = await axios.get(`${baseUrl}`) 

        if(response.status===200)
       { 
        toast.success(response.data.message)
        setIsLoading(false)
       }

        

    }


    useEffect(()=>{

      
        isServerLive()
     
        
    },[])

    return (


        <div className={StylesRegisterLogin.registerLogin}>

            { isLoading&& <div className={StylesRegisterLogin.loading} style={{}}>
                
                <span className={StylesRegisterLogin.loadingSpan}>connecting to server</span>
                <img  className={StylesRegisterLogin.loadingGif} src={loading} alt="" />

            </div>}

            <div><LeftSideBar /></div>
            <div className={StylesRegisterLogin.form}>
                {isRegisterVisible ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', left: '1%' }}>
                            <Register handleToggleForm={handleToggleForm} />
                        </div>
                        <br />
                        <div className={StylesRegisterLogin.font_4}>Have an account?</div>
                        <br />
                        <button className={StylesRegisterLogin.loginBut} onClick={handleToggleForm}>Log in</button>
                    </>
                ) : (
                    <>
                        <Login />
                        <br />
                        <div className={StylesRegisterLogin.font_4}>Have no account yet?</div>
                        <br />
                        <button className={StylesRegisterLogin.registerBut} onClick={handleToggleForm}>Register</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterLogin;
