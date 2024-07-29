import '../styles/login.css'
import axios from 'axios'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "./userProvider";
import { useContext } from "react";

export function Login() {
    const navigate = useNavigate();
    const {UserAlreadyExist, setUserAlreadyExist} = useContext(UserContext);

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [show , setShow] = useState(false);
    
 

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(email === "" || password === ""){
            return alert('all fields are required')
        }

       const data = {
             email : email,
             password : password
        }


        try {

            const response = await axios.post("http://localhost:8000/api/users/login" , data , {withCredentials : true});
            console.log(response.data.data);


            const userExist = await axios.get('http://localhost:8000/api/chat', { withCredentials: true });
            if (userExist.data.statusCode === 200) {
                setUserAlreadyExist(true);
            }
            navigate('/chat');


        }catch(err) {
            console.log("error in submitting login form : " , err.response.data)
            alert("Incorrect Email or Password ");   // modal
        }


    }


    return (

        <div style ={{
            marginTop: "5em",
            paddingBottom: "3em",
            marginLeft : "30%",
            border : "2px solid gray",
            width : "600px",
            textAlign: "center",
            boxShadow: "6px 8px 5px gray"
        }}>

            <h1>Login</h1>

        <form>
            <label htmlFor="email"> Enter your Email</label>
            <input type="email" id="email" onChange = {(e) => setemail(e.target.value)}/>

            <br/>


            <label htmlFor="password" > Enter your Password</label>
            <input type={show ? "text" : "password"} id="password"  onChange = {(e) => setpassword(e.target.value)}/>

            <br />

            <label htmlFor="showPassword" >show Password</label>
            <input type="checkbox" id="showPassword" onChange = {(e) => setShow(e.target.checked)}/>

           <br/>
            <button type="submit" onClick = {handleSubmit}>Login </button>
        </form>

        <Link to='/register'>Doesn't have an account?</Link>

        </div>
    )
}

    
  