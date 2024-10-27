import React, { useState } from 'react';
import StylesLogin from './Login.module.css'; 
import passEye from '../../../Assets/passEye.svg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { toggleLoader } from '../../../Redux/slice';

const Login = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const dispatch = useDispatch();
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        let errorMessage = '';
        if (name === 'email') {
            errorMessage = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
        } else if (name === 'password') {
            errorMessage = value.length < 8 ? 'Password must be at least 8 characters long' : '';
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    };

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (!formData.email) {
            toast.error('Valid email is required');
            return;
        }

        if (!formData.password) {
            toast.error('Valid password is required');
            return;
        }

        dispatch(toggleLoader());

        try {
            const response = await axios.post(`${baseUrl}/api/v1/users/login`, formData);
            toast.success(response.data.message);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.userId.toString());
            localStorage.setItem('name', response.data.name);
        
            localStorage.setItem('email',response.data.email)
            localStorage.setItem('das', true);

            setTimeout(() => {
                window.location.href = '/dashboard';
                dispatch(toggleLoader());
            }, 1000);

        } catch (error) {
            toast.error(error.response.data.message);
            localStorage.setItem('das', false);
            dispatch(toggleLoader());
        }
    };

    return (
        <>
        <div className={StylesLogin.login}>
            <h2 className={StylesLogin.loginTitle}>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        className={StylesLogin.inputEmail}
                        type="email"
                        name="email"
                        placeholder="         Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <br/>
                    {formSubmitted && <span className={StylesLogin.error}>{errors.email}</span>}
                </div>
                <br />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexWrap: 'nowrap' }}>
                    <input
                        className={StylesLogin.inputPassword}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="         Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <img title={!showPassword ?"show password":"hide password"}
                        src={showPassword ? passEye : passEye}
                        alt={showPassword ? 'Hide Password' : 'Show Password'}
                        className={StylesLogin.passwordIcon}
                        onClick={handleTogglePassword}
                        style={{ position: 'relative', left: '-40px' }}
                    />
                </div>
                    {formSubmitted && <span className={StylesLogin.error}>{errors.password}</span>}
                <br />
                <br />
                <button type="submit" className={StylesLogin.loginButton}>
                    Login
                </button>
            </form>
        </div>
        <ToastContainer />
        </>
    );
};

export default Login;
