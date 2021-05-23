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
            <tr v-for="(row, i) of getResults" :key="i">
                <td>{{ row.id }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.lastEnter }}</td>
                <td>{{ row.scriptId }}</td>
                <td>{{ row.tries }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import Back from "../components/icons/Back";
    import {mapGetters} from "vuex";

    export default {
        name: "Admin-results",
        components: { Back },
        methods: {
            historyBack() {
                this.$router.push('/admin')
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
                td {
                    height: 50px;
                    text-align: center;
                    word-break: break-word;
                    background-color: @light-color;
                    border-bottom: 1px solid black;
                    border-top: 1px solid black;
                }
            }
        }
    }
</style>