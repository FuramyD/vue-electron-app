<template>
    <div class="admin-panel">
        <Back class="back" @click="historyBack"/>
        <div class="controls">
            <router-link to="/add-script" class="btn">Сценарий</router-link>
            <router-link to="/admin-results" class="btn">Результаты</router-link>
        </div>
    </div>
</template>

<script>
    import Back from "../components/icons/Back";
    export default {
        name: "Admin-panel",
        components: {Back},
        methods: {
            historyBack() {
                this.$router.push('/login')
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../assets/styles/variables";
    @import "../assets/styles/main";

    .admin-panel {
        display: flex;
        justify-content: center;

        .back {
            margin-top: 10px;

            width: 32px;
            height: 32px;
        }

        .controls {
            margin-top: 50px;
            width: 80%;

            display: flex;
            flex-direction: column;
            align-items: center;

            .btn {
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;

                height: 60px;
                width: 90%;
                max-width: 300px;

                font-size: 24px;

                margin-bottom: 40px;
                border-radius: 8px;

                border: none;
                outline: none;

                color: darken(@active-color, 10%);
                background-color: @medium-color;
                transition: background-color .1s;

                text-decoration: none;
                cursor: pointer;

                &:hover {
                    color: darken(@active-color, 20%);
                    background-color: @dark-color;
                }
            }
        }
    }
</style>
