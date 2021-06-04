/** On window load, disable the submit button, and only enable it
 * once the user has entered matching passwords
 */
window.addEventListener("load", function () {

    const passwordInput = document.querySelector("#txtNewPassword");
    const confirmPasswordInput = document.querySelector("#txtConfirmNewPassword");
    const submitButton = document.querySelector("#submitButton");

    const confirmPasswordMessage = document.querySelector("#confirmPasswordMessage");

    // Disables the submit button initially
    submitButton.disabled = true;

    let validPassword;

    passwordInput.addEventListener("change", checkPasswords);
    confirmPasswordInput.addEventListener("change", checkPasswords);
    
    /** 
     * Checks if the passwords entered in the two password fields
     * are matching. If they don't, the submit button remains disabled
     * and a warning message is displayed.
     */
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