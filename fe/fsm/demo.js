function request(...args) {
  return new Promise(resolve => {
    setTimeout(() => resolve(args), (1 + Math.random() * 4)  * 1000)
  })
}

var states = []
var stateList = [
  { cmd: 'reset', from: '*', to: 0 }
]

for (let i = 0, l = 10; i < l; ++i) {
  states.push({
    enter: function (done) {
      console.log(`enter: ${this.state}`)
      request().then(() => {
        done('forward')
      })
    },
    leave: function ({ from }) {
      console.log(`leave: ${from}`)
    }
  })
  stateList.push({
    cmd: `go--${i}`,
    from: '*',
    to: i
  }, {
    cmd: 'back',
    from: i,
    to: i - 1 < 0 ? l : i - 1
  }, {
    cmd: 'forward',
    from: i,
    to: i + 1 === l ? 0 : i + 1
  })
}

var instance = new FSM({
  defaultState: 0,
  relationship: stateList,
  onbeforetransition: function (...args) {
    let task = states[this.state]
    if (task && 'function' === typeof task.leave) {
      task.leave.call(this, ...args)
    }
  },
  onenter: function (next) {
    let task = states[this.state]
    if (task && 'function' === typeof task.enter) {
      task.enter.call(this, next)
    }
  }
})
