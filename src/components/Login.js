import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = (props) => {
    const {ShowAlert} = props
    const navigate = useNavigate();
    const [details, setdetails] = useState({"email":"","password" : ""})
    const handdleSubmit =  (e) => {
        console.log(details.email,details.password)
        e.preventDefault()
         fetch('http://localhost:5000/login', {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({"Email" : details.email,"Password" : details.password})
      }) 
      .then(response => response.json())
      .then((json) => {
        if(json.authToken){
            console.log(json)
            localStorage.setItem('token', json.authToken)
            ShowAlert(`Welcome ${json.name}`,'success')
            navigate('/')
        }
        else{
          ShowAlert('Invalid Credentials...','danger')
          console.log('Undefined title or description')
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
    const onChange = (e)=>{
        setdetails({...details ,[e.target.name] : e.target.value} )
     }
  return (
    <div>
      <form onSubmit={handdleSubmit}>
        <div className="form-group">
          <label htmlfor="email">Email address</label>
          <input
            onChange={onChange}
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlfor="password">Password</label>
          <input
            onChange={onChange}
            type="password"
            name="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
