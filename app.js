var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy=require("passport-local");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");
var commentRoutes=require("./routes/comments");
var	campgroundRoutes=require("./routes/campgrounds");
var	indexRoutes=require("./routes/index");
var methodOverride=require("method-override");
var flash=require("connect-flash");

mongoose.connect("mongodb+srv://rahul_prasad:qwerty@123@cluster0.ycyha.mongodb.net/YelpCamp?retryWrites=true&w=majority",{
	useNewUrlParser:true,
    useUnifiedTopology:true,
	useCreateIndex:true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:",err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
// seedDB();
app.use(flash());
//PASSPORT CONFIGURATION	
app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret:"Once again rahul is awesome",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);

app.listen(process.env.PORT || 3000, process.env.IP,function(){
	console.log("YELPCAMP SERVER IS LISTENING");
});