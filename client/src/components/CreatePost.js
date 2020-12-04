import React,{ useState, useEffect } from 'react'
import './CreatePost.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { GrFormAdd } from 'react-icons/gr'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


const  CreatePost = () =>{

    let history = useHistory()
    const [ body, setBody ] = useState('')
    const [ image, setImage ] = useState('')
    const [url, setUrl] = useState('')
    const [ selectedImage, setSelectedImage ] = useState([])

    const imageChange = (e) =>{
       if(e.target.files){
           const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
           console.log(fileArray)
           setSelectedImage((prevImages)=>prevImages.concat(fileArray))
           Array.from(e.target.files).map(
               (file)=>URL.revokeObjectURL(file)
           )}
    }

    const renderImage = (source) =>{
        return source.map((photo)=>{
            return <img src={photo} key={photo} />
        })
    }

    const changeImages = (e) =>{
        setImage(e.target.files[0])
        imageChange(e)
    }

    useEffect(() =>{
        if(url){
        fetch('/createpost',{
            method:'post',
            headers:{
              "Content-Type":"application/json",
              "Authorization":'Bearer ' + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
            //  title,
             body,
             pic:url
            })
          }).then(res=>res.json())
          .then(data=>{
      
             if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
             }
             else{
                 M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
                 history.push('/')
             }
          }).catch(err=>{
              console.log(err)
          })
      }
      },[url])
 
    const postDetails = () =>{
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

 
    return(
        <div className="createpost_section">
        <div className="cratepost_wrapper">
        <div className="create_post">
            <h4>Create Post</h4>
        </div>
                <div className="post_block">
                  <div className="add_photo">
                      <div className="add_photo_block">
                        <div className="add_photo_card">
                        <div className="img_block" >{renderImage(selectedImage)}
                        <input type="file" id="images"  onChange={(e) => changeImages(e)}    />
                        <label htmlFor="images"><span><small className="btn-floating btn-large waves-effect waves-light"><GrFormAdd /></small>Add Photo</span></label>
                        </div>
                        </div>
                      </div>
                  </div>
                  <div className="add_content">
                      <TextareaAutosize rows="4"  aria-label="textarea" value={body} onChange={(e) => setBody(e.target.value) } placeholder="Let the world know what you're thinking" />;
                      <button  className="post_btn" onClick={() => postDetails()}>Post</button>
                  </div>
                </div>
        </div>
        </div>
    )

}
export default CreatePost