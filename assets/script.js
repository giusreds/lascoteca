// (c)2020 Giuseppe Rossi

window.addEventListener("message", function (event) {
    var message = event.data;
    if (message == "loaded") {
        // document.getElementById("loading").style.display = "none";
        $("#loading").fadeOut(200);
        $("#game").focus();
    }
}, false);
