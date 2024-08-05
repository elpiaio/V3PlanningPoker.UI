var input_name = document.querySelector(".input-name");
var input_email = document.querySelector(".input-email")
var input_password = document.querySelector(".input-password")
var input_password_confirm = document.querySelector(".input-password-confirm")
var button_create_account = document.querySelector(".button-create-account")
var whiteBanner = document.querySelector(".white-banner")

let usuario = []

getUrlRegister()

button_create_account.addEventListener("click", async function () {
    if (!input_name.value.trim() || !input_email.value || !input_password.value) { return errorMessage("preencha todos os campos") }
    if (input_password.value != input_password_confirm.value) { return errorMessage("As senha não conferem") }
    if (input_name.value.length > 16) { return errorMessage("O nome não pode conter mais que 16 caracteres") }
    if (input_password.value.length < 8) { return errorMessage("A senha precisa ter 8 ou mais caracteres!") }

    showLoading()
    const valid = await validatingPassword(input_password.value)
    if (!valid) return;
    await validatingEmail()
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
        confirmButtonColor: "#000000",
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
            ];
        }
    });

    if (formValues == emailCode) {
        reqCreatingAccount()
    } if (formValues != emailCode) {
        Swal.fire({
            title: "Error",
            text: "O código está errado!",
            icon: "error",
            confirmButtonColor: "#000000",
        });
    }
}