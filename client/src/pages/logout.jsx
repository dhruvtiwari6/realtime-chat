import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true });
        if(response.data.message === "User logged out successfully"){
            navigate('/login');
        }

        // console.log("response.data.message : ", response.data.message);
        // // Navigate to the login page or homepage after successful logout
        navigate('/login');
      } catch (error) {
        console.log("Error in logging out: ", error);
      }
    };

    logoutUser();
  }, []);

  return (
    <h1>Logged out</h1>
  );
}
