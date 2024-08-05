async function validatingPassword(password) {
    const body = {
        Password: password,
    }

    const validation = await Handler({
        url: "passwordValidator",
        param: body,
        method: "POST"
    });

    if (validation.message == "minimalCharacters") { hideLoading(); errorMessage("A senha deve possuir pelo menos 8 caracteres"); return false}
    if (validation.message == "invalidPassword") { hideLoading(); errorMessage("A senha deve conter: Uma letra maiúscula, uma minúscula e um número"); return false}
    return true;
}