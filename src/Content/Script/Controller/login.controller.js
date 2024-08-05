var btnlogin = document.querySelector(".button-send")
var whiteBanner = document.querySelector(".white-banner")
var acessCode = null;
var Email = null

getUrlLogin()

btnlogin.addEventListener('click', async function () {
    const body = {
        Email: document.querySelector(".input-email").value,
        Password: document.querySelector(".input-senha").value
    }

    const request = await Handler({
        url: "user/login",
        param: body,
        method: "POST"
    })

    if (!request || !request.id && !request.Name) return errorMessage("email ou senha incorretos")

    const redirect = getUrlUserPage(request);
    if (redirect) { return }

    localStorage.setItem("userId", JSON.stringify(request))
    window.location.href = "UserPage.html"
});
