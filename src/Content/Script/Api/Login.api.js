async function reqReplacePassword(email, newPassword){
    const body = {
        Email: email,
        newPassword: newPassword
    }

    const result = await Handler({
        url: `user/replacePassword`,
        param: body,
        method: "put"
    });

    return result
}

async function reqGetUserValidation() {
    const result = await Handler({
        url: `user/${user.id}`,
        method: "GET"
    });

    return result
}