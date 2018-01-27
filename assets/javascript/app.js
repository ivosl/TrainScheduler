/* global moment firebase */
// Initialize Firebase

var config = {
    apiKey: "AIzaSyAJaw4TaRdg2E_OOUYtPV3vE0KXOxQ0BXs",
    authDomain: "train-schedule-f522d.firebaseapp.com",
    databaseURL: "https://train-schedule-f522d.firebaseio.com",
    projectId: "train-schedule-f522d",
    storageBucket: "train-schedule-f522d.appspot.com",
    messagingSenderId: "1027597058483"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// --------------------------------------------------------------
// Whenever a user clicks the click button
$("#add-train").on("click", function(event) {
    event.preventDefault();
    
    // Get the input values
    
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();
    
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);
    
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

database.ref().on("child_added", function(childSnapshot) {
    
    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:MM").subtract(1, "years");
    console.log(firstTimeConverted);
    
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
    
    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    // Log everything that's coming out of snapshot
    
    $("#train-list").append(
        "<div class='row'><div class='col-lg-2'>" 
        + childSnapshot.val().trainName 
        + "</div><div class='col-lg-2'>" 
        + childSnapshot.val().destination 
        + "</div><div class = 'col-lg-2'>" 
        + childSnapshot.val().frequency
        + "</div><div class='col-lg-2'>" 
        + tMinutesTillTrain
        + "</div><div class='col-lg-2'>" 
        + nextTrain
        + "</div></div>");
        
        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
    
    