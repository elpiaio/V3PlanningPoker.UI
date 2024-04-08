let body = {}
let resultado ={}

var btnlogin = document.querySelector(".button-send")
// Define um novo manipulador de evento de clique
btnlogin.addEventListener('click', async function () {
    body = {
        Name: document.querySelector(".input-name").value,
        Password: document.querySelector(".input-senha").value
    }

    resultado = await Handler({
        url:"user/login",
        param:body,
        method: "POST" 
    })
      
    if(resultado.id == null){
        alert("email ou senha incorretos")
        return;
    }

    localStorage.setItem("userId", JSON.stringify(resultado))
    window.location.href = "UserPage.html"
});
