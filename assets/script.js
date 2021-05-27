// (c)2020 Giuseppe Rossi

// URL GitHub
const gh_url = "giusreds";
// URL Richiesta
const request_url = "https://script.google.com/macros/s/AKfycbydUKEi_amor9ytSXoAN_zki_zaD3n16PdGirMVoEicekCUnC0x/exec";
// Nome Storage
const storage_name = "LaScoteca_token";

// Se la pagina e' caricata da GitHub, 
// carico il gioco dal CDN di itch.io
$(document).ready(function () {
    var gamePath = "resources/game/index.html";
    // Imposto la sorgente dell'iframe
    if (window.location.href.includes(gh_url)) {
        setSource().then((ifrSrc) => {
            $("#game").attr("src", ifrSrc.replace('index.html', gamePath));
        }, () => {
            location.reload();
        });
    } else
        $("#game").attr("src", gamePath);
});

function setSource() {
    return new Promise((resolve, reject) => {
        // Ottengo l'URL del gioco e lo memorizzo in un cookie
        $.ajax({
            url: request_url + "?goto=lascoteca-origin",
            success: function (data) {
                Cookies.set("lascoteca-origin", data, { expires: 120, path: '' });
                resolve(data);
            },
            error: function () {
                var cookieUrl = Cookies.get("lascoteca-origin");
                if (cookieUrl)
                    resolve(cookieUrl);
                else
                    reject();
            }
        });
    });
}

// Registrazione Service Worker
$(window).on("load", function () {
    if (window.location.href.includes(gh_url))
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("./sw.js").then(function (registration) {
                console.log("Service worker installato correttamente, scope: ", registration.scope);
            }).catch(function (error) {
                console.log("Installazione service worker fallita: ", error);
            });
        }
});

// Adatta la finestra di gioco
function setSize() {
    if (navigator.standalone === true) return;
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var iw = (iOS) ? document.documentElement.clientWidth : window.innerWidth;
    var ih = (iOS) ? document.documentElement.clientHeight : window.innerHeight;
    $("body").css("--vw", iw / 100 + "px");
    $("body").css("--vh", ih / 100 + "px");
}
$(document).ready(setSize);
$(window).resize(setSize);

// Il gioco e' stato caricato
function gameLoad() {
    $("#transition").fadeIn(500, function () {
        $("#loading").hide();
        $("#transition").fadeOut(500, function () {
            $("#game").focus();
        });
    });
}

var tempStorage = null;
// Gestisce gli eventi
$(window).on("message", function (event) {
    try {
        var msg = JSON.parse(event.originalEvent.data);
    } catch (e) {
        return;
    }
    switch (msg.name) {
        case "loaded": gameLoad(); break;
        case "setStorage":
            tempStorage = msg.value;
            localStorage.setItem(storage_name, msg.value);
            break;
        case "clearStorage":
            tempStorage = null;
            localStorage.removeItem(storage_name);
            break;
        case "getStorage":
            var r = {
                "name": "storage",
                "value": tempStorage
            };
            $("#game")[0].contentWindow.postMessage(JSON.stringify(r), "*");
            break;
        default: return;
    }
});
// Read localStorage on startup
$(document).ready(function() {
    try {
        tempStorage = localStorage.getItem(storage_name);
    } catch(e) {
        console.log(e);
        tempStorage = null;
    }
});
$(window).on("unload", function () {
    if (document.readyState == "complete")
        try {
            if (tempStorage)
                localStorage.setItem(storage_name, tempStorage);
            else
                localStorage.removeItem(storage_name);
        } catch (e) { }
});