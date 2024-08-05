async function userValidator() {
    if (!user || !user.id || !user.Name) {
        alert("sua sessão expirou! faça login novamente")
        try {
            return window.location.href = `Login.html?idroom=${uuid}`
        } catch (error) {
            return window.location.href = `Login.html`
        }
    } else {
        const newUser = await reqGetUserValidation()

        if (!newUser || newUser.Name != user.Name || newUser.id != user.id || newUser.Email != user.Email) {
            alert("voce não está logado corretamente!")
            try {
                return window.location.href = `Login.html?idroom=${uuid}`
            } catch (error) {
                return window.location.href = `Login.html`
            }
        }
    }
}