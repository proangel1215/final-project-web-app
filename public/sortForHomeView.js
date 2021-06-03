async function getSort(sortBy) {

// fetch sorted articles from the server
    let response = await fetch(`./articles?sortBy=${sortBy}`);
    const articleJsonObject = await response.json();  

// retrieve the articleContainer div and remove all elements from within it
    const articleContainer = document.querySelector(".articleContainer"); 
    articleContainer.innerHTML = "";

// iterate through the articles, creating a card for each one
    for (let i = 0; i < articleJsonObject.length; i++){
    //     const articleRow = document.createElement("tr"); 
    //     articleTable.appendChild(articleRow); 
    //     const articleTitle = document.createElement("td"); 
    //     articleTitle.innerHTML = "<a href='./read-article?articleID=" + articleJsonObject[i].id + "'>" + articleJsonObject[i].title + "</a>"; 
    //     const articleAuthor = document.createElement("td");
    //     articleAuthor.innerHTML = articleJsonObject[i].username; 
    //     const articleTime = document.createElement("td"); 
    //     articleTime.innerHTML = articleJsonObject[i].postTime;
    //     articleRow.appendChild(articleTitle);articleRow.appendChild(articleAuthor);articleRow.appendChild(articleTime); 

        const articleCardDiv = document.createElement("div");
        articleCardDiv.id = `${articleJsonObject[i].id}`;
        articleCardDiv.setAttribute("class", "articleCard");
        articleCardDiv.innerHTML = `<h3>${articleJsonObject[i].title}</h3> <p>Posted by <strong>${articleJsonObject[i].username}</strong> on ${articleJsonObject[i].postTime} </p>`;
        articleContainer.appendChild(articleCardDiv);
    }
}; 





