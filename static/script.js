let xmin = undefined
let xmax = undefined
let log = {} //log the state of the instruments
let idn = ""
let data = undefined
let flag = false

plotVoid();

$("#start").click(function () {
    $.get("/api/START", function (response) {
        createLog(response);
        flag = true
        infiniteTrace();
    })
});

$("#stop").click(function () {
    $.get("/api/STOP", function (response) {
        createLog(response);
        flag = false
    })
})

$('#single').click(function () {
    getTrace();
})

function infiniteTrace() {
    if(!flag) return;
    $.get("/api/LIM", function (response) {
        let res = response.split(" ");
        xmin = parseInt(res[0], 10) * Math.pow(10, -9);
        xmax = parseInt(res[1], 10) * Math.pow(10, -9);
        $.get("/api/TRACE", function (response) {
            data = response;
            plotData();
            $.get("/api/STATE", function (response) {
                createLog(response);
                infiniteTrace();
            })
        });
    });
}

function getTrace() {
    console.log("Get Trace")
    $.get("/api/LIM", function (response) {
        let res = response.split(" ");
        xmin = parseInt(res[0], 10) * Math.pow(10, -9);
        xmax = parseInt(res[1], 10) * Math.pow(10, -9);
        getData();
    });
}

function getData() {
    $.get("/api/TRACE", function (response) {
        if(response["error"] == undefined){
            data = response;
            plotData();
            getState();
        }
    });
}

function getState() {
    $.get("/api/STATE", function (response) {
        createLog(response);
    })
}

function createLog(response) {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    res = "<div>" + response + " " + date + " " + time + "</div>";
    log += res;

    $('#log').append(res);
}

function plotData() {
    let trace = {
        type: "scatter",
        mode: "lines",
        name: "OSA trace",
        x: data["xdata"],
        y: data["ydata"],
        line: { color: '#17BECF' }
    }

    let points = [trace];

    let layout = {
        title: "Basic OSA trace"
    }

    Plotly.newPlot('graph', points, layout);
}

function plotVoid() {
    let trace1 = {
        x: [],
        y: [],
        type: 'scatter',
        mode: "lines"
    };

    let points = [trace1];

    let layout = {
        title: "Blank plot(use control to get real plot)"
    }

    Plotly.newPlot('graph', points, layout);
}