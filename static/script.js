let xmin = undefined //min value of x
let xmax = undefined //max value of x
let log = {} //log the state of the instruments
let idn = "" //device id 
let data = undefined //graph data
let flag = false 

plotVoid(); //plot a blank graph at the beginning

//handle event of clicking start button
$("#start").click(function () {
    $.get("/api/START", function (response) {
        createLog(response);
        flag = true
        infiniteTrace();
    })
});

//handle event of clicking stop button
$("#stop").click(function () {
    $.get("/api/STOP", function (response) {
        createLog(response);
        flag = false
    })
})

//handle event of clicking single button
$('#single').click(function () {
    getTrace();
})

//handle event of submitting query form
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

//handle event of saving graph to the server (in progress)
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

//function to implement start behavior
function infiniteTrace() {
    if (!flag) return;
    //get limit fist
    $.get("/api/LIM", function (response) {
        if (response.localeCompare("Error") !== 0 && response.localeCompare("SERVER TIMEOUT") !== 0) {
            //if limit is valid
            let res = response.split(" ");
            xmin = parseInt(res[0], 10) * Math.pow(10, -9);
            xmax = parseInt(res[1], 10) * Math.pow(10, -9);
            //get a single trace data
            $.get("/api/TRACE", function (response) {
                if (response['error'] === undefined) {
                    //if data is valid, plot data
                    data = response;
                    plotData();
                    //get the state of the instrument
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

//get a single trace data
function getTrace() {
    //start scanning (blocking behavior)
    $.get("/api/SINGLE", function (response) {
        createLog(response);
    });
    //get limit and graph data
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

//get graph data
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

//generate log
function createLog(response) {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    res = "<div>" + response + " " + date + " " + time + "</div>";
    log += res;

    $('#log').append(res);
}

//plot the data
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

//plot a blank graph
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