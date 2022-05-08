// 
// Login functions
// 
var email = "";

async function sendOtp() {
    document.getElementById("emailBox").style.display = "none";
    document.getElementById("otpBox").style.display = "block";
    email = document.getElementById("email").value;
    sessionStorage.setItem("email", email);
    fetchData("POST", url+"/api/getotp/", {"email": email});
}

function back() {
    document.getElementById("emailBox").style.display = "block";
    document.getElementById("otpBox").style.display = "none";
    document.getElementById("error").style.display = "none";
}

async function confirmOtp() {
    otp = document.getElementById("otp").value;
    fetchData("POST", url+"/api/login/", {"email": email, "password":otp}).then(async function(response){
        if(response.status != 200) {
            document.getElementById("error").style.display = "block";   
        } else if(response.status == 200) {
            var obj = await response.json();
            console.log(obj);
            sessionStorage.setItem("access_token", obj.access);
            sessionStorage.setItem("refresh_token", obj.refresh);
            sessionStorage.setItem("user_id", obj.id);
            window.location.replace('./pages/home.html');
        }
    });
}

if (sessionStorage.getItem("darkmode") == null) {
    sessionStorage.setItem("darkmode", "false");
}