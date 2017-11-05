function repeat(times, delay, req) {
  let timer
  let promise = new Promise((resolve, reject) => {
    (function repeat(time, times) {
      if (time < times) {
        req().then((...args) => {
          resolve(...args)
        }).catch(() => {
          timer = setTimeout(() => {
            repeat(++time, times)
          }, delay * 1000)
        })
      } else {
        reject()
      }
    })(0, times)
  })
  promise.clear = () => {
    clearTimeout(timer)
    return promise
  }
  return promise
}