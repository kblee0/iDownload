function req_action_handler(a, b, c) {
    var d = a.urls, a = a.action;
    if ("window" == a) chrome.windows.create({url: d}); else switch (a) {
        case "download":
            chrome.tabs.create({url: "chrome://downloads", selected: !0, openerTabId: b.tab.id}, c);
            break;
        case "tabs":
            d.forEach(function (a) {
                chrome.tabs.create({url: a, selected: !1, openerTabId: b.tab.id})
            })
    }
    return !0
}

function req_inject_handler(a, b, c) {
    chrome.scripting.executeScript({
        target: {tabId: b.tab.id},
        files: ["js/statemachine.js"],
    }, function () {
        chrome.scripting.executeScript({
            target: {tabId: b.tab.id},
            files: ["js/overlay.js"],
        }, function () {
            null != c && c()
        })
    });
    return !0
}

chrome.runtime.onMessage.addListener(function (a, b, c) {
    switch (a.__req__) {
        case "inject":
            return req_inject_handler(a, b, c);
        case "action":
            return req_action_handler(a, b, c);
        default:
            console.log("Unknown message")
    }
});
chrome.action.onClicked.addListener(function (a) {
    if(a.url.search(/(http:\/\/|https:\/)/) === 0)
        chrome.tabs.sendMessage(a.id, "toggle");
});
