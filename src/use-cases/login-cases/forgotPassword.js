var forgotPasswordContent = document.querySelector(".forgot-password-content")

function forgotPassword() {
    const label = document.createElement("a")
    label.onclick = passwordRecovery;
    label.textContent = "Esqueceu sua senha?"
    forgotPasswordContent.appendChild(label)
}
