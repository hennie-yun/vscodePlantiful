<template>
    <div class="inputBox">
        <input type="text" maxlength="15" v-model="newTodoItem" v-on:keyup.enter="addTodo" title="Let's Todo!" placeholder="Let's Todo!">
        <!-- <button v-on:click="addTodo">add</button> -->
        <span class="addContainer" @click="addTodo">
            <i class="far fa-plus-square addBtn" aria-hidden="true"></i>
        </span>
        <div>
            <myModal @closemodal="closeModal" v-if="showModal">
                <p>Vue.js Modal Window!</p>
                <div>asdasd</div>
                <template #footer>
                    THIS IS FOOTER
                </template>
            </myModal>
        </div>
    </div>
</template>
<script>
import myModal from './common/ModalView.vue'

export default {
    props: ['propsdata'],
    data: function () {
        return {
            newTodoItem: '',
            showModal: false
        }
    },

    methods: {
        addTodo: function () {
            if (this.newTodoItem !== '') {
                let item = { msg: this.newTodoItem, index: this.propsdata.length }
                this.$emit('addTodoItem', item)
                this.clearInput()
            } else {
                this.showModal = !this.showModal
            }
        },

        clearInput: function () {
            this.newTodoItem = ''
        },

        openModal() {
            this.showModal = true
        },

        closeModal() {
            console.log("모달?")
            this.showModal = false
        }
    },

    components: {
        myModal,
    }
}
</script>
<style scoped>
/* input {
        border-radius: 5px;
    } */

input:focus {
    outline: none;
}

.inputBox {
    background: white;
    height: 50px;
    line-height: 50px;
    border-radius: 5px;
}

.inputBox input {
    width: 68%;
    height: 20px;
    margin-top: 10%;
    border-bottom: 1px solid #B3ADAD;
    /* border-style: none; */
    /* font-size: 0.9rem; */
}

.addBtn {
    color: black;
    vertical-align: middle;
    margin-left :5%;
}
</style>