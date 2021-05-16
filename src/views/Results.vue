<template>
    <div class="results">
        <Back class="back" @click="historyBack"/>
        <h2 class="title">Результаты</h2>
        <table class="results-table">
            <thead>
                <th scope="col">Ввод</th>
                <th scope="col">Сценарий</th>
                <th scope="col">Результат</th>
            </thead>
            <tbody>
                <tr v-for="(row, i) of table" :key="i">
                    <td>{{ row.entered }}</td>
                    <td>{{ row.script }}</td>
                    <td>{{ row.entered === row.script ? '+' : '-' }}</td>
                </tr>
            </tbody>
        </table>
        <button class="play-again">play again</button>
    </div>
</template>

<script>
    import Back from "../components/icons/Back";
    export default {
        name: "Results",
        components: {Back},
        methods: {
            historyBack() {
                this.$router.go(-1)
            },
            onPress(e) {
                console.log(e)
            }
        },
        mounted() {
            window.onkeypress = this.onPress
        },
        data() {
            return {
                table: [
                    {
                        entered: 'A',
                        script: 'A',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'C',
                        script: 'A',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'C',
                        script: 'A',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                    {
                        entered: 'B',
                        script: 'B',
                    },
                ]
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../assets/styles/variables";
    @import "../assets/styles/main";

    .back {
        position: absolute;
        left: 20px;
        top: 10px;
    }

    .results {
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
            text-align: center;
            margin: 20px 0;
        }

        .results-table {
            width: 100%;
            border-collapse: collapse;

            margin-bottom: 20px;
            background-color: @light-color;

            thead {
                & > * {
                    border: 1px solid @medium-color;
                    height: 24px;
                    vertical-align: bottom;
                }
            }
            tbody {
                border: 1px solid #ff4034;
                vertical-align: middle;
                tr {
                    width: 100%;
                    td {
                        height: 24px;
                        width: calc(100% / 3);

                        border: 1px solid @medium-color;
                        text-align: center;

                        font-weight: 600;
                    }
                }
            }
        }

        .play-again {
            height: 40px;
            width: 100%;
            max-width: 200px;

            margin-bottom: 20px;

            border-radius: 4px;
            border: none;
            outline: none;

            background-color: @medium-color;
            font-size: 22px;
            font-weight: 600;

            cursor: pointer;
            transition: background-color .1s;

            &:hover {
                background-color: @dark-color;
            }
        }
    }
</style>
