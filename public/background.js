let originUrls = [];
let requestDetailsUrls = [];

function logTracker(requestDetails) {
    if (requestDetails.originUrl !== null && requestDetails.url !== null) {
        originUrls.push(requestDetails.originUrl);
        requestDetailsUrls.push(requestDetails.url);
    }
}

function sendTrackersToBackend(){
    let jsonBody = JSON.stringify({
        originalDomains: originUrls,
        trackingDomains: requestDetailsUrls
    });

    originUrls = [];
    requestDetailsUrls = [];

    fetch("http://localhost:8080/addDomains", {
        method: 'POST',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: jsonBody
    });

    console.log("making a request with body" + jsonBody)
}

setInterval(sendTrackersToBackend, 30000);

browser.webRequest.onBeforeRequest.addListener(
    logTracker,
    {urls: ["<all_urls>"]}
);

browser.browserAction.onClicked.addListener(function () {
    var creating = browser.tabs.create({
        url: "index.html"
    });
    creating.then(onCreated, onError);
});