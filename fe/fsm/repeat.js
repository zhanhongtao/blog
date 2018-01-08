export default function repeat (times, req, next) {
  return (...args) => new Promise((resolve, reject) => (function _repeat (time, times) {
    if (time <= times) {
      let p = req(...args, time)
      p.then(resolve).catch(uncaughtmessage)
      let n = p.catch(e => next(e, time, times))
      n.then(resolve).catch(uncaughtmessage)
      n.catch(() => _repeat(++time, times))
    } else {
      reject(new Error('maxTimes'))
    }
  })(1, times))
}

function uncaughtmessage (e) {
  if (process.env.development) {
    console.warn(`repeat: ${e.message}`)
  }
}
