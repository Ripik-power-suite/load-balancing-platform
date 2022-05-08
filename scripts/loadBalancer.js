// render Load Balancer
function renderLoadBalancer() {
    var id = sessionStorage.getItem("id");
    var data = JSON.parse(sessionStorage.getItem("listScenarios"))[id];
    companyName = data.companyName;
    loadBalancerName = data.loadBalancerName;
    targetProd = data.targetprod;
    console.log(targetProd);
    numProdPlants = data.numProdPlants;
    numPowerPlants = data.numPowerPlants;
    numElectrolysers = data.numElectrolysers.split(',');
    prodLimit = data.prodLimit.split(",");
    powerLimit = data.powerLimit.split(",");
    powerCost = data.powerCost.split(",");
    elements = data.elements.split(",");
    area = data.area.split(",");
    powerSource = data.powerSource.split(",");
    efficiency = data.efficiency.split(",");
    rectifierEff = data.rectifierEff.split(",");
    kFactor = data.kFactor.split(",");
    maxCurrent = data.maxCurrent.split(",");
    minCurrent = data.minCurrent.split(",");

    document.getElementById("heading").innerHTML = loadBalancerName+" Balancer, "+companyName;

    str = "<div class='container'><div class='card' style='width:48%;'><h2>Production constraints</h2>";
    str += "<div class='user-box'><input type='number' id='prodTarget' value='"+targetProd+"' required>" + 
    "<label>Production target (TPD)</label></div>";
    for (i = 1; i <= numProdPlants; i++) {
        str += "<div class='user-box'><input type='number' id='prodLimit"+i+"' value="+prodLimit[i-1]+" required>" + 
        "<label>Production capacity of Plant "+i+" (TPD)</label></div>";
    }
    str += "</div><div class='card' style='width:48%;'><h2>Power constraints</h2>";
    for (i = 1; i <= numPowerPlants; i++) {
        str += "<div class='user-box'><input type='number' id='powerLimit"+i+"' value="+powerLimit[i-1]+" required>" + 
        "<label>Power capacity of Plant "+i+" (MW)</label></div>";
    }
    for (i = 1; i <= numPowerPlants; i++) {
        str += "<div class='user-box'><input type='number' id='rsKWH"+i+"' value="+powerCost[i-1]+" required step='any'>" + 
        "<label>Rs/KWH for Power Plant "+i+"</label></div>";
    }
    str += "</div></div>";
    str += "<div class='card' style='width: 95%;'><h2>Electrolyser construct</h2><table><tr><th>Electrolyzer</th><th>Elements</th><th>Area (m2)</th><th>Efficiency (%)</th><th>Rectifier Eff. (%)</th><th>K-factor</th><th style='width: 18%;'>Power source</th><th>Maximum current (KA)</th><th>Minimum current (KA)</th></tr>";

    count = 0;
    for (i = 1; i <= numProdPlants; i++) {
        for (j=1; j <= numElectrolysers[i-1]; j++) {
            str += "<tr><td>P"+i+"-E"+j+"</td>"+
            "<td><input type='number' id='elements"+i+"_"+j+"' value="+elements[count]+" required></td>"+
            "<td><input type='number' id='area"+i+"_"+j+"' value="+area[count]+" required></td>"+
            "<td><input type='number' id='efficiency"+i+"_"+j+"' value="+efficiency[count]+" required></td>"+
            "<td><input type='number' id='rectifierEff"+i+"_"+j+"' value="+rectifierEff[count]+" required></td>"+
            "<td><input type='number' id='kFactor"+i+"_"+j+"' value="+kFactor[count]+" required></td>"+
            "<td><select id='powerSource"+i+"_"+j+"' value='"+powerSource[count]+"'>";
            for (k=0; k<numPowerPlants; k++) {
                str += "<option value='"+k+"'>Power plant "+(k+1)+"</option>";
            }
            str += "</select></td>"+
            "<td><input type='number' id='maxCurrent"+i+"_"+j+"' value="+maxCurrent[count]+" required></td>"+
            "<td><input type='number' id='minCurrent"+i+"_"+j+"' value="+minCurrent[count]+" required></td></tr>";
            count++;
        }
    }
    str += "</table></div>";    
    str += "<div style='display: flex; justify-content: space-around;'><input type='submit' value='Run'></div>"
    
    document.getElementById("form").innerHTML = str;
}
renderLoadBalancer();

function backToHome() {
    window.location.replace('./home.html');
}

function back() {
    document.getElementById("balancerInput").style.display = "block";
    document.getElementById("balancerOutput").style.display = "none";
}

// process
async function process() {
    var id = sessionStorage.getItem("id");
    var obj = JSON.parse(sessionStorage.getItem("listScenarios"))[id];
    numProdPlants = parseInt(obj.numProdPlants);
    numPowerPlants = parseInt(obj.numPowerPlants);
    targetProduction = document.getElementById("prodTarget").value;
    companyName = obj.companyName;
    loadBalancerName = obj.loadBalancerName;
    numElectrolysers = obj.numElectrolysers.split(',');

    document.getElementById("balancerInput").style.display = "none";
    document.getElementById("balancerOutput").style.display = "block";
    document.getElementById("balancerOutput").innerHTML = "<h2>Processing...</h2>";

    elements = [];
    area = [];
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
    for(i = 0; i < numPowerPlants; i++) {
        stringPowerLimit += powerLimit[i] + ",";
        stringPowerCost += powerCost[i] + ",";
    }

    stringProdLimit = "";
    stringNumElectrolysers = "";
    stringElements = "";
    stringArea = "";
    stringPowerSource = "";
    stringEfficiency = "";
    stringRectifierEff = "";
    stringKFactor = "";
    stringMaxCurrent = "";
    stringMinCurrent = "";

    count = 0;
    for(i = 0; i < numProdPlants; i++) {
        stringProdLimit += prodLimit[i] + ",";
        stringNumElectrolysers += numElectrolysers[i] + ",";
        for(j = 0; j < numElectrolysers[i]; j++) {
            stringElements += elements[count] + ",";
            stringArea += area[count] + ",";
            stringPowerSource += powerSource[count] + ",";
            stringEfficiency += efficiency[count] + ",";
            stringRectifierEff += rectifierEff[count] + ",";
            stringKFactor += kFactor[count] + ",";
            stringMaxCurrent += maxCurrent[count] + ",";
            stringMinCurrent += minCurrent[count] + ",";
            count++;
        }
    }

    data = {
        "companyName": companyName,
        "loadBalancerName": loadBalancerName,
        "targetProd": targetProduction,
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

fetch(url+"/api/runScenario/", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    }).then(async function(response) {
        // add error handling
        if(response.status === 200) {
            var res = await response.json();
            res = res[0].split('], [');
            res[0] = res[0].slice(2,-1);

            stat = res[0].split(',');
            
            console.log(stat);

            res1 = res[1].split(', ');
            totalCons = res1[0];
            specificCons = res1[1];
            electrolyzerPower = res1.slice(2);
            electrolyzerPower[0] = electrolyzerPower[0].slice(1);

            powerPlantLoad = res[2].split(', ');
            powerPlantCost = res[3].split(', ');
            powerPlantCost[data.numPowerPlants-1] = powerPlantCost[data.numPowerPlants-1].slice(0,-1);

            res4 = res[4].split(', ');
            totalProd = res4[0];
            plantLoad = res4.slice(3);
            plantLoad[0] = plantLoad[0].slice(1);
            
            electrolyzerSource = res[5].split(', ');
            electrolyzerLoad = res[6].split(', ');
            electrolyzerProd = res[7].split(', ');
            electrolyzerProd[count-1] = electrolyzerProd[count-1].slice(0,-3);

            for (i = 0; i < electrolyzerProd.length; i++) {
                electrolyzerSource[i] = electrolyzerSource[i].slice(1,-1);
            }
            
            str = "<h2>Output for "+data.loadBalancerName+" balancer, "+data.companyName+"</h2>";
            str += "<div class='container'><div class='card' style='width:48%;'><h2>Production values</h2>";
            cost = 0;
            for (i = 0; i < data.numPowerPlants; i++) {
                cost += parseFloat(powerPlantCost[i])*parseFloat(powerPlantLoad[i])*24000;
            }
            cost = cost/totalProd;
            str += "<h4>Production cost (Rs/TPD): "+cost+"</h4><br>";
            str += "Total production (TPD): "+totalProd+"<br>";
            str += "Specific power consumption (KWH/TPD): "+specificCons+"<br>";

            for (i = 1; i <= numProdPlants; i++) {
                str += "Plant "+i+" production (TPD): "+plantLoad[i-1]+"<br>";
            }
            str += "</div><div class='card' style='width:48%;'><h2>Power values</h2>";
            for (i = 1; i <= numPowerPlants; i++) {
                str += "Power plant "+i+" load (MW): "+powerPlantLoad[i-1]+"<br>";
            }
            for (i = 1; i <= numPowerPlants; i++) {
                str += "Power plant "+i+" cost (Rs/KWH): "+powerPlantCost[i-1]+"<br>";
            }        
            str += "</div></div>";
            str += "<div class='card' style='width: 95%;'><table><tr><th>Electrolyzer</th><th>Power source</th><th>Current (KA)</th><th>Voltage (V)</th><th>Power (MW)</th><th>Production (TPD)</th></tr>";
        
            count = 0;
            area = data.area.split(",");
            kFactor = data.kFactor.split(",");
            for (i = 1; i <= numProdPlants; i++) {
                for (j=1; j<=numElectrolysers[i-1]; j++) {
                    voltage = (2.42+parseFloat(kFactor[count])*parseFloat(electrolyzerLoad[count])/parseFloat(area[count]))
                    str += "<tr><td>P"+i+"-E"+j+"</td>"+
                    "<td>"+electrolyzerSource[count]+"</td>"+
                    "<td>"+electrolyzerLoad[count]+"</td>"+
                    "<td>"+voltage.toFixed(2)+"</td>"+
                    "<td>"+electrolyzerPower[count]+"</td>"+
                    "<td>"+electrolyzerProd[count]+"</td>";
                    count++;
                }
            }
            str += "</table></div>";
            str += "<div style='display: flex; justify-content: space-around;'><input type='button' value='Back' onclick='back()'></div>";
            document.getElementById("balancerOutput").innerHTML = str;
        } else {
            console.log("Error");
            document.getElementById("balancerOutput").innerHTML = "<h2>Something went wrong. Please try again</h2>";
            setTimeout(window.location.replace("./home.html"), 5000);
        }
    });
}

async function deleteLoadBalancer() {
    var id = sessionStorage.getItem("id");
    alert("Are you sure you want to delete this load balancer?");
    const response = await fetch(url+"/api/deletescenario/"+id, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+sessionStorage.getItem("access_token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    }).then(() => {
        window.location.replace("./home.html");
    });
}