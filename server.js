// Require dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = requir("path");

// API route logic
const user = require("./routes/api/user");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// Sets a port for our app to listen on
// either PORT set by enviornmental variables
// OR 8080 for localhost
const PORT = process.env.PORT || 8080;

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Passport middleware
app.use(passport.initialize());

// Pass the 'passport' node_module as
// an arg into the passport config file
require("./config/passport")(passport);

// Use the following API endpoints
// passing in the route config
app.use("/api/users", user);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static foolder
  app.use(express.static("client/build"));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start our server and listen on the designated PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
