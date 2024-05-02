var btnlogin = document.querySelector(".button-send")

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

    if (request.id == null) {
        alert("email ou senha incorretos")
        return;
    }

    localStorage.setItem("userId", JSON.stringify(request))
    window.location.href = "UserPage.html"
});
