const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3030;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true,
useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false});

//routes

app.get("/", (req,res) => {
res.sendFile(path.join(__dirname, '/public/index.html'));

});

app.get("/exercise", (req,res) => {
  res.sendFile(path.join(__dirname, '/public/exercise.html'));
  });

  app.get("/stats", (req,res) => {
    res.sendFile(path.join(__dirname, '/public/stats.html'));
    });

//db calls and updates

app.get("/api/workouts", (req, res) => {
  db.workout.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/workouts", ({ body }, res) => {
  db.workout.create(body)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});


app.put("/api/workouts/:id", ({body, params}, res) => {
  db.workout.findByIdAndUpdate(params.id,{$push: {exercises: body}
  },{new: true, runValidators: true})
    .then(data=> {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
