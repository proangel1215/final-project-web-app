tinymce.init({
    selector: '#newArticle',
    menubar: false,
    plugins: 'autoresize lists save emoticons wordcount',
    autoresize_bottom_margin: 50,
    toolbar: 'undo redo | styleselect | forecolor | bold italic underline | numlist bullist | emoticons | wordcount | save',
    images_file_types: 'jpeg,jpg,png,gif'
    });