// log out functionality
async function logOut() {
    // const response = await fetch(url+"/api/logout/", {
    //     method: "POST",
    //     mode: "cors",
    //     cache: "no-cache",
    //     credentials: "same-origin",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": "Bearer "+sessionStorage.getItem("access_token")
    //     },
    //     redirect: "follow",
    //     referrerPolicy: "no-referrer",
    //     body: JSON.stringify({"refresh": sessionStorage.getItem("refresh_token")})
    // })
    var darkmode = sessionStorage.getItem("darkmode");
    sessionStorage.clear();
    sessionStorage.setItem("darkmode", darkmode);
    window.location.replace('../index.html');
}
