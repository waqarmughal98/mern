
const Image = require("../Models/ImagesModel");

const uploadImage=async(req,res)=>{
    const imageName = req.file.filename;
  
    try {
       Image.create({ image: imageName });
      res.status(201).json({ status: true, message:"Image Uploaded Successfully!" });
    } catch (error) {
      res.status(400).json({ status: error });
    }


}

const getImages = async(req,res) =>{
   Image.find({}).then((imgs)=>{
    return  res.status(201).json({ status: true, message:"Image retreived Successfully!" ,data:imgs });
   }).then(()=>{
    return  res.status(201).json({ status: true, message:"Somethignwent wrong!" });
   })

}

module.exports = {uploadImage , getImages}