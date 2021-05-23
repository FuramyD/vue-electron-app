// const cp = require('child_process')
// // const path = require('path')
// //
// // const pathToExe = path.join(__dirname, 'src', 'assets', 'cpp', 'index.exe')
// // cp.exec(pathToExe, (err, stdout, stderr) => {
// //     console.log('err', err)
// //     console.log('out', stdout)
// //     console.log('stderr', stderr)
// // })
//
// cp.exec('taskkill /IM index.exe /F')

function sum() {
    console.log(this)
    return eval(this.join('+'))
}

let arr = ['1', '2', '3'].map(Number)
let sum1 = sum.bind(arr)

console.log(sum1())


let fibonacci = (n) => {
    let arr = [0n, 1n]

    for (let i = 0; i < n - 2 ; i++) {
        arr.push(arr[arr.length-1] + arr[arr.length-2])
    }

    return arr[arr.length - 1]
}

let fibonacciRec = (n) => {
    if (n === 1) return 0n
    if (n === 2) return 1n

    return fibonacciRec(n-1) + fibonacciRec(n-2)
}

console.log(fibonacci(200000)) // 0, 1, 1, 2, 3