const DateTime = luxon.DateTime;
const Interval = luxon.Interval;
var now = DateTime.now();
console.log(now);
var dtArray = [];
var agendaEvents = [];

function initialize() {
    //console.log(agendaEvents);
    loadEvents();
    createDtArray();
    showCurrDate();
    dispTimeBlocks();
}

function createDtArray() {
    for (i = 9; i < 18; i++) {
        newDt = DateTime.fromObject({ month: now.month, day: now.day, hour: i });
        dtArray.push(newDt);
    }
    console.log(dtArray);
}

function dispTimeBlocks() {
    for (i = 0; i < dtArray.length; i++) {
        var timeBlock = $('<div>');
        var timeRow = $('<div>');
        var timeDisp = $('<div>');
        var eventDisp = $('<section>');
        var eventText = $('<div>');
        var btn = $('<button>');

        timeBlock.addClass('time-block');
        timeRow.addClass('row');
        timeDisp.addClass('hour');
        eventDisp.addClass('description');
        //eventDisp.attr('id', i);
        eventText.addClass('event-text');
        btn.addClass('saveBtn');
        btn.attr('id', i);
        if (dtArray[i].hour == now.hour) {
            eventDisp.addClass('present');
        }
        else if (dtArray[i].hour > now.hour) {
            eventDisp.addClass('future');
        }
        else {
            eventDisp.addClass('past');
        }
        timeDisp.text(dtArray[i].toFormat('ha') + " ");
        //eventDisp.text("              ");
        btn.prepend("<img src=./assets/images/data-transfer-upload.svg />");
        
        if (agendaEvents[i] != undefined){
        eventText.text(agendaEvents[i]);
        }
        else{
            agendaEvents[i] = "";
        }
        console.log(agendaEvents[i]);
        //eventText.text("  ");
        eventDisp.append(eventText);
        timeRow.append(timeDisp);
        timeRow.append(eventDisp);
        timeRow.append(btn);
        timeBlock.append(timeRow);
        $('.container').append(timeBlock);
    }
}

function showCurrDate() {
    var nowString = now.toLocaleString({ weekday: 'long', month: 'long', day: 'numeric' });
    $('#currentDay').html(nowString);
}

$('.container').on("click", ".description", function () {
    console.log("clicked");
    console.log($(this));

    var text = $(this).parent().children().children(".event-text")
        .text()
        .trim();
    console.log(text);

    var textInput = $("<input>")
        .attr('type', 'text')
        .val(text);

    textInput.addClass('text-input');

    $(this).parent().children().children(".event-text").replaceWith(textInput);

    textInput.focus();
});

function loadEvents() {
    agendaEvents = JSON.parse(localStorage.getItem("agendaEvents"));
    if (!agendaEvents) {
        agendaEvents = [];
    }
}

function saveEvents() {
    console.log(agendaEvents);
    localStorage.setItem("agendaEvents", JSON.stringify(agendaEvents));
}

$('.container').on("blur", ".description", function () {
    console.log("clocked out");
    var text = $(this).parent().children().children(".text-input")
        .val()
        .trim();
    console.log(text);

    var newText = $('<div>');
    newText.addClass('event-text');
    newText.text(text);

    $(this).parent().children().children(".text-input").replaceWith(newText);
});

$('.container').on("click", "button", function () {
    console.log($(this));
    var eventId = parseInt($(this).attr('id'));
    console.log(eventId);
    //console.log($(this).parent().children(".description").children().text().trim()); 
    agendaEvents[eventId] =
        $(this).parent().children(".description").children().text().trim();
    saveEvents();
});

initialize();