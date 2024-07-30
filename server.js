import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
var user=false;
const app=express();
const port=3000;

app.use(express.static("public"));
const URL="http://localhost:4000";

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
function userIsAuthorised(email,password){
  if(email=="harshitamangal2403@gmail.com" && password=="harshu@24")
  {
    return true;
  }
  else
  {
    return false;
  }
}
app.get("/",(req,res)=>{
   res.render("login.ejs");
});

app.post("/home",(req,res)=>{
  user=userIsAuthorised(req.body.email,req.body.password);
  if(user)
  {
    res.render("home.ejs");
  }
  else
  {
    res.redirect("/");
  }
});

app.get("/myBlog",async(req,res)=>{
  try {
    const result=await axios.get(`${URL}/posts`);
    res.render("myBlog.ejs",{posts:result.data,});
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.get("/about",(req,res)=>{
  res.render("about.ejs");
});

app.get("/home",(req,res)=>{
  res.render("home.ejs");
});
app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});
app.get("/login",(req,res)=>{
  res.redirect("/");
  user=false;
});
app.get("/new",(req,res)=>{
  res.render("new.ejs",{heading:"New Post",submit:"Create Post"});
});

app.get("/edit/:id",async(req,res)=>{
    try {
        const result=await axios.get(`${URL}/posts/${req.params.id}`)
        res.render("modify.ejs",{heading:"Edit Post",submit:"Update Post",post:result.data,});
    } catch (error) {
        res.status(500).json({ message: "Error fetching post" });
    }
});

app.post("/api/posts",async(req,res)=>{
    try {
        const result=await axios.post(`${URL}/posts`, req.body);
        res.redirect("/myBlog");
    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
});
app.post("/api/posts/:id",async(req,res)=>{
  try {
    const result=await axios.patch(`${URL}/posts/${req.params.id}`, req.body);
    res.redirect("/myBlog");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
    }
  });
app.get("/api/posts/delete/:id",async(req,res)=>{
    try{
        const result=await axios.delete(`${URL}/posts/${req.params.id}`);
        res.redirect("/myBlog");
    }
    catch(error){
        res.status(500).json({ message: "Error deleting post" });
    }
});
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
  });