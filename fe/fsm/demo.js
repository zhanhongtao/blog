function request(...args) {
  return new Promise(resolve => {
    setTimeout(() => resolve(args), (1 + Math.random() * 4)  * 1000)
  })
}

var stateList = [
  { cmd: 'x', from: 0, to: 1 },
  { cmd: 'y', from: 1, to: 2 },
  { cmd: 'z', from: 2, to: 3 },
  { cmd: '0', from: 3, to: 4 },
  { cmd: 'step', from: 0, to: 1 },
  { cmd: 'step', from: 1, to: 2 },
  { cmd: 'step', from: 2, to: 3 },
  { cmd: 'step', from: 3, to: 4 },
  { cmd: 'reset', from: '*', to: 0 },
  { cmd: 'gotofirst', from: [2, 3], to: 1 }
]

var stateMap = {
  0: {
    state: 0,
    enter: function (done) {
      return request(0).then(() => {
        done('step')
      })
    }
  },
  1: {
    state: 1,
    enter: function (done) {
      for (let i = 0; i < 10; ++i) {
        request(1).then(() => {
          done('step', `1-${i}`)
        })
      }
    }
  },
  2: {
    state: 2,
    enter: function (done) {
      return request(2).then(() => {
        done('step')
      })
    }
  },
  3: {
    state: 3,
    enter: function (done) {
      return request(3).then(() => {
        done('step')
      })
    }
  },
  4: {
    state: 4,
    enter: function () {
      console.log('@complete!')
    }
  }
}

var instance = fsm({
  defaultState: 0,
  relationship: stateList,
  onenter: function (next) {
    let task = stateMap[this.state]
    if (task && 'function' === typeof task.enter) {
      task.enter(next)
    }
  },
  onaftertransition: function ({from, to, input}) {
    console.log(`from: ${from}, to: ${to}, input: ${input}`)
  }
})
