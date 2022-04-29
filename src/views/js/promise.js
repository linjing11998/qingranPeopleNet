let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('完成')
    resolve('成功')
    // reject('失败')
  }, 1000)
})
p.then().then().then()

// all
let p1 = Promise.resolve('a')
let p2 = Promise.resolve('b')
let p3 = Promise.resolve('c')
Promise.all([p1, p2, p3]).then((value) => {
  console.log(value)
})
