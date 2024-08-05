function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential)

    if (!data) return errorMessage("Ouve um erro na API!")

    const password = data.sub + "Google";
    var body = {
        Name: data.name,
        Email: data.email,
        Password: password
    }

    if (data.name.length < 16) {
        continueWithGoogle(body)
    } else {
        body.Name = data.given_name;
        continueWithGoogle(body)
    }
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "745509205468-12llooertqv2a7ht7cipi09si4b53m1g.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        {
            type: "standard",
            shape: "pill",
            theme: "outline",
            text: "continue_with",
            size: "large",
            locale: "en-US",
            logo_alignment: "left"
        }
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}