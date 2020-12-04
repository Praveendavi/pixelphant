import React,{ useState, useEffect,useContext } from 'react'
import { UserContext } from '../App'
import './Home.css'
import Button from '@material-ui/core/Button';
import { AiOutlineLike, AiTwotoneLike, AiOutlineDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom'

const Home = () => {
    
      const [ data, setData ] = useState([])
      const {state,dispatch} = useContext(UserContext)
      useEffect(()=>{
          fetch('/getsubpost',{
              headers:{
                  "Authorization":"Bearer "+localStorage.getItem('jwt')
              }
          }).then(res=> res.json())
          .then(result=>{
              console.log(result)
            setData(result.posts)
          })
      },[])

      const likePost = (id) =>{
          fetch('/like',{
              method:'put',
              headers:{
                  'Content-Type':'application/json',
                  "Authorization":'Bearer '+localStorage.getItem('jwt')
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=> res.json())
          .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
      }
      const dislikePost = (id) =>{
        fetch('/dislike',{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                "Authorization":'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=> res.json())
        .then(result=>{
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }

  const deletePost = (postid)=>{
    fetch(`/deletepost/${postid}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
    })
}

    return (
        <div className="home_section">
            <div className="home_wrapper">
                {
                    data.map(item=>{
                        return(
                            <div className="card_wrapper">
                            <div className="card_header_info"  key={item._id}>
                                <h4><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  } >{item.postedBy.name}</Link><AiOutlineDelete onClick={()=>deletePost(item._id)} style={{float: 'right' }} /></h4>
                            </div>
                            <div className="card_body">
                                <img src={item.photo} />
                                    <div className="post_btns_info">
                                        {item.likes.includes(state._id)
                                        ?
                                        <Button variant="contained" color="default" className="like_btn" ><AiTwotoneLike className="dislike_icon"  onClick={() => {dislikePost(item._id)}} /></Button>
                                        : <Button variant="contained" color="default" className="like_btn"><AiOutlineLike  className="like_icon" onClick={() => {likePost(item._id)}} /></Button> }
                                    </div>
                                <p >{item.likes.length} Likes</p>
                                <div className="post_text_info">
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    {
                                    item.comments.map(record=>{
                                        return(
                                        <p className="comments" key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</p>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                  <input type="text" placeholder="Write a comment here....." />  
                                </form>
                                    
                                </div>
                            </div>
                        </div>
                        )
                       
                    })
                }
            </div>
        </div>
    )
}

export default Home


