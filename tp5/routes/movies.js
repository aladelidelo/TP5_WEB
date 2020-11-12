var express = require("express");
var router = express.Router();
const axios = require("axios");

const fs = require("fs");
const fileName = "../db.json";
const db = require(fileName);

/* put movies from omdbapi*/
router.put("/", function (req, res, next) {
    axios.get("https://www.omdbapi.com/?apikey=4f50c181&t=" + req.body.name)
        .then(function (response) {
            if (response.data) {
                let obj = {}
                if (response.data.imdbID)
                    obj.id = response.data.imdbID;
                else
                    obj.id = "N/A";
                if (response.data.Title)
                    obj.movie = response.data.Title;
                else
                    obj.movie = "N/A";
                if (response.data.Year)
                    obj.yearOfRelease = response.data.Released;
                else
                    obj.yearOfRelease = "N/A";
                if (response.data.Runtime)
                    obj.duration = response.data.Runtime;
                else
                    obj.duration = "N/A";
                if (response.data.Actors)
                    obj.actors = response.data.Actors;
                else
                    obj.actors = "N/A";
                if (response.data.Poster)
                    obj.poster = response.data.Poster;
                else
                    obj.poster = "N/A";
                if (response.data.BoxOffice)
                    obj.boxOffice = response.data.BoxOffice;
                else
                    obj.boxOffice = "N/A";
                if ((response.data.Ratings) && (response.data.Ratings[1]) && (response.data.Ratings[1].Value)) 
                    obj.rottenTomatoesScore = response.data.Ratings[1].Value;
                else 
                    obj.rottenTomatoesScore = "N/A";
                db.push(obj);
                fs.writeFile("db.json", JSON.stringify(db), function writeJSON(err) { if (err) return console.log(err) });
                res.json({ status: "done" });
            }
        })
        .catch(function (error) {
            // handle error
            console.log("///// ERROR AXIOS !!! /////");
            console.log(error);
            res.send("error");
        });
});

// Get all movies
router.get("/", function (req, res, next) { res.json(db) });

// Get ONE movies
router.get("/:id", function (req, res, next) {
    const id = req.params.id;
    console.log("req.params.id: ", req.params.id);
    const obj = db.find((e) => e.id == id);
    res.json(obj)
});


// delete a movie by id
router.delete("/:id", function (req, res, next) {
    const id = req.params.id;
    const obj = db.find((e) => e.id == id);
    const index = db.indexOf(obj);
    if (index >= 0) db.splice(index, 1);
    fs.writeFile("db.json", JSON.stringify(db), function writeJSON(err) { if (err) return console.log(err) });
    res.json(db);
});

// post (edit) a movie by id
router.post("/:id", function (req, res, next) {
    const id = req.params.id;
    axios.get("https://www.omdbapi.com/?apikey=4f50c181&t=" + req.body.name)
        .then(function (response) {
            if (response.data && id) {
                const oldObj = db.find((e) => e.id == id);
                if (!oldObj) {
                    console.log("L'ID fournit n'existe pas !");
                    return;
                }
                const index = db.indexOf(oldObj);
                let obj = {};
                if (response.data.imdbID)
                    obj.id = response.data.imdbID;
                else
                    obj.id = "N/A";
                if (response.data.Title)
                    obj.movie = response.data.Title;
                else
                    obj.movie = "N/A";
                if (response.data.Year)
                    obj.yearOfRelease = response.data.Released;
                else
                    obj.yearOfRelease = "N/A";
                if (response.data.Runtime)
                    obj.duration = response.data.Runtime;
                else
                    obj.duration = "N/A";
                if (response.data.Actors)
                    obj.actors = response.data.Actors;
                else
                    obj.actors = "N/A";
                if (response.data.Poster)
                    obj.poster = response.data.Poster;
                else
                    obj.poster = "N/A";
                if (response.data.BoxOffice)
                    obj.boxOffice = response.data.BoxOffice;
                else
                    obj.boxOffice = "N/A";
                if ((response.data.Ratings) && (response.data.Ratings[1]) && (response.data.Ratings[1].Value))
                    obj.rottenTomatoesScore = response.data.Ratings[1].Value;
                else
                    obj.rottenTomatoesScore = "N/A";
                db[index] = obj;
                fs.writeFile("db.json", JSON.stringify(db), function writeJSON(err) { if (err) return console.log(err) });
                res.json(db);
            }
        })
        .catch(function (error) {
            // handle error
            console.log("///// ERROR AXIOS !!! /////");
            console.log(error);
            res.send("error");
        });
});

module.exports = router;