const router=require('express').Router();
const Movie=require("../models/moiveModel");
const authMiddleware=require('../middlewares/authMiddleware');
const { message } = require('antd');

//add a new movie
router.post('/add-movie',authMiddleware,async(req,res)=>{

    try{
        const newMovie=new Movie(req.body);



        await newMovie.save();
        res.send({
            success:true,
            message:"Movie added successfully",
        })
    }catch(error){
        res.send({
            success:false,
            message:error.message
        })
    }
});

//get all movies
router.get('/get-all-movies',authMiddleware,async(req,res)=>{
    try{
        const movies=await Movie.find().sort({createdAt:-1});
        res.send({
            success:true,
            message:"movies fetched succesfully",
            data:movies
        })
    }
    catch(error){
        res.send({
            success:false,
            message:error.message,
        })
    }
});

//update a movie
router.post('/update-movie',authMiddleware,async(req,res)=>{
    try{
        await Movie.findByIdAndUpdate(req.body.movieId,req.body);
        res.send({
            success:true,
            message:"Movie updated successfully",
        });
    }catch(error){
        res.send({
            success:false,
            message:error.message,
        })
    }
})

//delete a movie
router.post('/delete-movie',authMiddleware,async(req,res)=>{
    try{
        await Movie.findByIdAndDelete(req.body.movieId);
        res.send({
            success:true,
            message:"movie deleted successfully",
        });
    }catch(error){
        res.send({
            success:false,
            message:error.message,
        })
    }
})

//get a movie by id
router.get("/get-movie-by-id/:id",async(req,res)=>{
    try{
        const movie=await Movie.findById(req.params.id);
        res.send({
            success:true,
            message:"movie fetched succesfully",
            data:movie,
        });
    }catch(error){
        res.send({
            success:false,
            message:error.message,
        });
    }
});



module.exports=router;

