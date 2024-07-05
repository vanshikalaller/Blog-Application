require("dotenv").config();

const path = require("path")
const express = require("express");
const mongoose= require("mongoose");
const cookieParser= require("cookie-parser");

const Blog= require("./models/blog");

const userRoutes= require("./routes/user");
const blogRoute= require("./routes/blog");

const exp = require("constants");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT= process.env.PORT;

mongoose
.connect(process.env.MONGO_URL)
.then((e) => console.log("MongoDb connexted"));

app.set("view engine","ejs")
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))



app.get('/',async(req,res)=>{
    const allBlogs= await Blog.find({}); 
    
    res.render("home",{
        user :req.user,
        blogs :allBlogs,
    });
});
app.use("/user",userRoutes);
app.use("/blog",blogRoute);




app.listen(PORT , ()=> console.log(`Server Started at PORT ${PORT}`))
