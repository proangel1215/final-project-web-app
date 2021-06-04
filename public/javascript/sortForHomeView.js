/**
 * This function is called in the home view when a sort button is clicked.
 * It retrieves all articles sorted according to the sortBy criteria passed
 * to it, and creates the article cards for those articles.
 */
async function getSort(sortBy) {

// Fetch sorted articles from the server
    let articlesJsonString = await fetch(`./articles?sortBy=${sortBy}`);
    const articlesJsonObject = await articlesJsonString.json();  

// Fetch avatars for all users from the server
    let usersJsonString = await fetch(`./avatars`);
    const usersJsonObject = await usersJsonString.json();

// Retrieve the articleContainer div and remove all elements from within it
    const articleContainer = document.querySelector(".articleContainer"); 
    articleContainer.innerHTML = "";

/**
 * Iterate through the articles, creating a card for each one and appending it to a new div.
 * Append this new div to the articleContainer div.
 */
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

        articleCardDiv.innerHTML = `<div class="articleSummary">
                                        <h3>${articlesJsonObject[i].title}</h3> 
                                        <p>Posted by <strong>${articlesJsonObject[i].username}</strong> on ${articlesJsonObject[i].postTime} </p>
                                    </div>
                                    <div class="authorAvatars">
                                        <img src="/avatars/${userImage}">
                                    </div>`;

        articleCardDiv.addEventListener("click", function() {
            location = `./read-article?articleID=${articleCardDiv.id}`;
        });

        articleContainer.appendChild(articleCardDiv);
    };
}; 





