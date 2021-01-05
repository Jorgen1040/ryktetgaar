function copyLink() {
    var copyText = document.getElementById("link");
    var range = document.createRange();

    window.getSelection().removeAllRanges();
    range.selectNode(copyText);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    // Add tooltip to confirm link is copied
}
