
const userObj = localStorage.getItem("userId");
if (userObj){
    let user = JSON.parse(userObj)
    if(user.Name && user.id)
        window.location.href = "Pages/UserPage.html"
}

var button_sign_up = document.querySelector(".button-sign-up")
button_sign_up.addEventListener("click", function () {
    window.location.href = "Pages/CreateAccount.html"
})

var link_sign_in = document.querySelector(".link-sign-in")
link_sign_in.addEventListener("click", function (event) {
    event.preventDefault()
    window.location.href = "Pages/Login.html"
})