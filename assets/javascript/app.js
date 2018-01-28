$(document).ready(function() {

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

        //Some modified code from Employee Time Sheet in class activity was used
        //that was done by our group Jina, Stephanie, Joe and myself...
        //Later on some methodology approach was discussed among Chetan, Jina and myself.

        //Get the input values
        
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
        });
    });
    
    database.ref().on("child_added", function(childSnapshot) {
        
        // Recording current time and the first train time
        var now = moment();
        firstTrainMoment = moment($("#first-train").val().trim(), "hh:mm");
        console.log(now);
        console.log(firstTrainMoment);
        console.log("difference is ", firstTrainMoment.diff(now, "minutes"), "minutes");
        
        // Difference between the times
        var diffTime = moment().diff(moment(firstTrainMoment), "minutes");
        console.log("Difference in time: " + diffTime);
        
        // Accessing the frequency value
        var freq = childSnapshot.val().frequency;
        console.log(freq);
        
        // Time apart (remainder)
        var remainder = diffTime % freq;
        console.log(remainder);
        
        // Minute Until Train
        var minutesTillTrain = freq - remainder;
        console.log("Minites till train: " + minutesTillTrain);
        
        // Next Train
        var nextTrain = moment().add(minutesTillTrain, "minutes");
        console.log(nextTrain);
        console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));
        
        // Appending all the values to the chart
        $("#train-list").append(
            "<div class='row'><div class='col-lg-2'>" 
            + childSnapshot.val().trainName 
            + "</div><div class='col-lg-2'>" 
            + childSnapshot.val().destination 
            + "</div><div class = 'col-lg-2'>" 
            + freq
            + "</div><div class='col-lg-2'>" 
            + minutesTillTrain
            + "</div><div class='col-lg-2'>" 
            + moment(nextTrain).format("hh:mm")
            + "</div></div>");
            
            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    });