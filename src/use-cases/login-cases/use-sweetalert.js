function errorMessage(description) {
    Swal.fire({
        title: "Error",
        text: description,
        icon: "error",
        confirmButtonColor: "#000000",
    });
}

function successMessage(description) {
    Swal.fire({
        title: "success",
        text: description,
        icon: "success",
        confirmButtonColor: "#000000",
    });
}

async function inputCode() {
    const { value: formValues } = await Swal.fire({
        title: "verifique seu endereço de email",
        html: `
              <input placeholder="_ _ _ _ _ _" id="swal-input1" class="swal2-input">
            `,
        focusConfirm: false,
        confirmButtonColor: "#000000",
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
            ];
        }
    });

    return formValues;
}