import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const navigate = useNavigate();
  const [details, setdetails] = useState({name:"",email:"",password: ""})
  const handdleSubmit =  (e) => {
    console.log(details.email,details.password)
    e.preventDefault()
     fetch('http://localhost:5000/create_users', {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({"Name":details.name,"Email" : details.email,"Password" : details.password})
  }) 
  .then(response => response.json())
  .then((json) => {
    if(json.authToken){
        console.log(json)
        localStorage.setItem('token', json.authToken)
        props.ShowAlert('Acoout created successfully you can now login ','success')
        navigate('/login')
    }
    else{
      if(json.errors){
        props.ShowAlert('Email already exists','danger')
      }
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
    <div className="container">
        <form onSubmit={handdleSubmit}>  
          <div className="form-group">
            <label for="name">User Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter name"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label for="email">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter email"
              onChange={onChange}
              required

            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
              required
              minLength={5}
            />
          </div>
          <div className="form-group">
            <label for="cpassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="cpassword"
              id="cpassword"
              placeholder="Password"
              onChange={onChange}
              required
              minLength={5}
            />
          </div>
          <button type="submit" className="btn btn-light">
            Submit
          </button>
        </form>
    </div>
  );
};

export default Signup;
