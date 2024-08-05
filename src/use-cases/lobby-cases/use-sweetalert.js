function Toast(title) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    Toast.fire({
        icon: "info",
        title: title
    });
}

function triggerModal(userName, userId) {
    Swal.fire({
        title: "Player config:",
        text: userName,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "New Admin",
        denyButtonText: `Kick User`
    }).then((result) => {
        if (result.isConfirmed) {
            const result = reqNewAdmin(userId)
        } else if (result.isDenied) {
            const result = reqLeaveRoom(userId)
            if (result) {
                Swal.fire("Usuario chutado da sala", "", "success");
            } else {
                Swal.fire("Ocoreu um Erro", "", "error");
            }
        }
    });
}

function triggerTutorial() {
    Swal.fire({
        imageUrl: "https://pbs.twimg.com/media/Fw7y1swXgAEwOk4.jpg",
        imageAlt: "A tall image"
    });
}

function newAdminMessage(userData) {
    Swal.fire({
        title: "Novo Admin na área!",
        text: `Se curvem perante o rei ${userData.Name}!`,
        icon: "success"
    });
}

function showVotesAlert() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    Toast.fire({
        icon: "info",
        title: "Exibindo os votos!"
    });
}