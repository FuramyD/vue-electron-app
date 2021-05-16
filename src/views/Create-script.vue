<template>
    <div class="create-script">
        <Back class="back icon" @click="historyBack"/>
        <div class="menu">
            <div class="new-script">
                <div class="script-input-wrapper">
                    <label>Сценарий</label>
                    <input type="text" name="script" class="control">
                </div>
                <div class="time-input-wrapper">
                    <label >Время</label>
                    <input type="text" name="time" class="control">
                </div>
                <button class="add btn">
                    <Add class="icon"/>
                </button>
            </div>
            <div class="list">
                <div class="script">1</div>
                <div class="script">2</div>
                <div class="script">3</div>
                <div class="script">4</div>
                <div class="script">5</div>
                <div class="script">6</div>
                <div class="script">7</div>
                <div class="script">8</div>
                <div class="script">9</div>
                <div class="script">10</div>
            </div>
        </div>
        <div class="controls">
            <button class="btn">
                <Save class="icon"/>
            </button>
            <button class="btn">
                <Delete class="icon"/>
            </button>
        </div>
    </div>
</template>

<script>
    import Back from "../components/icons/Back";
    import Save from "../components/icons/Save";
    import Delete from "../components/icons/Delete";
    import Add from "../components/icons/Add";
    export default {
        name: "Create-script",
        components: {Add, Delete, Save, Back },
        methods: {
            historyBack() {
                this.$router.go(-1)
            }
        }
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
</style>