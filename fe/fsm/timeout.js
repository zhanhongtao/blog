function defineTimeout (timeout, f) {
  return (...args) => new Promise((resolve, reject) => {
    let timer
    let completed = false
    f(...args).then(response => {
      if (!completed) {
        if (timer) clearTimeout(timer)
        resolve(response)
      }
    }).catch(e => {
      if (!completed) {
        if (timer) clearTimeout(timer)
        reject(e)
      }
    })
    timer = setTimeout(() => {
      completed = !completed
      reject(new Error(`timeout`))
    }, timeout * 1000)
  })
}
