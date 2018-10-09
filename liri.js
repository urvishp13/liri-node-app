// import modules and packages
const request = require("request");
const Spotify = require("node-spotify-api");
const moment = require("moment");
var fs = require("fs");

// turn on dotenv to load up environment variables from .env file
require("dotenv").config();

const spotifyKeys = require("./keys.js");

// turn on new spotify app
const spotify = new Spotify(spotifyKeys.spotify);

function concertThis(artist) {
  request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
    // If the request was successful...
    if (!error && response.statusCode === 200) {
      for (var i = 0; i < JSON.parse(body).length; i++) {
        // Store venue information into a variable
        var venue = JSON.parse(body)[i].venue;
        // store the date of the concert
        var date = JSON.parse(body)[i].datetime;
        // date converted using moment
        var date = moment(date).format('MM/DD/YYYY');

        // get name of venue
        var nameOfVenue = venue.name;
        // get city venue is in
        var venueCity = venue.city;
        // get region venue is in
        var venueRegion = venue.region;
        // get country venue is in
        var venueCountry = venue.country;

        // log the results
        console.log(`
        ----------
        Name of venue: ${nameOfVenue}
        Venue location: ${venueCity}, ${venueRegion}, ${venueCountry}
        Date: ${date}
        ----------`
        );
      }
    }
  })
}

function theSignSpotifySearch(song){
  // initialize a spotify search
  spotify.search({
    type: 'track',
    query: song
  }, function (err, data) {
    // if there is an error
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    // find the song "The Sign" by Ace of Base
    // use for-loop to search for it 
    for (var i = 0; i < data.tracks.items.length; i++) {
      var artist = data.tracks.items[i].album.artists[0].name;
      var songName = data.tracks.items[i].name;
      if (artist === "Ace of Base" && songName === "The Sign") {
        var url = data.tracks.items[i].external_urls.spotify
        var album = data.tracks.items[i].album.name
        
        // log the results
        console.log(`
          -------------
          Artist: ${artist}
          Song: ${songName}
          URL: ${url}
          Album: ${album}
          -------------`);
      }
    }
  })
}

function generalSpotifyThisSong(song) {
  // initialize a spotify search
  spotify.search({
    type: 'track',
    query: song
  }, function (err, data) {
    // if there is an error
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    // use for-loop to print all the songs with the same name
    for (var i = 0; i < data.tracks.items.length; i++) {
      var artist = data.tracks.items[i].album.artists[0].name;
      var songName = data.tracks.items[i].name;
      var url = data.tracks.items[i].external_urls.spotify
      var album = data.tracks.items[i].album.name
      
      // log the results
      console.log(`
      -------------
      Artist: ${artist}
      Song: ${songName}
      URL: ${url}
      Album: ${album}
      -------------`);
    }
  });
}

function movieThis(movie) {
  request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    // 200 is the aye-okay request
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover specific information
      console.log("-------------\nTitle: " + JSON.parse(body).Title + "\n" +
        "Year: " + JSON.parse(body).Year + "\n" +
        "IMDB Rating: " + JSON.parse(body).imdbRating + "\n" +
        "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n" +
        "Country: " + JSON.parse(body).Country + "\n" +
        "Language: " + JSON.parse(body).Language + "\n" +
        "Plot: " + JSON.parse(body).Plot + "\n" +
        "Actors: " + JSON.parse(body).Actors + "\n" +
        "-------------"
      );
    }
  })
}

var action = process.argv[2];

if (action === "concert-this") {
  var artist = process.argv[3];
  concertThis(artist);
}

else if (action === "spotify-this-song") {
  var song = process.argv[3];

  // if no song is inputted
  if (song === undefined || "") {
    song = "The Sign"

    // doing a spotify search on "The Sign"
    theSignSpotifySearch(song); 
  }

  // use this search to search for any song
  else {
    generalSpotifyThisSong(song);
  }

} 

else if (action === "movie-this") {
  var movie = process.argv[3];

  // if there is no input for movie
  if (movie === undefined || "") {
    movie = "Mr.Nobody"
  }

  // get movie information
  movieThis(movie);
} 

else if (action === "do-what-it-says") {
  // read the "random.txt" file
  fs.readFile("random.txt", "utf8", function (error, data) {
    // submit an error message, if any
    if (error) {
      return console.log(error);
    }

    // split the content and store it in an array
    var dataArr = data.split(",");

    // store the command, which is the first element in the array
    var command = dataArr[0];
  
    if (command === "spotify-this-song") {
      var song = dataArr[1];
      generalSpotifyThisSong(song);
    }
    else if (command === "movie-this") {
      var movie = dataArr[1]
      movieThis(movie);
    }
    else if (command === "concert-this") {
      var artist = dataArr[1];
      concertThis(artist);
    }

  })
}