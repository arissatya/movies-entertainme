if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const uri = process.env.DB_ATLAS;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("MOVIES SERVER CONNECT " + PORT);
});

client.connect((err) => {
  const collection = client.db("movies").collection("movie");

  app.get("/", (req, res) => {
    collection.find({}).toArray(function (err, movie) {
      if (err) console.error(err);
      res.status(200).json(movie);
    });
  });

  app.post("/", (req, res) => {
    collection
      .insertOne({
        title: req.body.title,
        overview: req.body.overview,
        poster_path: req.body.poster_path,
        popularity: req.body.popularity,
        tags: req.body.tags,
      })
      .then(({ ops }) => {
        res.status(201).json(ops[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/:movieId", (req, res) => {
    const movieId = req.params.movieId;
    collection
      .findOne({ _id: ObjectId(movieId) })
      .then((movie) => {
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.put("/:movieId", (req, res) => {
    const movieId = req.params.movieId;
    collection
      .updateOne(
        { _id: ObjectId(movieId) },
        {
          $set: {
            title: req.body.title,
            overview: req.body.overview,
            poster_path: req.body.poster_path,
            popularity: req.body.popularity,
            tags: req.body.tags,
          },
        }
      )
      .then(({ result }) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.delete("/:movieId", (req, res) => {
    const movieId = req.params.movieId;
    collection
      .deleteOne({ _id: ObjectId(movieId) })
      .then(({ result }) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
