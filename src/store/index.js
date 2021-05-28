import { createStore } from "vuex";
import router from "../router";
const ipcRenderer = window.ipcRenderer

export default createStore({
    actions: {
        async requestScripts(ctx) {
            const json = await ipcRenderer.invoke('get-scripts')
            const scripts = JSON.parse(json).map(el => {
                return {
                    ...el,
                    time: [Math.floor((el.time / 1000) / 60), (el.time / 1000) % 60].join(':')
                }
            })
            ctx.commit('setScripts', scripts)
        },
        async saveScripts(ctx, scripts) {
            await ipcRenderer.invoke('save-scripts', scripts)
        },
        async start(ctx, data) {
            let time = data.time.split(':')
            if (time.length === 2) {
                time = (time[0] * 60 + time[1]) * 1000
            } else {
                time = Number(time.join('')) * 1000 || 1000
            }

            await ipcRenderer.invoke('start', data)
            await ipcRenderer.invoke('win:hide')
            console.log('You had', time / 1000, 'seconds')
            const timeout = setTimeout(async () => {
                const result = await ipcRenderer.invoke('find-result', data.name, data.scriptId)
                console.log(result)
                ctx.commit('setResult', JSON.parse(result))
                await router.push('/results')
                await ipcRenderer.invoke('win:show')

                clearInterval(interval)
            }, time)

            let interval
            setTimeout(() => {
                interval = setInterval(async () => {
                    // await ipcRenderer.invoke('test:t')
                    const isClosed = await ipcRenderer.invoke('check:closed', data.scriptId)

                    if (isClosed) {
                        console.log('closed')
                        await ipcRenderer.invoke('win:show')
                        const result = await ipcRenderer.invoke('find-result', data.name, data.scriptId)
                        ctx.commit('setResult', JSON.parse(result))
                        await router.push('/results')


                        clearTimeout(timeout)
                        clearInterval(interval)
                    }
                }, 1000)
            }, 500)
        },
        async getResults(ctx) {
            const res = await ipcRenderer.invoke('get-results')
            ctx.commit('setResults', res)
        },
        async deleteResult(ctx, result) {
            const deleted = await ipcRenderer.invoke('delete-result', result)
            if (deleted) {
                ctx.commit('deleteResult', result)
                console.log('result with id:', result.id, 'has been deleted')
            }
        }
    },
    mutations: {
        setScripts(state, scripts) {
            state.scripts = scripts
        },
        setScript(state, script) {
            state.scripts = [...state.scripts, script]
        },
        removeScript(state, id) {
            state.scripts = state.scripts.filter(s => s.id !== id)
        },
        setResult(state, result) {
            state.result = result
        },
        setResults(state, results) {
            state.results = results
        },
        deleteResult(state, result) {
            state.results = JSON.stringify(JSON.parse(state.results).filter(r => r._id !== result._id))
        }
    },
    state: {
        scripts: [],
        result: null,
        results: null
    },
    getters: {
        getScripts(state) {
            return state.scripts
        },
        getResult(state) {
            if (!state.result) return null
            const arr = []
            const [entered, script] = state.result

            let lastIndex
            let lastLit
            for (let i = 0; i < entered.length; i++) {
                if (i > 0) {

                    // console.log(entered[i-1], lastLit, script[lastIndex], script[0])
                    entered[i-1] === lastLit ? lastIndex++ : lastIndex = 0
                    let curLit = script[lastIndex]

                    arr.push({
                        entered: entered[i],
                        script: curLit
                    })

                    lastLit = curLit
                    if (entered[i] === script[0]) {
                        lastIndex = 0
                        lastLit = script[0]
                    }
                    continue
                }
                arr.push({
                    entered: entered[0],
                    script: script[0]
                })

                lastLit = script[0]
                lastIndex = 0
            }

            return arr
        },
        getResults(state) {
            return JSON.parse(state.results)
        }
    },
});
