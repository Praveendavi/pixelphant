import React,{useState, useContext} from 'react'
import { useHistory, Link } from 'react-router-dom'
import { UserContext } from '../App'
import './Signin.css'
import M from 'materialize-css'
import Logo from '../images/logo.png'

const Signin = () =>{
const {state,dispatch} = useContext(UserContext)
  let history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
        return
    }
    fetch("/signin",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            password,
            email
        })
    }).then(res=>res.json())
    .then(data=>{
        // console.log(data)
       if(data.error){
          M.toast({html: data.error,classes:"#c62828 red darken-3"})
          // console.log(data.error)
       }
       else{
           localStorage.setItem("jwt",data.token)
           localStorage.setItem("user",JSON.stringify(data.user))
           dispatch({type:"USER",payload:data.user})
          //  console.log(data)
           M.toast({html:"signin success",classes:"#43a047 green darken-1"})
           history.push('/')
       }
    }).catch(err=>{
        console.log(err)
    })
}

  return(
    <div className="signin_section">
      <div className="signin_wrapper">
        <div className="signin_container_block">
        <div className="right_menu">
              <div className="banner_block">
                <div className="overlay"></div>
                <h6>Welcome to pixelphant</h6>
              </div>
            </div>
            <div className="left_menu">
            <div className="signin_header">
            <div className="logo">
                <img src={Logo} />
            </div><br /> <br />  <br />
              <h4>Sign in </h4>
              <p>Sign in to continue our application</p>
            </div>
            <input type="email"  value={email} placeholder="Enter your email address" onChange={(e) => setEmail(e.target.value)} />
            <input type="password"  value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}  />
            <button className="signin_btn" onClick={()=> PostData()}>Signin</button>
            <div className="switch_link">
              <Link className="fogot_password" to="/forgot-password">Forget Password?</Link>
              <span>Don't have a account<Link className="signup_link" to="/signup">Signup</Link></span>
             
            </div>
            </div>
           
        </div>
    </div>
    </div>
  )
}

export default Signin
