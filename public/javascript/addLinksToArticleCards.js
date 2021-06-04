/** On window load, retrieve all article cards and
 * iterate through them, adding an event listener to each card
 * which when clicked, will take the user to the associated
 * article using the article id
 */
window.addEventListener("load", function () {

    const articles = this.document.querySelectorAll(".articleCard");

    for (i = 0; i < articles.length; i++) {
        const id = articles[i].id;

        articles[i].addEventListener("click", function() {
            location = `./read-article?articleID=${id}`;
        });
    };

});