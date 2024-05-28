const ProductModel = require('../Models/ProductModel');
const { v4: uuidv4 } = require('uuid');
const createProduct = async (req, res) => {
  //1st method
  // const newProduct = new ProductModel(req.body)
  // try{
  //     await newProduct.save()
  //     res.status(200).json({
  //         status: 'Success',
  //         data : {
  //             message : "Product Created Successfully"
  //         }
  //     })
  // }catch(err){
  //     res.status(500).json({
  //         status: 'Failed',
  //         message : err
  //     })
  // }
  //2nd method
  const { name, price, rating, company } = req.body;
  ProductModel.create({
    name,
    price,
    rating,
    company,
    userId: req.user.id,
    userName : req.user.name,
    userEmail: req.user.email,
  })
    .then((product) =>
      res.status(200).json({
        message: 'Product Created Successfully!',
        status: 'success',
        data: product,
      })
    )
    .catch((error) => res.json(error));
};

const getAllProduct = async (req, res) => {
  let userId = req.user.id;
  ProductModel.find({ userId })
    .then((product) =>
      res.status(200).json({
        message: 'Products retrieve Successfully!',
        status: 'success',
        data: product,
      })
    )
    .catch((error) => res.json(error));
};

const getOtherUserProducts = async (req, res) => {
  ProductModel.find({})
    .then((product) =>
      res.status(200).json({
        message: 'Products retrieve Successfully!',
        status: 'success',
        data: product,
      })
    )
    .catch((error) => res.json(error));
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  ProductModel.findById(id)
    .then((product) =>
      res.status(200).json({
        message: 'Product retrieve Successfully!',
        status: 'success',
        data: product,
      })
    )
    .catch((error) => res.json(error));
};

const UpdateProductById = async (req, res) => {
  const id = req.params.id;
  ProductModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      price: req.body.price,
      rating: req.body.rating,
      company: req.body.company,
    },
    { new: true }
  )
    .then((updateProduct) =>
      res.status(200).json({
        message: 'Product updated Successfully!',
        status: 'success',
        data: updateProduct,
      })
    )
    .catch((error) => res.json(error));
};

const DeleteProductById = async (req, res) => {
  const id = req.params.id;
  ProductModel.findByIdAndDelete(id)
    .then(() =>
      res.status(200).json({
        message: 'Product deleted Successfully!',
        status: 'success',
      })
    )
    .catch((error) => res.json(error));
};

const getProductByPrice = async (req, res) => {
  const minPrice = req.body.minPrice;
  const maxPrice = req.body.maxPrice;
  let query = ProductModel.find();

  if (minPrice !== undefined) {
    query = query.where('price').gte(minPrice);
  }

  if (maxPrice !== undefined) {
    query = query.where('price').lte(maxPrice);
  }

  query.exec((err, products) => {
    if (err) {
      return res
        .status(500)
        .json({ message: err.message, status: 'error', data: null });
    }
    res.status(200).json({
      message: 'Products filtered successfully!',
      status: 'success',
      data: products,
    });
  });
};

const CommentOnPost = async (req, res) => {
  const { id, comment } = req.body;
  if (!id) {
    res
      .status(400)
      .json({ status: false, message: 'Product id is required' });
  } else if (!comment) {
    res
      .status(400)
      .json({ status: false, message: 'Comment is required' });
  }

  try {
    let product = await ProductModel.findOne({ _id: id });
    if (product) {
      product.comments.push({
        name: req.user.name,
        userId: req.user.id,
        comment,
        commentId: uuidv4(), 
      });
      await product.save();
      return res.status(200).json({
        status: true,
        message: 'Comment added successfully',
        data: product,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: 'There is no product against this id',
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: 'Internal server error' });
  }
};

const DeleteComment = async (req, res) => {
  const { id, commentId } = req.body;
  if (!id) {
    res
      .status(400)
      .json({ status: false, message: 'Product id is required' });
  } 
  else if (!commentId) {
    res
      .status(400)
      .json({ status: false, message: 'Comment Id is required' });
  }

  try {
    let product = await ProductModel.findOne({ _id: id });
    if (product) {
      let findProduct=false
      product.comments.forEach((item)=>{
        if(item.comment==commentId){
          findProduct=true
        }
      })
      if(!findProduct){
      res.status(400).json({success:false,message:"No comment found agains this id"})
      }
      let updateComments= product.comments.filter((item)=>item.commentId!=commentId)
      product.comments=updateComments
      await product.save();
      return res.status(200).json({
        status: true,
        message: 'Comment deleted successfully',
        data: product,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: 'There is no comment against this id',
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  UpdateProductById,
  DeleteProductById,
  getProductById,
  getProductByPrice,
  CommentOnPost,
  DeleteComment,
  getOtherUserProducts
};
