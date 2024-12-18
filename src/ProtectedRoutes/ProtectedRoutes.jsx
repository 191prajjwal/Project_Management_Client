import { Navigate } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';

const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = localStorage.getItem('das');

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 54000);

  useTimer({
    expiryTimestamp, onExpire: () => {
      localStorage.removeItem('das');
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('name');
      localStorage.removeItem("email")
      window.location.reload();
    }
  });

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace /> 
  );
};

export default ProtectedRoutes;
