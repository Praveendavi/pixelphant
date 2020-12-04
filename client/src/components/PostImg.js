import React, { useState } from "react";

const PostImg = () => {

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
    return(
        <div>
            <input type="file" multiple id="images" onChange={imageChange} />
            { renderImage(selectedImage) }
            <label htmlFor="images">add </label>
            
        </div>
    )

}

export default PostImg; 