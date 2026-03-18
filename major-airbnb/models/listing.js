const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: Object,
        properties: {
            url: String,
            filename: String
        },
         default: {
            url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
            filename: "default-image"
         },
         set: (v) => v === "" || v === undefined ? {
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
            filename: "default-image"
         } : v,
},
    price: Number,
    location: String,
    country: String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    },
],
owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
},
geometry:{
    type: {
        type: String,
        enum: ['Point'],   //loctation.type must be a point
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
},
category:{
    type: String,
    enum: ["mountains","arctic","farms","deserts","camp","rooms","iconic-cities","castles","pools","dome","boats"],
    required : true
},
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;