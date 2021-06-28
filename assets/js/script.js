//Initialize the DateTime object of luxon
const DateTime = luxon.DateTime;
var now = DateTime.now();

//Initialize arrays that will hold the datetime and agenda items
var dtArray = [];
var agendaEvents = [];

//Run these functions when the user laods the webpage
function initialize() {
    loadEvents();
    createDtArray();
    showCurrDate();
    dispTimeBlocks();
}

//Fill the dtArray with DateTime objects from 9am to 5pm
function createDtArray() {
    for (i = 9; i < 18; i++) {
        newDt = DateTime.fromObject({ month: now.month, day: now.day, hour: i });
        dtArray.push(newDt);
    }
}

//Create and display the timeblock on the webpage
function dispTimeBlocks() {
    for (i = 0; i < dtArray.length; i++) {
        //Create the elements that will compose the time block
        var timeBlock = $('<div>');
        var timeRow = $('<div>');
        var timeDisp = $('<div>');
        var eventDisp = $('<section>');
        var eventText = $('<div>');
        var btn = $('<button>');

        //Add the relevant classes for styling
        timeBlock.addClass('time-block');
        timeRow.addClass('row');
        timeDisp.addClass('hour');
        eventDisp.addClass('description');
        eventText.addClass('event-text');
        btn.addClass('saveBtn');
        //Add an id to the button to track which timeblock needs to be saved
        btn.attr('id', i);

        //Add past, present or future class, based on the current time, for the background colour
        if (dtArray[i].hour == now.hour) {
            eventDisp.addClass('present');
        }
        else if (dtArray[i].hour > now.hour) {
            eventDisp.addClass('future');
        }
        else {
            eventDisp.addClass('past');
        }

        //Set the time text to 12 hour time format
        timeDisp.text(dtArray[i].toFormat('ha') + " ");

        //Add the save icon to the button
        btn.prepend("<img src=./assets/images/data-transfer-upload.svg />");
        
        //If the agendaEvents array is not undefined at i, set the text in the timeblock to
        //the text in the array, otherwise make it an empty string
        if (agendaEvents[i] != undefined){
        eventText.text(agendaEvents[i]);
        }
        else{
            agendaEvents[i] = "";
        }

        //Append all of the elements in order
        eventDisp.append(eventText);
        timeRow.append(timeDisp);
        timeRow.append(eventDisp);
        timeRow.append(btn);
        timeBlock.append(timeRow);
        $('.container').append(timeBlock);
    }
}

//Show the current date on the main page through the Luxon DateTime object defined as "now"
function showCurrDate() {
    var nowString = now.toLocaleString({ weekday: 'long', month: 'long', day: 'numeric' });
    $('#currentDay').html(nowString);
}

//Load the agenda items from localstorage. If there are no items, initialize the array
//otherwise it will be null
function loadEvents() {
    agendaEvents = JSON.parse(localStorage.getItem("agendaEvents"));
    if (!agendaEvents) {
        agendaEvents = [];
    }
}

//Save the agenda items in local storage
function saveEvents() {
    localStorage.setItem("agendaEvents", JSON.stringify(agendaEvents));
}

//If the timeblock is clicked, get the current text and display it in a new input field
//Replace the current .event-text div element with the new text-input element and put it in focus
$('.container').on("click", ".description", function () {

    var text = $(this).parent().children().children(".event-text")
        .text()
        .trim();

    var textInput = $("<input>")
        .attr('type', 'text')
        .val(text);

    textInput.addClass('text-input');

    $(this).parent().children().children(".event-text").replaceWith(textInput);

    textInput.focus();
});

//If the user clicks outside of the timeblock while it's in focus, create a new div element
//with the class of event-text and replace the text input field with the new div element
$('.container').on("blur", ".description", function () {
    var text = $(this).parent().children().children(".text-input")
        .val()
        .trim();

    var newText = $('<div>');
    newText.addClass('event-text');
    newText.text(text);

    $(this).parent().children().children(".text-input").replaceWith(newText);
});

//If the user clicks on the button, get the id of the button and add the current
//value of the agend item in the timeblock in the array at the same index as the button id.
//Save the agenda items to the localstorage after
$('.container').on("click", "button", function () {
    var eventId = parseInt($(this).attr('id'));
    agendaEvents[eventId] =
        $(this).parent().children(".description").children().text().trim();
    saveEvents();
});

//Initialize the webpage when the user first loads up the webpage
initialize();