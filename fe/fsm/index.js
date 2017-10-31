function fsm(config) {
  if (!(this instanceof fsm)) return new fsm(config)
  this.relationship = config.relationship
  this.state = config.defaultState
  this.statetimestamp = 0
  let noop = function () {}
  ;[
    'onenter',
    'onbeforetransition',
    'onaftertransition',
  ].forEach(e => {
    this[e] = 'function' === typeof config[e] ? config[e] : noop
  })
  if (this.state !== null) {
    this.onenter(createUsefulTransition(this))
    this.onaftertransition({ from: null, to: this.state, input: '' })
  }
}

function createUsefulTransition(context) {
  let { state, statetimestamp: timestamp } = context
  return (function (cmd, ...args) {
    if (this.state === state && this.statetimestamp <= timestamp) {
      this.transition(cmd)
    }
  }).bind(context)
}

fsm.prototype.transition = function (cmd) {
  let nextItem = this.next(cmd)
  if (nextItem) {
    let previousstate = this.state
    this.onbeforetransition({ from: previousstate, to: nextItem.to, input: cmd })
    this.state = nextItem.to
    this.statetimestamp = Date.now()
    this.onenter(createUsefulTransition(this))
    this.onaftertransition({ from: previousstate, to: this.state, input: cmd })
  }
}

fsm.prototype.next = function (cmd) {
  let nextItem = null
  let currentstate = this.state
  let relationship = this.relationship
  for (let i = 0, l = relationship.length; i < l; ++i) {
    let stateItem = relationship[i]
    let from = stateItem.from
    if (
      stateItem.cmd === cmd && (
        from === currentstate ||
        from === '*' ||
        ( Array.isArray(from) && from.indexOf(currentstate) > -1 )
      )
    ) {
      nextItem = stateItem
      break
    }
  }
  return nextItem
}
