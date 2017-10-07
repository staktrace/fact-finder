"use strict";

function onError(error) {
    console.error(`Error: ${error}`);
}

function submitCollection(response) {
    if (response.selection.length == 0) {
        console.log("No selection found");
        return;
    }
    if (response.context.length < response.selection.length) {
        console.log("Context length was less than selection length!");
        return;
    }

    // TODO: submit response via XHR?
}

function requestCollection(tabs) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, { type: "collect" }).then(submitCollection).catch(onError);
    }
}

browser.browserAction.onClicked.addListener(function() {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(requestCollection).catch(onError);
});
