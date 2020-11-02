// (c)2020 Giuseppe Rossi

// URL GitHub
var gh_url = "giusreds.github.io";
// URL Gioco
var game_url = "https://rebrand.ly/lascoteca-origin";

// Se la pagina e' caricata da GitHub, 
// carico il gioco dal CDN di itch.io
$(function () {
    if (window.location.href.includes(gh_url))
        $("#game").attr("src", game_url);
});

// Il gioco e' stato caricato
window.addEventListener("message", function (event) {
    var message = event.data;
    if (message == "loaded") {
        $("#transition").fadeIn(500, function() {
            $("#loading").hide();
            $("#transition").fadeOut(500, function() {
                $("game").focus();
            });
        });
    }
}, false);