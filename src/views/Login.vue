<template>
    <div class="login">
        <div class="login__header">
            <button class="back" @click="historyBack">
                <Back />
            </button>
        </div>
        <div class="login__body">
            <div class="error" v-if="error">
                {{ error }}
                <Close class="close" @click="error = ''"/>
            </div>
            <form @submit.prevent="signIn">
                <label>
                    Login
                    <input class="control" type="text" id="login" v-model="login" />
                </label>
                <label>
                    Password
                    <input class="control" type="password" id="password" v-model="password"/>
                </label>
                <button id="sign-in" class="submit" type="submit">login</button>
            </form>
        </div>
        <button @click="execute">c++ execute</button>
    </div>
</template>

<script>
    import Back from "../components/icons/Back";
    import Close from "../components/icons/Close";
    export default {
        name: "Login",
        components: {Close, Back },
        data() {
            return {
                count: 1,
                login: '',
                password: '',
                error: '',
                ipcRenderer: null
            };
        },
        methods: {
            historyBack() {
                this.$router.push('/');
            },

            async signIn() {
                let data = {
                    login: this.login,
                    password: this.password
                }
                const res = await this.ipcRenderer.invoke('admin:login', data)
                if (res)
                    await this.$router.push('/admin')
                else this.error = 'Непавильный логин или пароль, попробуйте еще раз'
            },

            execute() {
                this.ipcRenderer.invoke('execute')
            }
        },
        created() {
            this.ipcRenderer = window.ipcRenderer
        }
    };
</script>

<style lang="less" scoped>
    @import "../assets/styles/variables";
    @import "../assets/styles/main";

    .login {
        &__header {
            height: 50px;
            display: flex;
            align-items: center;

            .back {
                margin-left: 30px;
            }
        }

        &__body {
            margin-top: 20px;

            display: flex;
            flex-direction: column;
            align-items: center;

            .error {
                position: relative;

                width: 90%;
                max-width: 500px;
                padding: 10px;

                border-radius: 8px;
                border: 2px solid @dark-color;

                color: darken(@active-color, 10%);
                background-color: @light-color;

                margin-bottom: 20px;

                .close {
                    position: absolute;
                    right: 10px;
                    top: 13px;

                    width: 11px;
                    height: 11px;

                    fill: @active-color;
                    cursor: pointer;

                    &:hover {
                        fill: darken(@active-color, 10%);
                    }
                }
            }

            form {
                display: flex;
                flex-direction: column;
                width: 60%;

                @media (max-width: 550px) {
                    align-items: center;
                }

                label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    margin-bottom: 20px;
                    color: darken(@active-color, 10%);
                    font-size: 14px;

                    .control {
                        height: 35px;
                    }

                    @media (max-width: 550px) {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                #sign-in {
                    margin: 0 auto;

                    height: 40px;
                    width: 100%;
                    max-width: 200px;

                    outline: none;
                    border: none;
                    border-radius: 8px;

                    // color: darken(@dark-color, 30%);
                    background-color: @dark-color;
                    transition: background-color 0.15s;
                    font-size: 18px;

                    cursor: pointer;

                    &:hover {
                        background-color: @active-color;
                    }
                }
            }
        }
    }
</style>
