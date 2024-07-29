import '../styles/login.css'
import axios from 'axios'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./userProvider";
import { useContext } from "react";


export function Register() {
    const navigate = useNavigate();
    const {UserAlreadyExist, setUserAlreadyExist} = useContext(UserContext);


    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [name , setname] = useState("");
    const [show , setShow] = useState(false);
    
 

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(email === "" || password === ""  || name ===""){
            return alert('all fields are required')
        }

       const data = {
             name: name,
             email : email,
             password : password
        }

        const sendEmail = {
            email : email,
            password : password
       }


        try {

            const response = await axios.post("http://localhost:8000/api/users/register" , data);
            console.log(response);

            const res= await axios.post("http://localhost:8000/api/users/login" , data , {withCredentials : true});
            console.log(res.data.data);


            const userExist = await axios.get('http://localhost:8000/api/chat', { withCredentials: true });
            if (userExist.data.statusCode === 200) {
                setUserAlreadyExist(true);
            }
            navigate('/chat');


        }catch(err) {
            console.log("error in submitting Registeration form : " , err.response.data)
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

            <h1> Register </h1>

        <form>

            <label htmlFor="username"> Enter your Username</label>
            <input type="text" id="username" onChange = {(e) => setname(e.target.value)}/>

            <br/>
            <label htmlFor="email"> Enter your Email</label>
            <input type="email" id="email" onChange = {(e) => setemail(e.target.value)}/>

            <br/>


            <label htmlFor="password" > Enter your Password</label>
            <input type={show ? "text" : "password"} id="password"  onChange = {(e) => setpassword(e.target.value)}/>

            <br />

            <label htmlFor="showPassword" >show Password</label>
            <input type="checkbox" id="showPassword" onChange = {(e) => setShow(e.target.checked)}/>

           <br/>
            <button type="submit" onClick = {handleSubmit}>Sign Up </button>
        </form>

        <Link to='/login'>Already  have an account?</Link>

        </div>
    )
}

    
  