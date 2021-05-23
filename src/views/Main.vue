<template>
    <div class="main">
        <div class="main__header">
            <div id="securityIcon" class="login-icon">
                <router-link class="link" to="/login">
                    <Shield />
                </router-link>
            </div>
        </div>

        <div class="main__body">
            <div class="start">
                <input class="control" type="text" id="name" placeholder="name" v-model="name"/>
                <button id="start" @click="start">start</button>
            </div>
            <div class="right-side">
                <div class="scripts">
                    <div class="list">
                        <div class="script" :class="{active: activeScriptId === script.id}"
                             v-for="(script, index) of getScripts" :key="index"
                             @click="choiceScript(script.id)">Сценарий {{ script.id }}</div>
                    </div>
                </div>
                <div class="time">
                    <input class="control" type="text" id="time" readonly placeholder="time" style="text-align: center" :value="getScripts.find(s => s.id === activeScriptId)?.time || '00:00'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Shield from "../components/icons/Shield"
    import { mapGetters } from "vuex";
    export default {
        name: "Main",
        components: {
            Shield,
        },
        data() {
            return {
                activeScriptId: -1,
                name: ''
            }
        },
        methods: {
            start() {
                const data = {
                    name: this.name,
                    scriptId: this.activeScriptId,
                    time: this.getScripts.find(s => s.id === this.activeScriptId)?.time
                }
                this.$store.dispatch('start', data)
            },
            choiceScript(id) {
                this.activeScriptId = id
            }
        },
        computed: {
            ...mapGetters(['getScripts'])
        },
        async mounted() {
            await this.$store.dispatch('requestScripts')
        }
    };
</script>

<style lang="less" scoped>
    @import "../assets/styles/variables";
    @import "../assets/styles/main";

    .main {
        &__header {
            height: 50px;
            width: 100%;

            display: flex;
            justify-content: flex-end;
            align-items: center;

            .login-icon {
                width: 32px;
                height: 32px;

                margin-right: 30px;

                .link {
                    text-decoration: none;
                    color: inherit;

                    svg {
                        width: 100%;
                        color: @dark-color;
                        cursor: pointer;

                        transition: color 0.1s;

                        &:hover {
                            color: @active-color;
                        }
                    }
                }
            }
        }

        &__body {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;

            .start {
                margin-right: 60px;
                margin-bottom: 20px;

                border: 1px solid @medium-color;
                border-radius: 8px;
                height: 150px;
                width: 250px;

                display: flex;
                flex-direction: column;
                align-items: center;

                .control {
                    margin-top: 30px;

                    width: 200px;
                    height: 30px;
                }

                #start {
                    height: 40px;
                    width: 200px;

                    margin-top: 20px;

                    border-radius: 8px;
                    border: none;
                    outline: none;

                    background-color: @medium-color;
                    box-shadow: 0 2px 2px 1px #725b92;

                    font-size: 22px;
                    text-align: center;

                    cursor: pointer;

                    transition: background-color 0.1s ease-in;

                    &:hover {
                        background-color: @dark-color;
                        box-shadow: 0 2px 4px 1px #725b92;
                    }
                }
            }
            .right-side {
                .scripts {
                    .list {
                        max-height: 79px;
                        overflow: auto;

                        .script {
                            height: auto;
                            line-height: 25px;
                            width: 100%;
                            padding-left: 2px;
                            border: 1px solid black;

                            background-color: @medium-color;

                            font-size: 18px;
                            font-weight: 600;

                            cursor: pointer;

                            &.active,
                            &:hover {
                                background-color: @dark-color;
                            }

                            &:not(:first-child) {
                                border-top: none;
                            }
                        }
                    }
                }
                .time {
                    margin-top: 30px;

                    #time {
                        width: 200px;
                        height: 40px;
                    }
                }
            }
        }
    }
</style>
