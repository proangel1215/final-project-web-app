window.addEventListener("load", function () {

    const usernameInput = document.querySelector("#txtUsername");
    const passwordInput = document.querySelector("#txtPassword");
    const confirmPasswordInput = document.querySelector("#confirmPassword");
    const submitButton = document.querySelector("#submitButton");

    const usernameMessage = document.querySelector("#usernameMessage");
    const confirmPasswordMessage = document.querySelector("#confirmPasswordMessage");

    submitButton.disabled = true;

    let validUsername;
    let validPassword;


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


    async function getUsernames() {
        const response = await fetch(`./usernames`);
        const reponseObject = await response.json();
        return reponseObject;
    };
    
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