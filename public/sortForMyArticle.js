async function getSort(sortBy) {

// fetch sorted articles from the server
    let response = await fetch(`./my-sorted-articles?sortBy=${sortBy}`);
    const articleJsonObject = await response.json();  

// retrieve the articleContainer div and remove all elements from within it
    const articleContainer = document.querySelector(".articleContainer"); 
    articleContainer.innerHTML = "";


// iterate through articles 
    for (let i = 0; i < articleJsonObject.length; i++){

        const articleCardDiv = document.createElement("div");
        articleCardDiv.id = `${articleJsonObject[i].id}`;
        articleCardDiv.setAttribute("class", "articleCard");
        articleCardDiv.innerHTML = `<h3>${articleJsonObject[i].title}</h3> <p>Posted by <strong>${articleJsonObject[i].username}</strong> on ${articleJsonObject[i].postTime} </p>`;

        articleCardDiv.addEventListener("click", function() {
            location = `./read-article?articleID=${articleCardDiv.id}`;
        });

        articleContainer.appendChild(articleCardDiv);
    }

}; 





