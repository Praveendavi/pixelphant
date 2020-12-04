import React,{ useState, useEffect,useContext } from 'react'
import { UserContext } from '../App'
import { useParams } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';

const Profile = () => {
   
    const [userProfile,setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    console.log(userid)
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    // const [showfollow,setShowFollow] = useState(true)

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)
        })
     },[])   

     const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
        })
    }

    return (
        <>
        { userProfile ?
         <div className="profile_section">
          <div className="profile_wrapper">
              <div className="user_profile_container">
              <div className="background_img">
                 <img src={userProfile.user.cover} />
                 <div className="user_profile_img">
                      <img src={userProfile.user.pic} />
                  </div>
                  <div className="user_profile_info">
                      <div className="name">
                          <h6>{userProfile.user.name}</h6>
                          <h6>{userProfile.user.email}</h6>
                      </div>
                      <div className="user_connection">
                          <span><small className="count">{userProfile.posts.length}</small>Posts</span>
                          <span><small className="count">{userProfile.user.followers.length}</small>Followers</span>
                          <span><small className="count">{userProfile.user.following.length}</small>Following</span>
                         { showfollow ? <button onClick={() => followUser()}>follow</button> : <button onClick={() => unfollowUser()}>Unfollow</button>  } 
                      </div>

                  </div>
              </div>
                  
              </div>
              <div className="user_gallery">
              <div className="user_header">
                  <h4>Posts</h4>
              </div>
                    {
                        userProfile.posts.map(item=>{
                                return(
                                    <img key={item._id} src={item.photo} alt={item.title} />
                                )
                            })
                        }
                  </div>
          </div>
      </div>  
        :  <CircularProgress className="loading_icon" /> }

     
      </>
    )
}

export default Profile
