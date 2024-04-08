var input_name = document.querySelector(".input-name")
var input_password = document.querySelector(".input-password")
var input_password_confirm = document.querySelector(".input-password-confirm")

var button_create_account = document.querySelector(".button-create-account")

let usuario = []

button_create_account.addEventListener("click", async function () {
    if(input_password.value != input_password_confirm.value ){ return alert("As senha não conferem")}

    const body = {
        Name: input_name.value,
        Password: input_password.value
    }

    try{
        const result = await Handler({
            url: "user",
            param: body,
            method: "POST"
        });
        usuario = result
        if(usuario.message == "Usuário já existe"){
          alert("usuario ja existe")
        }else{ 
            console.log(usuario)
            localStorage.setItem("userId", JSON.stringify(usuario))
            window.location.href = "UserPage.html"
        }
    }catch(error){
        console.log(error)
    }
    

})
