function getShortcut() {
    try {
        window.localStorage.getItem("shortcut")
    } catch (a) {
    }
    return {keyCode: 83, altKey: !0}
}

function setShortcut(a) {
    window.localStorage.setItem("shortcut", a)
}