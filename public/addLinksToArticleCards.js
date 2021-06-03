window.addEventListener("load", function () {

    const articles = this.document.querySelectorAll(".articleCard");
    console.log(articles);

    for (i = 0; i < articles.length; i++) {
        const id = articles[i].id;
        console.log(id);

        articles[i].addEventListener("click", function() {
            location = `./read-article?articleID=${id}`;
        });
    };

});