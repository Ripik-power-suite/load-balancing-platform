// 
// Login functions
// 
var email = "";

async function registerUser() {
    email = document.getElementById("email").value;
    sessionStorage.setItem("email", email);
    fetchData("POST", url+"/api/register/", {"email": email, "password": "12345"}).then(response => {
        if(response.status === 200) {
            window.location.replace('../index.html');
        } else {
            alert("User with this email id already exists");
            window.location.replace('../index.html');
        }
        // add error handling
    });
}
