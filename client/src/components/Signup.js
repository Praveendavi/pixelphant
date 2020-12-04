import React,{useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './Signup.css'
import M from 'materialize-css'
import Logo from '../images/logo.png'

const Signup = () =>{

  let history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState("")
  const [background, setBackground] = useState("")
  const [url, setUrl] = useState(undefined)

  useEffect(() =>{
      if(url){
        uploadFields()
      }
  },[url])


  const uploadCoverPhoto = () =>{
    const data = new FormData()
    data.append('file',background)
    data.append('upload_preset','pixelphant_social_media')
    data.append('cloud_name','grow-more')
    fetch('https://api.cloudinary.com/v1_1/grow-more/image/upload',{
        method:'post',
        body:data
    }).then(res=>res.json())
    .then(data=>{
       setUrl(data.url)
    })
    .catch(err=>{
        console.log(err)
    })
  }

  const uploadProfile = () =>{
    const data = new FormData()
    data.append('file',image)
    data.append('upload_preset','pixelphant_social_media')
    data.append('cloud_name','grow-more')
    fetch('https://api.cloudinary.com/v1_1/grow-more/image/upload',{
        method:'post',
        body:data
    }).then(res=>res.json())
    .then(data=>{
       setUrl(data.url)
    })
    .catch(err=>{
        console.log(err)
    })
  }
  const uploadFields = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
      return
  }
    fetch('/signup',{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      
      body:JSON.stringify({
        name,
        email,
        password,
        pic:url,
        cover:url
      })
    }).then(res=>res.json())
    
    .then(data=>{
     if(data.error){
        M.toast({ html: data.error, classes:'#c62828 red darken-3 ' })
     }else{
       M.toast({ html: data.message, classes: '#43a047 green darken-3' })
       history.push('/signin')
     }
    }).catch(err=>{
      console.log(err)
    })
  }
  const PostData = () =>{
    if(image,background){
      uploadProfile()
      uploadCoverPhoto()
    }else{
      uploadFields()
    }
  }


  return(
    <div className="signup_section">
      <div className="signup_wrapper">
        <div className="signup_container_block">
            <div className="left_menu">
            <div className="signup_header">
            <div className="logo">
                <img src={Logo} />
            </div><br /> <br />  <br />
              <h4>SignUp </h4>
              <p>Signup to continue with our application</p>
            </div>
            <input type="text"  value={name} placeholder="Enter your name" onChange={(e) => setName(e.target.value)}  />
            <input type="email"  value={email} placeholder="Enter your email address" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}  />
            {/* <input type="file" id="file"  onChange={(e)=>setImage(e.target.files[0])} />
              <label for="file">Photo</label>
            <input type="file" id="file" onChange={(e)=>setBackground(e.target.files[0])} />
              <label for="file">Background</label> */}
            <button className="signup_btn" onClick={()=> PostData()}>Signup</button>
            <div className="switch_link">
              <span>Already have a account<Link className="signup_link" to="/signin">Signin</Link></span>
            </div>
            </div>
            <div className="right_menu">
              <div className="banner_block">
                <div className="overlay"></div>
                <h6>Welcome to pixelphant</h6>
              </div>
            </div>
           
        </div>
    </div>
    </div>
  )
}

export default Signup
