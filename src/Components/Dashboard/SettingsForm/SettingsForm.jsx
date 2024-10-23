import React, { useState } from 'react';
import axios from 'axios';
import StyleSettingsForm from './SettingsForm.module.css';
import passEye from '../../../Assets/passEye.svg';
import { useDispatch } from 'react-redux';
import { toggleLoader } from '../../../Redux/slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsForm = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    _id: localStorage.getItem('id'),
    name: '',
    email: '',
    oldPassword: '',
    newPassword: ''
  });

  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    oldPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));


    if (formSubmitted) {
      let errorMessage = '';
      if (name === 'name') {
        errorMessage = value.trim() === '' ? 'Name is required' : '';
      } else if (name === 'email') {
        errorMessage = !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : '';
      } else if (name === 'newPassword') {
        errorMessage = value.length < 8 ? 'Password must be at least 8 characters long' : '';
      } else if (name === 'oldPassword') {
        errorMessage = value.trim() === '' ? 'Old password is required' : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleOldPassword = () => {
    setShowOldPassword((prevShowOldPassword) => !prevShowOldPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    dispatch(toggleLoader());
    
    // Validation
    const fieldsToUpdate = [formData.name, formData.email, formData.oldPassword, formData.newPassword].filter(Boolean).length;
    
    if (fieldsToUpdate === 0) {
      toast.error('One field is required to update!');
      dispatch(toggleLoader());
      return;
    }
    
    if (fieldsToUpdate > 1 && !(formData.oldPassword && formData.newPassword)) {
      toast.error('Only one field can be updated at a time, or both passwords must be provided!');
      dispatch(toggleLoader());
      return;
    }
    
    // Check for password update requirements
    if ((formData.newPassword && !formData.oldPassword) || (!formData.newPassword && formData.oldPassword)) {
      toast.error('Both old and new passwords are needed to update the password!');
      dispatch(toggleLoader());
      return;
    }
    
    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/update/settings`, formData, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
        }
      });
      
      const { updatedDocument } = response.data;
  
      if (response.status === 200) {
        // Check which fields were updated and show corresponding toast messages
        if (formData.name) {
          toast.success('Name updated successfully!');
        }
        if (formData.email) {
          toast.success('Email updated successfully!');
        }
        if (formData.oldPassword && formData.newPassword) {
          

            toast.success('Password updated successfully!');


            toast.error('logging out.....');

        
                setTimeout(()=>{

                    localStorage.removeItem('token');
                    localStorage.removeItem('id');
                    localStorage.removeItem('name');
                    localStorage.removeItem('das');
                    window.location.href = '/'; 

                },1500)

        } 
        
        localStorage.setItem('name', updatedDocument.name);
        localStorage.setItem('email', updatedDocument.email);
        
        // Clear the form fields
        setFormData({
          _id: localStorage.getItem('id'),
          name: '',
          email: '',
          oldPassword: '',
          newPassword: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Update failed!'; // Use backend error message if available
      toast.error(errorMessage);
    } finally {
      dispatch(toggleLoader());
    }
  };
  

  return (
    <div className={StyleSettingsForm.register}>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className={StyleSettingsForm.inputName}
            type="text"
            name="name"
            placeholder="         Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
       
        <br />
        <div>
          <input
            className={StyleSettingsForm.inputEmail}
            type="email"
            name="email"
            placeholder="         Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
       
        <br />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexWrap: 'nowrap' }}>
          <input
            className={StyleSettingsForm.inputPassword}
            type={showOldPassword ? 'text' : 'password'}
            name="oldPassword"
            placeholder="         Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
          />
          <img
            src={passEye}
            alt={showOldPassword ? 'Hide Password' : 'Show Password'}
            className={StyleSettingsForm.passwordIcon}
            onClick={handleToggleOldPassword}
            style={{ position: 'relative', left: '-40px' }}
          />
        </div>
       
        <br />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexWrap: 'nowrap' }}>
          <input
            className={StyleSettingsForm.inputPassword}
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            placeholder="         New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <img
            src={passEye}
            alt={showPassword ? 'Hide Password' : 'Show Password'}
            className={StyleSettingsForm.passwordIcon}
            onClick={handleTogglePassword}
            style={{ position: 'relative', left: '-40px' }}
          />
        </div>
       
        <br />
        <button type="submit" className={StyleSettingsForm.updateButton}>
          Update
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SettingsForm;
