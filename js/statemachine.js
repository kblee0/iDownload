function StateMachine() {
    this.states = {};
    this._current = void 0
}

StateMachine._restricted_event = /^__.*__$/;
StateMachine.prototype.start = function (a) {
    if (void 0 !== this._current) throw "State machine already started";
    if (void 0 === a || null === a) throw "Please give a valid state name";
    setTimeout(StateMachine._changeState, 0, this, a)
};
StateMachine.prototype.fireEvent = function (a, b) {
    if (void 0 === this._current) throw "State machine not started";
    if (null === this._current) throw "State machine terminated";
    if (StateMachine._restricted_event.test(a)) throw 'Firing event "' + a + '" is not allowed';
    setTimeout(StateMachine._handleEvent, 0, this, a, b)
};
StateMachine._changeState = function (a, b) {
    if (null !== b && !a.states.hasOwnProperty(b)) throw a._current = null, 'No such state "' + b + '"';
    var c = a._current;
    void 0 !== c && c.hasOwnProperty("__exit__") && c.__exit__.apply(a);
    null === b ? a._current = null : (c = a._current = a.states[b], c.hasOwnProperty("__enter__") && (c = c.__enter__.apply(a), void 0 !== c && setTimeout(StateMachine._changeState, 0, a, c)))
};
StateMachine._handleEvent = function (a, b, c) {
    b = a._current[b];
    "function" == typeof b && (b = b.apply(a, c));
    void 0 !== b && setTimeout(StateMachine._changeState, 0, a, b)
};
