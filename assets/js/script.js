const DateTime = luxon.DateTime;
const Interval = luxon.Interval;
var now = DateTime.now();
var dtArray = [];
var agendaEvents = [];

function initialize() {
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
        btn.prepend("<img src=./assets/images/data-transfer-upload.svg />");
        
        if (agendaEvents[i] != undefined){
        eventText.text(agendaEvents[i]);
        }
        else{
            agendaEvents[i] = "";
        }
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

function loadEvents() {
    agendaEvents = JSON.parse(localStorage.getItem("agendaEvents"));
    if (!agendaEvents) {
        agendaEvents = [];
    }
}

function saveEvents() {
    localStorage.setItem("agendaEvents", JSON.stringify(agendaEvents));
}

$('.container').on("blur", ".description", function () {
    var text = $(this).parent().children().children(".text-input")
        .val()
        .trim();

    var newText = $('<div>');
    newText.addClass('event-text');
    newText.text(text);

    $(this).parent().children().children(".text-input").replaceWith(newText);
});

$('.container').on("click", "button", function () {
    var eventId = parseInt($(this).attr('id'));
    agendaEvents[eventId] =
        $(this).parent().children(".description").children().text().trim();
    saveEvents();
});

initialize();