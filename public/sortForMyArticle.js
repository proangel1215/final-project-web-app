async function getSort(sortBy) {

// fetch sorted articles from the server
    let articlesJsonString = await fetch(`./my-sorted-articles?sortBy=${sortBy}`);
    const articlesJsonObject = await articlesJsonString.json();  

// fetch avatars for all users
    let usersJsonString = await fetch(`./avatars`);
    const usersJsonObject = await usersJsonString.json();

// retrieve the articleContainer div and remove all elements from within it
    const articleContainer = document.querySelector(".articleContainer"); 
    articleContainer.innerHTML = "";

// iterate through the articles, creating a card for each one
    for (let i = 0; i < articlesJsonObject.length; i++){

        const articleCardDiv = document.createElement("div");
        articleCardDiv.id = `${articlesJsonObject[i].id}`;
        articleCardDiv.setAttribute("class", "articleCard");

        let userImage;

        for (j = 0; j < usersJsonObject.length; j++) {
            if (articlesJsonObject[i].userID == usersJsonObject[j].id) {
                userImage = usersJsonObject[j].imageSource;
            }
        };

        articleCardDiv.innerHTML = `<h3>${articlesJsonObject[i].title}</h3> 
                                    <p>Posted by <strong>${articlesJsonObject[i].username}</strong> on ${articlesJsonObject[i].postTime} </p>
                                    <img src="/avatars/${userImage}">`;

        articleCardDiv.addEventListener("click", function() {
            location = `./read-article?articleID=${articleCardDiv.id}`;
        });

        articleContainer.appendChild(articleCardDiv);
    }

}; 





