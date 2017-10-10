"use strict";

let pairCount = -1;

function onError(error) {
    console.error(`Error: ${error}`);
}

function readPairCount(data) {
    pairCount = Number(data.pairCount);
}

function incrementPairCount() {
    pairCount++;
    browser.storage.local.set({
        "pairCount": pairCount
    }).then(null).catch(onError);
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

    console.log("Collecting [" + JSON.stringify(response) + "]");
    let data = {};
    data["data" + pairCount] = response;
    browser.storage.local.set(data).then(incrementPairCount).catch(onError);
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

browser.storage.local.get({"pairCount": 0}).then(readPairCount).catch(onError);
