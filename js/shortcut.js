var fields = {
    ctrlKey: void 0,
    altKey: void 0,
    altGraphKey: void 0,
    shiftKey: void 0,
    metaKey: void 0,
    keyIdentifier: void 0
}, modifiers = {Control: void 0, Alt: void 0, Meta: void 0, Shift: void 0};

function Shortcut(a) {
    this._data = {};
    for (var b in fields) this._data[b] = null;
    this.set(a)
}

Shortcut.prototype.matches = function (a) {
    for (var b in fields) if (!a.hasOwnProperty(b) || this._data[b] != a[b]) return !1;
    return !0
};
Shortcut.prototype.clear = function () {
    for (var a in fields) this._data[a] = void 0
};
Shortcut.prototype.isEmpty = function () {
    for (var a in fields) if (null != this._data[a]) return !1;
    return !0
};
Shortcut.prototype.set = function (a) {
    if (void 0 === a || null === a) this.clear(); else for (var b in fields) a.hasOwnProperty(b) && (this._data[b] = a[b])
};
Shortcut.prototype.toString = function () {
    if (this.isEmpty()) return chrome.i18n.getMessage("shortcut_empty");
    var a = [];
    this._data.ctrlKey && a.push("Ctrl");
    this._data.altKey && a.push("Alt");
    this._data.altGraphKey && a.push("AltGr");
    this._data.shiftKey && a.push("Shift");
    this._data.metaKey && a.push("Meta");
    var b = this._data.keyIdentifier;
    void 0 != b && (0 == b.indexOf("U+") ? (b = parseInt(b.slice(2), 16), 27 == b ? a.push("Esc") : a.push(String.fromCharCode(b))) : a.push(this._data.keyIdentifier));
    return a.join("+")
};
