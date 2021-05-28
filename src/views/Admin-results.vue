<template>
    <div class="admin-results">
        <Back class="back" @click="historyBack"/>
        <h2 class="title">Все результаты</h2>
        <table class="results-table">
            <thead>
                <th scope="col">Id</th>
                <th scope="col">Имя</th>
                <th scope="col">Последний ввод</th>
                <th scope="col">Id сценария</th>
                <th scope="col">Количество попыток</th>
            </thead>
            <tbody>
                <tr :class="{active: activeResultId === row.id}" @click="choiceResult(row)"
                    v-for="(row, i) of getResults" :key="i"
                >
                    <td>{{ row.id }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.lastEnter }}</td>
                    <td>{{ row.scriptId }}</td>
                    <td>{{ row.tries }}</td>
                </tr>
            </tbody>
        </table>

        <Download @click="downloadResults" class="results-control" />
        <Delete @click="deleteResult" class="results-control"/>
    </div>
</template>

<script>
    import Back from "../components/icons/Back";
    import {mapGetters} from "vuex";
    import Download from "../components/icons/Download";
    import Delete from "../components/icons/Delete";

    export default {
        name: "Admin-results",
        components: {Delete, Download, Back },
        data() {
            return {
                activeResultId: -1
            }
        },
        methods: {
            choiceResult(row) {
                this.activeResultId = row.id
            },
            historyBack() {
                this.$router.push('/admin')
            },
            async downloadResults() {
                await window.ipcRenderer.invoke('download-results')
            },
            async deleteResult() {
                let result = this.getResults.find(r => r.id === this.activeResultId)

                await this.$store.dispatch('deleteResult', result)
            },
            log(e) {
                console.log(e)
            }
        },
        computed: mapGetters(['getResults']),
        async mounted() {
            this.$store.dispatch('getResults')
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/styles/variables";
    @import "../assets/styles/main";

    .back {
        position: absolute;
        left: 20px;
        top: 10px;
    }

    .title {
        margin: 40px auto;
        text-align: center;
    }

    .results-table {
        border-collapse: collapse;
        width: 100%;

        & > :first-child {
            border: 2px solid black;
        }

        thead {
            background-color: @dark-color;
            [scope="col"] {
                height: 50px;
            }
        }
        tbody {
            border: 2px solid black;
            tr {
                transition: background-color .1s;
                background-color: @light-color;

                td {
                    height: 50px;
                    text-align: center;
                    word-break: break-word;
                    border-bottom: 1px solid black;
                    border-top: 1px solid black;
                }

                /*&:hover,*/ &.active {
                    background-color: @medium-color;
                }

                &:not(.active) {
                    cursor: pointer;
                }
            }
        }
    }

    .results-control {
        color: @medium-color;
        transition: color .15s;
        cursor: pointer;

        width: 50px;
        height: 50px;

        margin: 20px;

        &:hover {
            color: @dark-color;
        }
    }
</style>