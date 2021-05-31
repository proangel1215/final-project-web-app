async function getSort(sortBy) {
    let response = await fetch(`./articles?sortBy=${sortBy}`);
    const articleJsonObject = await response.json();  
// add a new div within the article container 
    const articleContainer = document.querySelector(".articleContainer"); 
    articleContainer.innerHTML = "";
    const articleDiv = document.createElement("div"); 
    articleContainer.appendChild(articleDiv); 
// create table and tds
    const articleTable = document.createElement("table"); 
    articleDiv.appendChild(articleTable); 
    const thRow = document.createElement("tr"); 
    articleTable.appendChild(thRow); 
    const tdTitle = document.createElement("td"); 
    tdTitle.innerHTML = "Title"; 
    const tdAuthor = document.createElement("td"); 
    tdAuthor.innerHTML = "Author"; 
    const tdDate = document.createElement("td"); 
    tdDate.innerHTML = "Posted on"; 
    thRow.appendChild(tdTitle); thRow.appendChild(tdAuthor); thRow.appendChild(tdDate);
// iterate through articles 
    for (var i = 0; i < articleJsonObject.length; i++){
    const articleRow = document.createElement("tr"); 
    articleTable.appendChild(articleRow); 
    const articleTitle = document.createElement("td"); 
    articleTitle.innerHTML = "<a href='./read-article?articleID=" + articleJsonObject[i].id + "'>" + articleJsonObject[i].title + "</a>"; 
    const articleAuthor = document.createElement("td");
    articleAuthor.innerHTML = articleJsonObject[i].username; 
    const articleTime = document.createElement("td"); 
    articleTime.innerHTML = articleJsonObject[i].postTime;
    articleRow.appendChild(articleTitle);articleRow.appendChild(articleAuthor);articleRow.appendChild(articleTime); 
}

}; 





