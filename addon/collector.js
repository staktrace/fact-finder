"use strict";

function depth(node) {
    var depth = 0;
    while (node.parentNode) {
        node = node.parentNode;
        depth++;
    }
    return depth;
}

function commonAncestor(node1, node2) {
    if (!node1 || !node2) {
        return null;
    }
    var depth1 = depth(node1);
    var depth2 = depth(node2);
    while (depth1 > depth2) {
        node1 = node1.parentNode;
        depth1--;
    }
    while (depth2 > depth1) {
        node2 = node2.parentNode;
        depth2--;
    }
    while (node1 != node2) {
        node1 = node1.parentNode;
        node2 = node2.parentNode;
    }
    return node1;
}

function blockAncestor(node) {
    while (node) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            if (window.getComputedStyle(node).display == "block") {
                break;
            }
        }
        node = node.parentNode;
    }
    return node;
}

function textContent(node) {
    return node ? node.textContent : "";
}

function handleRequest(request) {
    var response = {};
    switch (request.type) {
        case "collect":
            var selection = window.getSelection();
            response.selection = selection.toString().trim();
            response.context = textContent(blockAncestor(commonAncestor(selection.focusNode, selection.anchorNode)));
            break;
    }
    return Promise.resolve(response);
}

browser.runtime.onMessage.addListener(handleRequest);
