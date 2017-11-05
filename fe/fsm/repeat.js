function repeat(times, req, next) {
  return (...args) => new Promise((resolve, reject) => (function repeat(time, times) {
    if (time <= times) {
      req(...args, time).then(resolve).catch(e => next(e, time, times, () => repeat(++time, times)))
    } else {
      reject(new Error('maxTimes'))
    }
  })(1, times))
}
