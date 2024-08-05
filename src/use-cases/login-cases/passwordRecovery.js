async function passwordRecovery() {
    if (!acessCode) {
        Email = document.querySelector(".input-email").value;
        if (!Email) return errorMessage("Digite seu Email primeiro")
        try {
            await acessCodeConfig()
        } catch (error) {
            hideLoading()
            return errorMessage("Seu Email não é válido")
        }
    }

    if (acessCode) compareNewPassword(Email)
}

async function acessCodeConfig() {
    showLoading()
    const body = {
        Email: document.querySelector(".input-email").value,
    }

    const emailCode = await Handler({
        url: "user/passwordCode",
        param: body,
        method: "POST"
    });

    if (emailCode.message == "E-mail inválido") { hideLoading(); return errorMessage("E-mail inválido") }
    if (emailCode.message == "Usuário não existe") { hideLoading(); return errorMessage("Usuário não existe") }

    hideLoading()

    const formValues = await inputCode()

    if (formValues != emailCode) {
        return errorMessage("O código está errado!")
    }

    acessCode = emailCode;
}

async function compareNewPassword(Email) {
    const { value: formValues } = await Swal.fire({
        title: "Digite sua nova senha",
        html: `
              <input id="swal-input1" type="password" class="swal2-input" placeholder="Nova senha" >
              <input id="swal-input2" type="password" class="swal2-input"placeholder="Confirme a nova senha">
            `,
        focusConfirm: false,
        confirmButtonColor: "#000000",
        preConfirm: () => {
            return {
                value1: document.getElementById("swal-input1").value,
                value2: document.getElementById("swal-input2").value
            }
        }
    });

    if (formValues.value1.length > 7 && formValues.value1 == formValues.value2) {
        const valid = await validatingPassword(formValues.value1)
        if (!valid) return;

        const result = reqReplacePassword(Email, formValues.value1)
        if (result) {
            successMessage("Senha alterada com sucesso!")
        } else {
            errorMessage("Ouve um problema com a requisição!")
        }
    } else {
        return errorMessage(formValues.value1.length > 7 ? "As senhas não conferem!" : "Não aceitamos senha menores que 8 digitos!")
    }
}