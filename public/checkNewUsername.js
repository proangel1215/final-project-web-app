window.addEventListener("load", function () {

    const usernameInput = document.querySelector("#txtUsername");
    const submitButton = document.querySelector("#submitButton");
    const usernameMessage = document.querySelector("#usernameMessage");

    const currentUsername = usernameInput.value;
    let validUsername;

    usernameInput.addEventListener("change", async function() {
        usernameMessage.innerHTML = "";
        validUsername = true;
        submitButton.disabled = true;

        const usernameEntry = usernameInput.value;
        const usernames = await getUsernames();

        for (let i = 0; i < usernames.length; i++) {
            if (usernameEntry == usernames[i].username && usernameEntry != currentUsername) {
                usernameMessage.innerHTML = "This username is already taken.";
                validUsername = false;
            }
        };
        if (validUsername) {
            submitButton.disabled = false;
        }
    });

    async function getUsernames() {
        const response = await fetch(`./usernames`);
        const reponseObject = await response.json();
        return reponseObject;
    };
});