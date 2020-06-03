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

$("#queryButton").click(function (event) {
    event.preventDefault();
    let query = $("#inputQuery").val();
    if (query === "" || query === undefined || query === null) {
        $("#result").text("Invalid Command");
    } else {
        $.get("/api/QUERY", { "queryInput": query }, function (response) {
            $("#result").text(JSON.stringify(response));
        }, "json");
    }
})

$("#save").click(function () {
    if (data !== undefined) {
        data["xmin"] = xmin;
        data["xmax"] = xmax;
        $.post("/api/UPLOAD", data, function(response){
            alert(response);
        })
    } else {
        alert("No data available");
    }
})

function infiniteTrace() {
    if (!flag) return;
    $.get("/api/LIM", function (response) {
        if (response.localeCompare("Error") !== 0 && response.localeCompare("SERVER TIMEOUT") !== 0) {
            let res = response.split(" ");
            xmin = parseInt(res[0], 10) * Math.pow(10, -9);
            xmax = parseInt(res[1], 10) * Math.pow(10, -9);
            $.get("/api/TRACE", function (response) {
                if (response['error'] === undefined) {
                    data = response;
                    plotData();
                    $.get("/api/STATE", function (response) {
                        createLog(response);
                        infiniteTrace();
                    })
                } else {
                    createLog(response['error']);
                    infiniteTrace();
                }
            });
        } else {
            createLog(response);
            infiniteTrace();
        }
    });
}

function getTrace() {
    $.get("/api/SINGLE", function (response) {
        createLog(response);
    });
    $.get("/api/LIM", function (response) {
        if (response.localeCompare("ERROR") !== 0) {
            let res = response.split(" ");
            xmin = parseInt(res[0], 10) * Math.pow(10, -9);
            xmax = parseInt(res[1], 10) * Math.pow(10, -9);
            getData();
        }else{
            createLog(response);
        }
    });
}

function getData() {
    $.get("/api/TRACE", function (response) {
        if (response["error"] === undefined) {
            data = response;
            plotData();
        }else{
            createLog(response["error"]);
        }
    });
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
        title: "OSA trace",
        yaxis: {
            title: data["ylabel"] + " (" + data["yunits"] + ")",
            autorange: true
        },
        xaxis: {
            //range: [xmin, xmax],
            autorange: true,
            title: data["xlabel"] + " (" + data["xunits"] + ")"
        }
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