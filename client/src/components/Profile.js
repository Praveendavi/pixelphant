import React,{ useState, useEffect,useContext } from 'react'
import './Profile.css'
import { UserContext } from '../App'
import Button from '@material-ui/core/Button';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CreatePost from './CreatePost'


const Profile = () => {
 
    const [ mypics, setPics ] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    const [background, setBackground] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() =>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result=>{
             console.log(result)
            setPics(result.mypost)
        })
    },[])    

    useEffect(() =>{
        if(background){
            const data = new FormData()
            data.append('file',background)
            data.append('upload_preset','pixelphant_social_media')
            data.append('cloud_name','grow-more')
            fetch('https://api.cloudinary.com/v1_1/grow-more/image/upload',{
                method:'post',
                body:data
            }).then(res=>res.json())
            .then(data=>{
                fetch('/updatecover',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        cover:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,cover:result.cover}))
                    dispatch({type:"UPDATECOVER",payload:result.cover})
                 //    window.location.reload()
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[background])

    useEffect(() =>{
        if(image){
            const data = new FormData()
            data.append('file',image)
            data.append('upload_preset','pixelphant_social_media')
            data.append('cloud_name','grow-more')
            fetch('https://api.cloudinary.com/v1_1/grow-more/image/upload',{
                method:'post',
                body:data
            }).then(res=>res.json())
            .then(data=>{
               fetch('/updatepic',{
                   method:"put",
                   headers:{
                       "Content-Type":"application/json",
                       "Authorization":"Bearer "+localStorage.getItem("jwt")
                   },
                   body:JSON.stringify({
                       pic:data.url
                   })
               }).then(res=>res.json())
               .then(result=>{
                   console.log(result)
                   localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                   dispatch({type:"UPDATEPIC",payload:result.pic})
                //    window.location.reload()
               })
           
            })
            .catch(err=>{
                console.log(err)
            })
           }
        },[image])
        const updatePhoto = (file)=>{
            setImage(file)
        }
        const uploadCoverImg = (file) =>{
            setBackground(file)
        }

    return (
      <div className="profile_section">
          <div className="profile_wrapper">
              <div className="user_profile_container">
              <div className="cover_img">
                <img src={state?state.cover:"loading"} />
                <div className="change_cover">
                    <input type="file" id="cover" onChange={(e)=>uploadCoverImg(e.target.files[0])} />
                    <label for="cover" className="cover_img_btn">
                        <PhotoCamera /> Add Cover Photo
                    </label>
                </div>
                <div className="user_profile_info">
                    <div className="user_profile_img">
                        <img src={state?state.pic:"loading"} />
                        <div className="change_profile">
                            <input type="file" id="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                            <label for="file"><PhotoCamera /> </label>
                        </div>
                    </div>
                        <div className="name">
                            <h6>{state?state.name:'loading'}</h6>
                        </div>
                        <div className="user_connection">
                            <span><small className="count">{mypics.length}</small>Posts</span>
                            <span><small className="count">{state?state.followers.length:"0"}</small>Followers</span>
                            <span><small className="count">{state?state.following.length:"0"}</small>Following</span>
                        </div>
                  </div>
                </div>
              </div>
              <div className="create_img_wrapper">
                  <CreatePost />
              </div>
              <div className="user_gallery">
              <div className="user_header">
                  <h4>Posts</h4>
              </div>
              <div className="gallery_wrapper">
                        {
                            mypics.map(item=>{
                                return(
                                    <img key={item._id} src={item.photo} alt={item.title} />
                                )
                            })
                        }
              </div>
                </div>
          </div>
      </div>
        
    )
}

export default Profile
