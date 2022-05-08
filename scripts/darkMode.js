function switchDarkMode(str) {
    var val = sessionStorage.getItem("darkmode");
    if (val == "true") {
        sessionStorage.setItem("darkmode", "false");
        document.getElementById("pagestyle").setAttribute("href", str+"/css/light.css");
    } else {
        sessionStorage.setItem("darkmode", "true");
        document.getElementById("pagestyle").setAttribute("href", str+"/css/dark.css");
    }
}

function setMode(str) {
    var val = sessionStorage.getItem("darkmode");
    if (val == "true") {
        document.getElementById("pagestyle").setAttribute("href", str+"/css/dark.css");
    } else {
        document.getElementById("pagestyle").setAttribute("href", str+"/css/light.css");
    }
}
