//
// Refresh access token every 5 minutes
//

function refresh_token() {
    var refreshToken = sessionStorage.getItem("refresh_token");
    fetchData("POST", url+"/api/refresh/", {"refresh": refreshToken}).then(async function(response){
        if (response.status == 200) {
            var obj = await response.json();
            sessionStorage.setItem("access_token", obj.access);
            sessionStorage.setItem("refresh_token", obj.refresh);
        } else {
            sessionStorage.clear();
            window.location.replace('../index.html');
        }
    }).then(() => {
        setTimeout(
            refresh_token, 300000
        );    
    });
}

refresh_token();