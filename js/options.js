(function () {
    function d(a) {
        for (var c in modifiers) if (c == a.keyIdentifier) {
            a.preventDefault();
            return
        }
        c = new Shortcut(a);
        b.shortcut.innerText = c.toString();
        chrome.storage.sync.set({shortcut: c._data});
        a.preventDefault();
        document.removeEventListener("keydown", d, !0)
    }

    function e(a, c) {
        console.log(a);
        if ("sync" == c && a.hasOwnProperty("shortcut")) {
            var d = new Shortcut(a.shortcut.newValue);
            b.shortcut.innerText = d.toString()
        }
    }

    var b = null;
    document.addEventListener("DOMContentLoaded", function () {
        b = document.forms.sc_form;
        b.shortcut.addEventListener("click",
            function () {
                b.shortcut.innerHTML = "Please set a shortcut...";
                document.addEventListener("keydown", d, !0)
            });
        b.shortcut_clear.addEventListener("click", function () {
            chrome.storage.sync.remove("shortcut")
        });
        chrome.storage.sync.get(null, function (a) {
            b.shortcut.innerText = (new Shortcut(a.shortcut)).toString()
        });
        chrome.storage.onChanged.addListener(e)
    })
})();
