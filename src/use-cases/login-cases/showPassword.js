var show = false;
var inputPassword = document.querySelector(".input-senha")
var eyeButton = document.querySelector(".eye-button")

function showPassword() {
    if(!show) {
        inputPassword.type = "text";
        show = true
        eyeButton.innerHTML = '<i class="ph-bold ph-eye"></i>';
    } else {
        inputPassword.type = "password";
        show = false;
        eyeButton.innerHTML = '<i class="ph-bold ph-eye-closed"></i>';
    }
}