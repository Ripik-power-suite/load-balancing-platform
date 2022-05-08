// 
// Create Load Balancer functions
// 
function backToHome() {
    window.location.replace('./home.html');
}

function step0() {
    document.getElementById("step0").style.display = "none";
    document.getElementById("step1").style.display = "block";
}

function back0() {
    document.getElementById("step0").style.display = "block";
    document.getElementById("step1").style.display = "none";
}

function step1() {
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";

    str = "";
    num = document.getElementById("numProdPlants").value;
    for (i = 1; i <= num; i++) {
        str += "<div class='user-box'>" +
        "<input type='number' id='numElectrolysers"+i+"' required>" +
        "<label>Number of electrolyzers in Plant "+i+"</label></div>"
    }
    str += "<div style='display: flex; justify-content: space-around;'><input type='button' value='Back' onclick='back1()'><input type='submit' value='Next'></div>"
    document.getElementById("productionPlants").innerHTML = str;
}

function back1() {
    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
}

function step2() {
    document.getElementById("step3").style.display = "block";
    document.getElementById("step2").style.display = "none";    

    str = "";
    num = document.getElementById("numPowerPlants").value;
    for (i = 1; i <= num; i++) {
        str += "<div class='select-box'>" +
        "<label>Power type for Plant "+i+"</label><select id='powerType"+i+
        "'><option value='1'>Captive</option><option value='2'>Purchased</option></select></div>"
    }
    str += "<div style='display: flex; justify-content: space-around;'><input type='button' value='Back' onclick='back2()'><input type='submit' value='Next'></div>"
    document.getElementById("powerPlants").innerHTML = str;
}

function back2() {
    document.getElementById("step2").style.display = "block";
    document.getElementById("step3").style.display = "none";
}

function step3() {
    companyName = document.getElementById("companyName").value;
    numProdPlants = document.getElementById("numProdPlants").value;
    numPowerPlants = document.getElementById("numPowerPlants").value;
    document.getElementById("heading").innerHTML = "Load Balancer for "+companyName;
    numElectrolysers = [];
    
    str = "<div class='container'><div class='card' style='width:48%;'><h2>Production constraints</h2>";
    str += "<div class='user-box'><input type='number' id='prodTarget' required>" + 
    "<label>Target production (TPD)</label></div>";
    for (i = 1; i <= numProdPlants; i++) {
        numElectrolysers[i] = document.getElementById("numElectrolysers"+i).value;
        str += "<div class='user-box'><input type='number' id='prodLimit"+i+"' required>" + 
        "<label>Production capacity of Plant "+i+" (TPD)</label></div>";
    }
    str += "</div><div class='card' style='width:48%;'><h2>Power constraints</h2>";
    for (i = 1; i <= numPowerPlants; i++) {
        str += "<div class='user-box'><input type='number' id='powerLimit"+i+"' required>" + 
        "<label>Power capacity of Plant "+i+" (MW)</label></div>";
    }
    for (i = 1; i <= numPowerPlants; i++) {
        str += "<div class='user-box'><input type='number' id='rsKWH"+i+"' required step='any'>" + 
        "<label>Rs/KWH for Power Plant "+i+"</label></div>";
    }
    str += "</div></div>";
    str += "<div class='card' style='width: 95%;'><h2>Electrolyser construct</h2><table><tr><th>Electrolyzer</th><th>Elements</th><th>Area (m2)</th><th>Efficiency (%)</th><th>Rectifier Eff. (%)</th><th>K-factor</th><th style='width: 18%;'>Power source</th><th>Maximum current (KA)</th><th>Minimum current (KA)</th></tr>";

    for (i = 1; i <= numProdPlants; i++) {
        for (j=1; j<=numElectrolysers[i]; j++) {
            str += "<tr><td>P"+i+"-E"+j+"</td>"+
            "<td><input type='number' id='elements"+i+"_"+j+"' value=100 required></td>"+
            "<td><input type='number' id='area"+i+"_"+j+"' value=2.5 required></td>"+
            "<td><input type='number' id='efficiency"+i+"_"+j+"' value=92 required></td>"+
            "<td><input type='number' id='rectifierEff"+i+"_"+j+"' value=97 required></td>"+
            "<td><input type='number' id='kFactor"+i+"_"+j+"' value=0.1 required></td>"+
            "<td><select id='powerSource"+i+"_"+j+"'>";
            for (k=0; k<numPowerPlants; k++) {
                str += "<option value='"+k+"'>Power plant "+(k+1)+"</option>";
            }
            str += "</select></td>"+
            "<td><input type='number' id='maxCurrent"+i+"_"+j+"' value=10 required></td>"+
            "<td><input type='number' id='minCurrent"+i+"_"+j+"' value=0 required></td></tr>";
        }
    }
    str += "</table></div>";
    str += "<div style='display: flex; justify-content: space-around;'><input type='button' value='Back' onclick='back4()'><input type='submit' value='Save balancer'></div>"
    document.getElementById('finalForm').innerHTML = str;
    document.getElementById("finalStep").style.display = "block";
    document.getElementById("step3").style.display = "none";
}

function back3() {
    document.getElementById("step3").style.display = "block";
    document.getElementById("finalStep").style.display = "none";
}

async function saveLoadBalancer() {
    companyName = document.getElementById("companyName").value;
    numProdPlants = document.getElementById("numProdPlants").value;
    numPowerPlants = document.getElementById("numPowerPlants").value;
    loadBalancerName = document.getElementById("BalancerName").value;
    targetProduction = document.getElementById("prodTarget").value;

    elements = [];
    area = [];
    numElectrolysers = [];
    powerSource = [];
    efficiency = [];
    rectifierEff = [];
    kFactor = [];
    maxCurrent = [];
    minCurrent = [];
    prodLimit = [];

    count = 0;
    for (i = 1; i <= numProdPlants; i++) {
        prodLimit[i-1] = document.getElementById("prodLimit"+i).value;
        numElectrolysers[i-1] = document.getElementById("numElectrolysers"+i).value;

        for (j=1; j<=numElectrolysers[i-1]; j++) {
            elements[count] = parseInt(document.getElementById("elements"+i+"_"+j).value, 10);
            area[count] = document.getElementById("area"+i+"_"+j).value;
            powerSource[count] = document.getElementById("powerSource"+i+"_"+j).value;
            efficiency[count] = document.getElementById("efficiency"+i+"_"+j).value;
            rectifierEff[count] = document.getElementById("rectifierEff"+i+"_"+j).value;
            kFactor[count] = document.getElementById("kFactor"+i+"_"+j).value;
            maxCurrent[count] = document.getElementById("maxCurrent"+i+"_"+j).value;
            minCurrent[count] = document.getElementById("minCurrent"+i+"_"+j).value;
            count++;
        }
    }

    powerCost = [];
    powerLimit = [];
    for (i = 1; i <= numPowerPlants; i++) {
        powerLimit[i-1] = document.getElementById("powerLimit"+i).value;
        powerCost[i-1] = document.getElementById("rsKWH"+i).value;
    }

    stringPowerLimit = "";
    stringPowerCost = "";
    stringNumElectrolysers = "";
    for (i=0; i<numPowerPlants; i++) {
        stringPowerLimit += powerLimit[i]+",";
        stringPowerCost += powerCost[i]+",";
        stringNumElectrolysers += numElectrolysers[i]+",";
    }
    stringPowerLimit += "";
    stringPowerCost += "";
    stringNumElectrolysers += "";

    stringProdLimit = "";
    for (i=0; i<numProdPlants; i++) {
        stringProdLimit += prodLimit[i]+",";
    }
    stringProdLimit += "";

    stringElements = "";
    stringArea = "";
    stringPowerSource = "";
    stringEfficiency = "";
    stringRectifierEff = "";
    stringKFactor = "";
    stringMaxCurrent = "";
    stringMinCurrent = "";
    for (i=0; i<count; i++) {
        stringElements += elements[i]+",";
        stringArea += area[i]+",";
        stringPowerSource += powerSource[i]+",";
        stringEfficiency += efficiency[i]+",";
        stringRectifierEff += rectifierEff[i]+",";
        stringKFactor += kFactor[i]+",";
        stringMaxCurrent += maxCurrent[i]+",";
        stringMinCurrent += minCurrent[i]+",";
    }
    stringElements += "";
    stringArea += "";
    stringPowerSource += "";
    stringEfficiency += "";
    stringRectifierEff += "";
    stringKFactor += "";
    stringMaxCurrent += "";
    stringMinCurrent += "";

    data = {
        "user": sessionStorage.getItem("user_id"),
        "companyName": companyName,
        "loadBalancerName": loadBalancerName,
        "targetprod": targetProduction,
        "numPowerPlants": numPowerPlants,
        "powerLimit": stringPowerLimit,
        "numProdPlants": numProdPlants,
        "prodLimit": stringProdLimit,
        "numElectrolysers": stringNumElectrolysers,
        "elements": stringElements,
        "area": stringArea,
        "powerSource": stringPowerSource,
        "efficiency": stringEfficiency,
        "rectifierEff": stringRectifierEff,
        "kFactor": stringKFactor,
        "maxCurrent": stringMaxCurrent,
        "minCurrent": stringMinCurrent,
        "powerCost": stringPowerCost
    }

    fetch(url+"/api/addscenario/", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+sessionStorage.getItem("access_token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    }).then(() => {
        window.location.replace("./home.html");
    });
}
