async function reqCreatingAccount() {
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

        if (result && result.Name) {
            const redirect = getUrlUserPage(result);
            if (redirect) { return }

            localStorage.setItem("userId", JSON.stringify(usuario))
            window.location.href = "UserPage.html"
        }
        if (result.message == "invalidPassword") {
            errorMessage("A senha deve conter: Uma letra maiúscula, uma minúscula e um número")
        }
        else {
            errorMessage(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error)
    }
}