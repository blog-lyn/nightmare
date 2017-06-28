// ref:https://github.com/segmentio/nightmare/issues/481
// https://github.com/segmentio/nightmare/issues/854
const _Nightmare = require('nightmare');

const EventEmitter = require('events');
const util = require('util');

const events = [
  'did-finish-load',
  'did-fail-load',
  'did-frame-finish-load',
  'did-start-loading',
  'did-stop-loading',
  'did-get-response-details',
  'did-get-redirect-request',
  'dom-ready',
  'page-favicon-updated',
  'new-window',
  'will-navigate',
  'crashed',
  'plugin-crashed',
  'destroyed',
];

_Nightmare.action('ewait', function(event, cb, done) {
  if (done === undefined) {
    done = cb;
    cb = undefined;
  }

  let result,
    self = this,
    isTimedOut = false,
    tm = null;

  self._proxyEvents.on(event, () => {
    if (isTimedOut) return;

    isTimedOut = true;
    clearTimeout(tm);

    if (typeof cb === 'function') {
      result = Array.prototype.slice.call(arguments);
      result.unshift(null);
      cb.apply(self, result);
    }

    done();
  });

  tm = setTimeout(() => {
    if (isTimedOut) return;

    isTimedOut = true;
    clearTimeout(tm);

    const err = new Error('.ewait() timed out after ' + self.optionWaitTimeout + 'msec');

    if (typeof cb === 'function') {
      cb.call(self, err);
    }

    done(err);
  }, self.optionWaitTimeout);
});

function ProxyEvents() {
  EventEmitter.call(this);
  this._completed = {};
}

util.inherits(ProxyEvents, EventEmitter);

ProxyEvents.prototype.emit = function() {
  const args = Array.prototype.slice.call(arguments);
  this._completed[args[0]] = args.slice(1);
  EventEmitter.prototype.emit.apply(this, arguments);
};

ProxyEvents.prototype.on = function(event, cb) {
  if (this._completed[event] !== undefined) {
    cb.apply(this, this._completed[event]);
    delete this._completed[event];
    return;
  }

  EventEmitter.prototype.on.apply(this, arguments);
};

module.exports = function(options) {
  const nightmare = new _Nightmare(options);

  const _proxyEvents = nightmare._proxyEvents = new ProxyEvents();

  nightmare.on('will-navigate', function() {
    _proxyEvents._completed = {};
  });

  for (let i = 0; i < events.length; i++) {
    (function(i) {
      nightmare.on(events[i], function() {
        const args = Array.prototype.slice.call(arguments);
        _proxyEvents.emit.call(_proxyEvents, events[i], args);
      });
    })(i);
  }

  return nightmare;
};
