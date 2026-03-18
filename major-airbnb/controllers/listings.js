const Listing = require("../models/listing.js");
const maptilerclient = require("@maptiler/client");
const mapApiKey = process.env.MAP_API_KEY;
maptilerclient.config.apiKey = mapApiKey;



module.exports.index = async (req,res)=>{
    const {search, category} = req.query;
    let filter = {};
    if(search){
        filter.$or = [
                {title: {$regex:search,$options:"i"}},
                {location: {$regex:search,$options:"i"}},
                {country: {$regex:search,$options:"i"}},
                {category: {$regex:search,$options:"i"}},
            ];
        }
        if(category){
        filter.category = category;
    }
    const allListings = await Listing.find(filter);
        res.render("listings/index.ejs", {allListings});
    };

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.showListing = (async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing, mapApiKey:process.env.MAP_API_KEY});
});

module.exports.createListing = (async (req,res,next)=>{
    let response = await maptilerclient.geocoding
    .forward(req.body.listing.location,{
        limit: 1,
    });
    let url = req.file.path;
    let filename = req.file.filename;
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image= {url, filename};
    newListing.geometry= response.features[0].geometry
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing created successfully!");
    res.redirect("/listings");
});

module.exports.renderEditForm = (async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300,h_200,c_fill");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
});

module.exports.updateListing = (async (req,res)=>{
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","You don't have permission edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success","Listing Updated Succesfully");
    res.redirect(`/listings/${id}`);
});


module.exports.deleteListing = (async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing Deleted Succesfully")
    res.redirect("/listings");
});