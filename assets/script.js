// (c)2020 Giuseppe Rossi

// URL GitHub
var gh_url = "giusreds.github.io";
// URL Richiesta
var request_url = "https://tinyurl.com/giusreds-url?goto=lascoteca-origin";

// Se la pagina e' caricata da GitHub, 
// carico il gioco dal CDN di itch.io
$(document).ready(function () {
    // Ottengo l'URL del gioco e lo memorizzo in un cookie
    $.ajax({
        url: request_url,
        success: function (data) {
            Cookies.set('lascoteca-origin', data, { expires: 7, path: '' });
            if ($("#game").attr("src") == "about:blank")
                $("#game").attr("src", data);
        }
    });
    // Imposto la sorgente dell'iframe
    if (window.location.href.includes(gh_url)) {
        if (Cookies.get('lascoteca-origin'))
            $("#game").attr("src", Cookies.get('lascoteca-origin'));
    } else
        $("#game").attr("src", "resources/index.html");
});

// Il gioco e' stato caricato
window.addEventListener("message", function (event) {
    var message = event.data;
    if (message == "loaded") {
        $("#transition").fadeIn(500, function () {
            $("#loading").hide();
            $("#transition").fadeOut(500, function () {
                $("game").focus();
            });
        });
    }
}, false);