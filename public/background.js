function logURL(requestDetails) {
    console.log("Loading: " + requestDetails.url);
    console.log("Document Url: " + requestDetails.documentUrl);
}

browser.webRequest.onBeforeRequest.addListener(
    logURL,
    {urls: ["<all_urls>"]}
);

browser.browserAction.onClicked.addListener(function() {
    var creating = browser.tabs.create({
        url:"index.html"
    });
    creating.then(onCreated, onError);
});