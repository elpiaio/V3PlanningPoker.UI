var input_name = document.querySelector(".input-name");
var input_email = document.querySelector(".input-email")
var input_password = document.querySelector(".input-password")
var input_password_confirm = document.querySelector(".input-password-confirm")
var button_create_account = document.querySelector(".button-create-account")

let usuario = []

button_create_account.addEventListener("click", async function () {
    if (!input_name.value.trim() || !input_email.value || !input_password.value) { return alert("preencha todos os campos") }
    if (input_password.value != input_password_confirm.value) { return alert("As senha não conferem") }
    if (input_name.value.length > 16) { return alert("O nome não pode conter mais que 16 caracteres") }

    showLoading()
    validatingEmail()
})

async function validatingEmail() {
    const body = {
        Email: input_email.value,
    }

    const emailCode = await Handler({
        url: "emailValidator",
        param: body,
        method: "POST"
    });

    if (emailCode.message == "E-mail inválido") { hideLoading(); return alert("E-mail inválido") }
    if (emailCode.message == "Usuário já existe") { hideLoading(); return alert("usuario ja existe") }

    hideLoading()
    const { value: formValues } = await Swal.fire({
        title: "verifique seu endereço de email",
        html: `
          <input placeholder="_ _ _ _ _ _" id="swal-input1" class="swal2-input">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
            ];
        }
    });

    if (formValues == emailCode) {
        creatingAccount()
    } if(formValues != emailCode) {
        Swal.fire({
            title: "Error",
            text: "O código está errado!",
            icon: "error"
          });
    }
}

async function creatingAccount() {
    const body = {
        Name: input_name.value.trim(),
        Email: input_email.value,
        Password: input_password.value
    }

    try {
        const result = await Handler({
            url: "user",
            param: body,
            method: "POST"
        });
        usuario = result

        if (result) {
            console.log(usuario)
            localStorage.setItem("userId", JSON.stringify(usuario))
            window.location.href = "UserPage.html"
        } else {
            alert(result)
        }
    } catch (error) {
        console.log(error)
    }
}
