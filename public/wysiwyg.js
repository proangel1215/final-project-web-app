
async function getNewArticleContent() {
    const newArticleContent = tinymce.get("newArticleContent").getContent();
    return newArticleContent;
};

//store as a string in the database - innerHTML