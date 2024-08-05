var iconLogoff = document.querySelector(".icon-logoff");

iconLogoff.addEventListener('mouseover', () => {
    var iconLogoff = document.getElementById("logoff-icon");
    iconLogoff.className = "ph ph-sign-out icon-logoff";

    iconLogoff.addEventListener('mouseout', () => {
        iconLogoff.className = "ph ph-user icon-logoff";
    });

    iconLogoff.addEventListener('click', async () => {
        try {
            await reqLeaveRoom(user.id)
        } catch (error) {
            alert(error)
        }
    });
})

var cuttedLogoHome = document.querySelector(".cutted-logo-home")
cuttedLogoHome.addEventListener('click', function () {
    window.location.href = "../"
})