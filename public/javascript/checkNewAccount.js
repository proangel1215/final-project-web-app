/** On window load, disable the submit button, and only enable it
 * once the user has entered both a valid username (i.e. not already
 * taken) and matching passwords
 */
window.addEventListener("load", function () {

    const usernameInput = document.querySelector("#txtUsername");
    const passwordInput = document.querySelector("#txtPassword");
    const confirmPasswordInput = document.querySelector("#confirmPassword");
    const submitButton = document.querySelector("#submitButton");

    const usernameMessage = document.querySelector("#usernameMessage");
    const confirmPasswordMessage = document.querySelector("#confirmPasswordMessage");

    // Disables the submit button
    submitButton.disabled = true;

    let validUsername;
    let validPassword;


    // Checks if the username is valid each time the user inputs a username
    usernameInput.addEventListener("change", async function() {
        usernameMessage.innerHTML = "";
        validUsername = true;
        submitButton.disabled = true;

        const usernameEntry = usernameInput.value;
        const usernames = await getUsernames();

        for (let i = 0; i < usernames.length; i++) {
            if (usernameEntry == usernames[i].username) {
                usernameMessage.innerHTML = "This username is already taken.";
                validUsername = false;
            }
        };
        if (validUsername && validPassword) {
            submitButton.disabled = false;
        }
    });


    passwordInput.addEventListener("change", checkPasswords);
    confirmPasswordInput.addEventListener("change", checkPasswords);


    // Retrieves all usernames from the database
    async function getUsernames() {
        const response = await fetch(`./usernames`);
        const reponseObject = await response.json();
        return reponseObject;
    };
    
    /** 
     * Checks if the passwords entered in the two password fields
     * are matching, and enables the submit button if they do. If not,
     * the submit button remains disabled and a warning message is displayed.
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
        if (validUsername && validPassword) {
            submitButton.disabled = false;
        }
    };
});