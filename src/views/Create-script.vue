<template>
    <div class="create-script">
        <Back class="back icon" @click="historyBack"/>
        <div class="menu">
            <div class="new-script" style="height: 212px">
                <div class="script-input-wrapper" v-if="curScript.id">
                    <label>Сценарий {{ curScript.id }}</label>
                    <input type="text" name="script" class="control" v-model="curScript.script">
                </div>
                <div class="time-input-wrapper" v-if="curScript.id">
                    <label >Время</label>
                    <input type="text" name="time" class="control" v-model="curScript.time" @input="onTimeInput">
                </div>
                <button class="add btn" @click="addScript">
                    <Add class="icon"/>
                </button>
            </div>
            <div class="list" :class="{'justify-self-flex-end': !curScript.id}">
                <div class="script" :class="{ active: activeScriptId === script.id - 1 }" v-for="(script, i) of getScripts" :key="i" @click="choiceScript(script.id)">
                    {{ script.id }}
                </div>
            </div>
        </div>
        <div class="controls">
            <button class="btn">
                <Save class="icon" @click="saveScripts"/>
            </button>
            <button class="btn">
                <Delete class="icon" @click="removeScript(activeScriptId + 1)"/>
            </button>
        </div>
    </div>
</template>

<script>
    import Back from "../components/icons/Back";
    import Save from "../components/icons/Save";
    import Delete from "../components/icons/Delete";
    import Add from "../components/icons/Add";
    import {mapGetters, mapMutations} from "vuex";
    export default {
        name: "Create-script",
        components: {Add, Delete, Save, Back },
        data() {
            return {
                activeScriptId: -1
            }
        },
        methods: {
            ...mapMutations(['setScripts', 'setScript', 'removeScript']),
            historyBack() {
                this.$router.go(-1)
            },
            addScript() {
                this.setScript({
                    id: this.getScripts[this.getScripts.length - 1].id + 1,
                    script: '',
                    time: '00:00'
                })
            },
            choiceScript(id) {
                this.activeScriptId = id - 1
                console.log(this.activeScriptId)
                console.log(this.getScripts)
            },
            saveScripts() {
                const json = JSON.stringify(this.getScripts)
                const scripts = JSON.parse(json)
                this.$store.dispatch('saveScripts', scripts)
            },
            onTimeInput(e) {
                let target = e.target
                let match = target.value.match(':')
                if (!e.data?.match(/[0-9]/)) {
                    target.value = target.value.slice(0, target.value.length - 1)
                    return
                }
                if (target.value.length === 2) {
                    target.value += ':'
                }

                if (target.value.length > 2 && (!match || match.index !== 2)) {
                    let split = target.value.split('')
                    split = split.filter(el => el !== ':')
                    split.splice(2, 0, ':')
                    target.value = split.join('')
                }

                if (target.value.length > 5) {
                    target.value = target.value.slice(0, 5)
                }
            },
            timeValidator(time) {
                if (time.re)



                if (time === '') {
                    console.log('Введите время')
                    return
                }
                let splitTime = time.split(':').map(Number).filter(el => (el || el === 0) || console.log('Некорректное время'))
                console.log('time:', time)
                console.log('split time:', splitTime)

                switch (splitTime.length) {
                    case 0:
                        console.log('Введите время')
                        break
                    case 1:
                        if (splitTime[0] > 60) console.log('Введите время в формате мм:сс')
                        break
                    case 2:
                        if (splitTime[0] > 30 || parseInt(splitTime[0]) === 30 && splitTime[1] > 0) {
                            console.log('Введите время до 30-и минут')
                        }
                        break
                    default:
                        console.log('Введите время до 30-и минут')
                        break
                }
            },
        },
        computed: {
            ...mapGetters(['getScripts']),
            curScript() {
                return this.getScripts.find(s => s.id === this.activeScriptId + 1) || {
                    id: '',
                    script: '',
                    time: '00:00'
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../assets/styles/variables";
    @import "../assets/styles/main";

    .back {
        margin: 10px 20px;

    }

    .icon {
        width: 36px;
        height: 36px;
    }

    .btn {
        border: none;
        outline: none;

        cursor: pointer;
    }

    .create-script {
        .menu {
            display: flex;
            justify-content: center;

            .new-script {
                display: flex;
                flex-direction: column;
                margin-right: 40px;

                .script-input-wrapper, .time-input-wrapper {
                    display: flex;
                    flex-direction: column;

                    margin-bottom: 15px;
                    color: darken(@active-color, 20%);
                    font-size: 16px;

                    .control {
                        height: 30px;
                    }
                }

                .script-input-wrapper {
                    label {
                        padding-left: 5px;
                        border: 2px solid @dark-color;

                        font-size: 18px;
                        font-weight: 600;
                        background-color: @medium-color;
                    }

                    .control {
                        height: 50px;
                        border-radius: 0 0 8px 8px;
                        border-top: none;
                    }
                }

                .time-input-wrapper {
                    width: 60%;
                    .control {
                        height: 50px;
                    }
                }
                .add {
                    align-self: flex-start;
                    justify-self: flex-end;
                    color: @medium-color;

                    transition: color .1s;

                    &:hover {
                        color: @dark-color;
                    }
                }
            }
            .list {
                width: 30%;
                max-height: 200px;
                overflow: auto;
                .script {
                    padding-left: 5px;

                    width: 100%;
                    height: 25px;
                    line-height: 25px;

                    border: 1px solid black;
                    background-color: @medium-color;

                    font-weight: 600;

                    cursor: pointer;

                    &.active, &:hover {
                        background-color: @dark-color;
                    }
                }
            }
        }
        .controls {
            margin-top: 20px;
            .btn {
                margin-left: 40px;
                .icon {
                    color: @dark-color;

                    &:hover {
                        color: @active-color;
                    }
                }
            }
        }
    }


    .justify-self-flex-end {
        justify-self: flex-end;
    }
</style>