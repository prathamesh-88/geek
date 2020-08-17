const   express          = require("express"),
        mongo            = require("mongoose"),
        bodyParser       = require("body-parser"),
        methodOverride   = require("method-override"),
        expressSanitizer = require("express-sanitizer");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine","ejs");

mongo.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true});

var blogSchema = mongo.Schema({
    title : String,
    image : String,
    body  : String,
    added : {type: Date , default: Date.now}

});

var Blog = mongo.model("Blog",blogSchema);

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
    Blog.find({},(err,blogs)=>{
        if(err)
            console.log("oops");
        else{
            res.render("index",{blogs:blogs});
        }
    });    
});

app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

app.post("/blogs",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,blog)=>{
        if(!err){
            res.redirect("/blogs");
        }
        else
        {
             console.log("oops");
        }
           
    });
});

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err)
            res.redirect("/blogs");
        else
        {
            res.render("show",{blog:foundBlog});
        }
    });
});

app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id, (err,foundBlog) => {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit",{blog:foundBlog});
        }
    });

});

app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,blog)=>{
        if(err)
            console.log("Oops");
        else{
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndDelete(req.params.id,(err,stat)=>{
        res.redirect("/blogs");
    })
})


app.listen(3000,()=>{
    console.log("listening.......");
});