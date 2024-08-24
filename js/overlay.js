var uSelect_iDownload;
(function () {
    function i() {
        this._invertedSelection = !1;
        this._hideKeyCode = 72;
        this._curpos = {x: 0, y: 0};
        this._selectableElements = [];
        this._visibleElements = [];
        var a = this, c = document.createElement("div");
        c.id = CSS.ids.overlay;
        var d = document.createElement("div");
        d.id = CSS.ids.glass;
        var e = document.createElement("div");
        e.id = CSS.ids.help;
        e.innerHTML = chrome.i18n.getMessage("usage");
        e.onmouseover = function () {
            e.classList.add(CSS.classes.invisible)
        };
        e.onmouseout = function () {
            e.classList.remove(CSS.classes.invisible)
        };
        var g =
            function (a) {
                a.preventDefault();
                a.stopPropagation()
            }, f = function (b) {
            a._curpos.x = b.clientX;
            a._curpos.y = b.clientY
        }, h = null, j = function (a) {
            g(a)
        }, n = function (b) {
            f(b);
            a.sm.fireEvent("mousemove")
        }, l = function (b) {
            if (!(null !== h || 0 != b.button && 2 != b.button)) {
                h = 0 == b.button ? b.ctrlKey ? 1 : 0 : 2;
                switch (h) {
                    case 0:
                        f(b);
                        a.sm.fireEvent("mousedown");
                        break;
                    case 1:
                    case 2:
                        f(b), a.sm.fireEvent("alt_mousedown")
                }
                g(b)
            }
        }, i = function (b) {
            if (!(null === h || b.button != h && 0 != b.button && 1 != h)) {
                switch (b.button) {
                    case 0:
                        f(b);
                        a.sm.fireEvent(1 == h ? "alt_mouseup" :
                            "mouseup");
                        break;
                    case 2:
                        f(b), a.sm.fireEvent("alt_mouseup")
                }
                h = null;
                g(b)
            }
        }, m = function (b) {
            switch (b.keyCode) {
                case 13:
                    b.altKey ? a.sm.fireEvent("req_download") : b.shiftKey ? a.sm.fireEvent("req_window") : a.sm.fireEvent("req_tabs");
                    break;
                case a._hideKeyCode:
                    a.sm.fireEvent("hide_key_down");
                    break;
                case 27:
                    a.sm.fireEvent("req_exit");
                    break;
                default:
                    return
            }
            g(b)
        }, q = function (b) {
            switch (b.keyCode) {
                case a._hideKeyCode:
                    a.sm.fireEvent("hide_key_up");
                    break;
                default:
                    return
            }
            g(b)
        }, r = function () {
            var b = null, c = function () {
                b = null;
                a.updateVisibleElements()
            };
            return function () {
                null !== b && clearTimeout(b);
                b = setTimeout(c, 100)
            }
        }(), s = function () {
            var b = null, c = function () {
                b = null;
                a.updateVisibleElements()
            };
            return function () {
                null !== b && clearTimeout(b);
                b = setTimeout(c, 100)
            }
        }();
        document.addEventListener("contextmenu", j);
        document.addEventListener("scroll", s);
        window.addEventListener("resize", r);
        document.addEventListener("keydown", m, !0);
        document.addEventListener("keyup", q, !0);
        document.body.addEventListener("mousedown", l, !0);
        document.body.addEventListener("mouseup", i, !0);
        var k = new StateMachine;
        k.states.load = {
            __enter__: function () {
                document.documentElement.classList.add(CSS.classes.loading);
                document.body.appendChild(c);
                document.body.appendChild(d);
                document.body.appendChild(e);
                c.addEventListener("webkitTransitionEnd", function () {
                    c.removeEventListener("webkitTransitionEnd", arguments.callee);
                    a.sm.fireEvent("load_done")
                });
                setTimeout(function () {
                    a.populate();
                    a.updateVisibleElements();
                    document.documentElement.classList.remove(CSS.classes.loading)
                }, 0)
            }, load_done: "idle"
        };
        k.states.exit =
            {
                __enter__: function () {
                    document.removeEventListener("mousemove", n);
                    document.removeEventListener("scroll", s);
                    window.removeEventListener("resize", r);
                    document.removeEventListener("contextmenu", j);
                    document.removeEventListener("keydown", m, !0);
                    document.removeEventListener("keyup", q, !0);
                    document.body.removeEventListener("mousedown", l, !0);
                    document.body.removeEventListener("mouseup", i, !0);
                    a._selectableElements.forEach(function (a) {
                        a._private.delegate.classList.remove(CSS.classes.selected);
                        a._private.delegate.classList.remove(CSS.classes.relative);
                        delete a._private
                    });
                    c.addEventListener("webkitTransitionEnd", function () {
                        c.removeEventListener("webkitTransitionEnd", arguments.callee);
                        document.body.removeChild(e);
                        document.body.removeChild(d);
                        document.body.removeChild(c);
                        document.documentElement.classList.remove(CSS.classes.exiting);
                        a.sm.fireEvent("exit_done")
                    });
                    document.documentElement.classList.add(CSS.classes.exiting)
                }, __exit__: function () {
                    uSelect_iDownload.instance = null
                }, exit_done: null
            };
        k.states.idle = {
            mousedown: "selection",
            alt_mousedown: "deselection",
            req_exit: "exit",
            req_tabs: "action-tabs",
            req_window: "action-window",
            req_download: "action-download",
            hide_key_down: "hidden"
        };
        var o = null, p = null, t = function () {
            var b = document.createElement("div");
            b.classList.add(CSS.classes.selectionRectangle);
            b.style.left = a._curpos.x + "px";
            b.style.top = a._curpos.y + "px";
            a._invertedSelection && b.classList.add(CSS.classes.inverted);
            a._cursel = document.body.appendChild(b);
            a._startpos = {x: a._curpos.x, y: a._curpos.y};
            a._selrect = {x: a._curpos.x, y: a._curpos.y, w: 0, h: 0};
            a._lastDrawn = {};
            o = setInterval(a.drawSelection.bind(a), 30);
            p = setInterval(a.calcSelectedElements.bind(a), 30);
            document.addEventListener("mousemove", n)
        }, u = function () {
            document.removeEventListener("mousemove", n);
            clearInterval(o);
            clearInterval(p);
            p = o = null;
            a.calcSelectedElements();
            for (var b in a._selectableElements) {
                var c = a._selectableElements[b]._private;
                c.selected = c.selected2
            }
            a._cursel.addEventListener("webkitTransitionEnd", function () {
                document.body.removeChild(this)
            }.bind(a._cursel));
            a._cursel.classList.add(CSS.classes.closing);
            delete a._cursel;
            delete a._startpos;
            delete a._selrect;
            delete a._lastDrawn;
            return "idle"
        }, v = function () {
            var b = a._startpos, c = a._curpos, d = a._selrect;
            d.x = Math.min(b.x, c.x);
            d.y = Math.min(b.y, c.y);
            d.w = Math.abs(b.x - c.x);
            d.h = Math.abs(b.y - c.y)
        };
        k.states.selection = {
            __enter__: function () {
                a._invertedSelection = !1;
                t()
            }, mousemove: v, mouseup: u, req_exit: "exit"
        };
        k.states.deselection = {
            __enter__: function () {
                a._invertedSelection = !0;
                t()
            }, mousemove: v, alt_mouseup: u, req_exit: "exit"
        };
        k.states["action-tabs"] = {
            __enter__: function () {
                var b =
                    w(a._selectableElements);
                chrome.runtime.sendMessage({__req__: "action", action: "tabs", urls: b});
                a.sm.fireEvent("done")
            }, done: "exit"
        };
        k.states["action-window"] = {
            __enter__: function () {
                var b = w(a._selectableElements);
                chrome.runtime.sendMessage({__req__: "action", action: "window", urls: b});
                a.sm.fireEvent("done")
            }, done: "exit"
        };
        k.states["action-download"] = {
            __enter__: function () {
                chrome.runtime.sendMessage({__req__: "action", action: "download"}, function () {
                    for (var b = a._selectableElements, c = {}, d = 0; d < b.length; ++d) {
                        var e =
                            b[d];
                        if (e.href && e._private && e._private.selected && !c.hasOwnProperty(e.href)) {
                            c[e.href] = null;
                            var f = document.createEvent("MouseEvent");
                            f.initMouseEvent("click", !1, !1, window, 1, 0, 0, 0, 0, !1, !0, !1, !1, 0, null);
                            e.dispatchEvent(f)
                        }
                    }
                    a.sm.fireEvent("done")
                })
            }, done: "exit"
        };
        k.states.hidden = {
            __enter__: function () {
                document.documentElement.classList.add(CSS.classes.hidden)
            }, __exit__: function () {
                document.documentElement.classList.remove(CSS.classes.hidden);
                a.updateVisibleElements()
            }, hide_key_up: "idle", req_exit: "exit"
        };
        this.sm = k
    }

    function x(a, c) {
        for (var d in a) a[d].classList.add(CSS.classes.selected);
        for (d in c) c[d].classList.remove(CSS.classes.selected)
    }

    function m(a, c) {
        return a.bottom < c.y || c.y + c.h < a.top || a.right < c.x || c.x + c.w < a.left ? !1 : !0
    }

    function w(a) {
        var c = {};
        a.forEach(function (a) {
            a._private.selected && (c[a.href] = null)
        });
        return Object.keys(c)
    }

    CSS = {
        ids: {
            glass: "ileabdhfjmgaognikmjgmhhkjffggejc-glass",
            help: "ileabdhfjmgaognikmjgmhhkjffggejc-help",
            overlay: "ileabdhfjmgaognikmjgmhhkjffggejc-overlay"
        }, classes: {
            closing: "ileabdhfjmgaognikmjgmhhkjffggejc-closing",
            exiting: "ileabdhfjmgaognikmjgmhhkjffggejc-exiting",
            hidden: "ileabdhfjmgaognikmjgmhhkjffggejc-hidden",
            inverted: "ileabdhfjmgaognikmjgmhhkjffggejc-inverted",
            invisible: "ileabdhfjmgaognikmjgmhhkjffggejc-invisible",
            loading: "ileabdhfjmgaognikmjgmhhkjffggejc-loading",
            relative: "ileabdhfjmgaognikmjgmhhkjffggejc-relative",
            selected: "ileabdhfjmgaognikmjgmhhkjffggejc-selected",
            selectionRectangle: "ileabdhfjmgaognikmjgmhhkjffggejc-selection-rectangle"
        }
    };
    i.prototype.populate = function () {
        for (var a = document.links, c = /^javascript:/,
                 d = 0; d < a.length; d++) {
            var e = a[d];
            if (!(void 0 == e.href || c.test(e.href))) {
                var g = e, f = e.getElementsByTagName("img");
                f.length && (g = f[0]);
                e._private = {selected: !1, selected2: !1, delegate: g, positionfix: !1};
                this._selectableElements.push(e)
            }
        }
    };
    i.prototype.updateVisibleElements = function () {
        var a = {x: 0, y: 0, w: window.innerWidth, h: window.innerHeight}, c = this._visibleElements,
            d = this._selectableElements;
        c.splice(0);
        for (var e in d) {
            var g = d[e], f = g._private, h = f.delegate, j = h.getBoundingClientRect();
            m(j, a) && (c.push(g), f.positionfix ||
            (f.positionfix = !0, "static" == window.getComputedStyle(h).position && h.classList.add(CSS.classes.relative)))
        }
    };
    i.prototype.drawSelection = function () {
        var a = this._selrect, c = this._lastDrawn, d = this._cursel.style;
        a.x == c.x && a.y == c.y && a.w == c.w && a.h == c.h || (d.left = (c.x = a.x) + "px", d.top = (c.y = a.y) + "px", d.width = (c.w = a.w) + "px", d.height = (c.h = a.h) + "px")
    };
    i.prototype.calcSelectedElements = function () {
        var a = this._visibleElements, c = this._selrect, d = [], e = [], g;
        for (g in a) {
            for (var f = a[g]._private, h = f.delegate, j = f.delegate.getClientRects(),
                     i = !1, l = 0; l < j.length; l++) if (m(j[l], c)) {
                i = !0;
                break
            }
            j = i ? !this._invertedSelection : f.selected;
            j != f.selected2 && ((j ? d : e).push(h), f.selected2 = j)
        }
        (d || e) && setTimeout(x, 0, d, e)
    };
    uSelect_iDownload = {
        instance: null, toggle: function () {
            null === uSelect_iDownload.instance ? (uSelect_iDownload.instance = new i, uSelect_iDownload.instance.sm.start("load")) : uSelect_iDownload.instance.sm.fireEvent("req_exit")
        }
    }
})();
