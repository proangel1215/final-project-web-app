async function getSort(sortBy) {
    let response = await fetch(`/articles?sortBy=${sortBy}`);
    articleJsonObject = await response.json(); 

    const articleTable = document.getElementById("articleTable"); 
    for (var i = 0; i < articleJsonObject.length; i++){
    const articleRow = document.createElement("tr"); 
    articleTable.appendChild(articleRow); 
    const articleTitle = document.createElement("td"); 
    articleTitle.innerHTML = articleJsonObject[i].title; 
    const articleAuthor = document.createElement("td");
    articleAuthor.innerHTML = "Author undefined"; 
    const articleTime = document.createElement("td"); 
    articleTime.innerHTML = articleJsonObject[i].postTime;
    articleRow.appendChild(articleTitle);articleRow.appendChild(articleAuthor);articleRow.appendChild(articleTime); 
}
}; 





