const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Theatre = require("../models/theatreModel");
const Show=require("../models/showModel");

//add theatre
router.post("/add-theatre",authMiddleware, async (req, res) => {
  try {
    const newTheatre = new Theatre(req.body);
    await newTheatre.save();
    res.send({
      success: true,
      message: "Theatre added successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all theatre  by owner
router.get("/get-all-theatres",authMiddleware, async (req, res) => {
  try {
    const theatres = await Theatre.find().sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Theatres fetched successfully",
      data: theatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
      
    });
  }
});


//update theatre
router.put("/update-theatre",authMiddleware, async (req, res) => {
  try {
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      req.body.theatreId,
      req.body,
      { new: true }
    );
    res.send({
      success: true,
      message: "Theatre updated successfully",
      data: updatedTheatre,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//delete theatre
router.post("/delete-theatre",authMiddleware, async (req, res) => {
  try {
    await Theatre.findByIdAndDelete(req.body.theatreId);
    res.send({
      success: true,
      message: "Theatre deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//add show 
router.post("/add-show",authMiddleware,async(req,res)=>{
  try{
    const newShow=new Show(req.body);
    await newShow.save();
    res.send({
      success:true,
      message:"Show added Successfully"
    });
  }catch(error){
    res.send({
      success:false,
      message:error.message
    })
  }
})

//get all shows by theatre
router.post("/get-all-shows-by-theatre",authMiddleware,async(req,res)=>{
  try{
    const shows=await Show.find({theatre:req.body.theatreId}).populate('movie').sort({createdAt:-1});
    res.send({
      success:true,
      message:"Show fetched Successfully",
      data:shows,
    });
  }catch(error){
    res.send({
      success:false,
      message:error.message
    })
  }
});

//update show
router.put("/update-show",authMiddleware,async(req,res)=>{
  try{
    const updatedShow = await Show.findByIdAndUpdate(
      req.body.showId,
      req.body,
      { new: true }
    );
    res.send({
      success:true,
      message:"show updated successfully",
      data: updatedShow,
    });
  }catch(error){
    res.send({
      success:false,
      message:error.message,
    });
  }
});

//delete Show
router.post("/delete-show",authMiddleware,async(req,res)=>{
  try{
    await Show.findByIdAndDelete(req.body.showId);
    res.send({
      success:true,
      message:"show deleted successfully",
    });
  }catch(error){
    res.send({
      success:false,
      message:error.message,
    })
  }
})

//get all unique theatres which have shows of a movie
router.post("/get-all-theatres-by-movie",authMiddleware,async(req,res)=>{
  try{
    const {movie,date}=req.body;
    //find all shows of a movie
    const shows=await Show.find({movie,date}).populate('theatre').sort({createdAt:-1});

    //get all unique theatres
    let uniqueTheatres=[];
    const theatreMap = new Map();
    
    shows.forEach((show)=>{
      const theatreId = show.theatre._id.toString();
      if(!theatreMap.has(theatreId)){
        theatreMap.set(theatreId, {
          ...show.theatre._doc,
          shows: [show]
        });
      } else {
        theatreMap.get(theatreId).shows.push(show);
      }
    });
    
    uniqueTheatres = Array.from(theatreMap.values());
    
    res.send({
      success:true,
      message:"Theatres fetched successfully",
      data:uniqueTheatres,
    });
  }catch(error){
    res.send({
      success:false,
      message:error.message,
    });
  }
});

// get all shows for a movie (without date filter)
router.post("/get-all-shows-by-movie",authMiddleware,async(req,res)=>{
  try{
    const {movie}=req.body;
    //find all shows of a movie without date filter
    const shows=await Show.find({movie}).populate('theatre').sort({createdAt:-1});

    //get all unique theatres
    let uniqueTheatres=[];
    const theatreMap = new Map();
    
    shows.forEach((show)=>{
      const theatreId = show.theatre._id.toString();
      if(!theatreMap.has(theatreId)){
        theatreMap.set(theatreId, {
          ...show.theatre._doc,
          shows: [show]
        });
      } else {
        theatreMap.get(theatreId).shows.push(show);
      }
    });
    
    uniqueTheatres = Array.from(theatreMap.values());
    
    res.send({
      success:true,
      message:"Shows fetched successfully",
      data:uniqueTheatres,
    });
  }catch(error){
    res.send({
      success:false,
      message:error.message,
    });
  }
});

// get show by id
router.post("/get-show-by-id",authMiddleware,async(req,res)=>{
  try{
    const show=await Show.findById(req.body.showId).populate("movie").populate("theatre");
    res.send({
      success:true,
      message:"show fetched successfully",
      data:show,
    });
  }catch(error){
    res.send({
      success:false,
      message:error.message,
    });
  }
});
module.exports = router;
