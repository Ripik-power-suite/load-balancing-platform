// 
// Home page functions
// 
function createLoadBalancer() {
    window.location.replace('./createLoadBalancer.html');
}

// displays list of all previously saved load balancers
async function viewLoadBalancers() {
    user_id = sessionStorage.getItem("user_id");
    const response = await fetch(url+"/api/user/"+user_id, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+sessionStorage.getItem("access_token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    var obj = await response.json();
    var listScenarios = [];
    str = "";
    i = 0;
    obj.scenarios.forEach(function(element) {
        listScenarios[i] = element;
        console.log(element);
        str += "<div class='item' onclick='renderLoadBalancer(\""+i+"\")'><h1 style='font-size: 44px;'>"+(i+1);
        str += ".</h1><h1 style='font-size: 24px;'>"+element.loadBalancerName+", "+element.companyName+"</h1>";
        str += "<h4>Num of production plants: "+element.numProdPlants+"<br>"
        str += "Num of power plants: "+element.numPowerPlants+"</h4></div>";
        i++;
    });
    str += "<div class='item' title='Create new load balancer' onclick='createLoadBalancer()'><i class='material-icons' style='font-size: 96px; opacity: 0.7;'>add</i></div></div>";
    document.getElementById("listLoadBalancers").innerHTML = str;
    sessionStorage.setItem("listScenarios", JSON.stringify(listScenarios));
}

viewLoadBalancers();

// Render a load balancer
function renderLoadBalancer(id) {
    // var data = JSON.parse(sessionStorage.getItem("listScenarios"));
    sessionStorage.setItem("id", id);
    window.location.replace('./loadBalancer.html');
}