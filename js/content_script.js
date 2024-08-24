(function () {
    function d() {
        void 0 !== window.uSelect_iDownload ? uSelect_iDownload.toggle() : chrome.runtime.sendMessage({__req__: "inject"}, function () {
            uSelect_iDownload.toggle()
        })
    }

    function e(a) {
        b.isEmpty() ? console.log("EPIC FAILURE: This should not happen!") : b.matches(a) && (d(), a.preventDefault(), a.stopPropagation())
    }

    chrome.runtime.onMessage.addListener(function (a) {
        switch (a) {
            case "toggle":
                d()
        }
    });
    var b = new Shortcut, c = !1;
    chrome.storage.onChanged.addListener(function (a, d) {
        "sync" == d && a.hasOwnProperty("shortcut") &&
        (b.set(a.shortcut.newValue), b.isEmpty() && c ? (window.removeEventListener("keydown", e, !0), c = !1) : c || (window.addEventListener("keydown", e, !0), c = !0))
    });
    chrome.storage.sync.get("shortcut", function (a) {
        b.set(a.shortcut);
        b.isEmpty() || (window.addEventListener("keydown", e, !0), c = !0)
    })
})();
