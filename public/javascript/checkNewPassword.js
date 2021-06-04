window.addEventListener("load", function () {

    const passwordInput = document.querySelector("#txtNewPassword");
    const confirmPasswordInput = document.querySelector("#txtConfirmNewPassword");
    const submitButton = document.querySelector("#submitButton");

    const confirmPasswordMessage = document.querySelector("#confirmPasswordMessage");

    submitButton.disabled = true;

    let validPassword;

    passwordInput.addEventListener("change", checkPasswords);
    confirmPasswordInput.addEventListener("change", checkPasswords);
    
    function checkPasswords() {
        confirmPasswordMessage.innerHTML = "";
        validPassword = true;
        submitButton.disabled = true;

        const passwordEntry = passwordInput.value;
        const confirmPasswordEntry = confirmPasswordInput.value;

        if (passwordEntry != confirmPasswordEntry) {
            confirmPasswordMessage.innerHTML = "Passwords do not match. Please enter the same password."
            validPassword = false;
        }
        if (validPassword) {
            submitButton.disabled = false;
        }
    };
});