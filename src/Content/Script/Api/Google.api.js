async function continueWithGoogle(body) {
    try {
        const user = await reqGetUserEmail(body.Email)

        if (user && user.Email && user.Name && user.id) {
            const redirect = getUrlUserPage(user);
            if (redirect) { return }

            localStorage.setItem("userId", JSON.stringify(user))
            window.location.href = "UserPage.html"
        } else {
            const result = await createUserReq(body)
            usuario = result

            if (!result || !result.Name || !result.Email || !result.id) { return errorMessage("Ocoreu um erro de validação na API") }

            const redirect = getUrlUserPage(result);
            if (redirect) { return }

            localStorage.setItem("userId", JSON.stringify(result))
            window.location.href = "UserPage.html"
        }
    } catch (error) {
        console.log(error)
        errorMessage("Ocoreu um erro de validação na API")
    }
}

async function reqGetUserEmail(email) {
    const result = await Handler({
        url: `user/email/${email}`,
        method: "get"
    });

    return result
}

async function createUserReq(body) {
    const result = await Handler({
        url: "user",
        param: body,
        method: "POST"
    });

    return result
}
