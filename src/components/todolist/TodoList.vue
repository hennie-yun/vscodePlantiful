<template>
    <div>
        <ul>
            <li v-for="(todoItem, index) in propsdata" :class="{ textCompleted: todoItem.completed === true }"
                :key="todoItem.item">
                <i class="fa fa-check my-auto checkBtn" style="font-size:24px;"
                    :class="{ checkBtnComplted: todoItem.completed === true }"
                    v-on:click="toggleComplete(todoItem, index)" />
                {{ todoItem.item }}
                <p class="removeBtn" @click="removeTodo(todoItem, index)">
                    <i class="fas fa-trash-alt"></i>
                </p>
            </li>
        </ul>
    </div>
</template>
<script>

// TodoList - 리스트에 저장되는 key를 index로 줘서 정렬하기

export default {
    props: ['propsdata'],
    methods: {
        removeTodo: function (todoItem, index) {
            this.$emit('removeItem', todoItem, index)
        },

        toggleComplete: function (todoItem, index) {
            this.$emit('toggleItem', todoItem, index)
        }
    },
}
</script>
<style scoped>
ul {
    list-style-type: none;
    padding-left: 0;
    margin-top: 0;
    text-align: 0;
}

li {
    display: flex;
    min-height: 33px;
    height: 33px;
    line-height: 50px;
    margin: 0.5rem 0;
    padding: 0 2.2rem;
    background: white;
    border-radius: 5px;
}

.checkBtn {
    line-height: 45px;
    color: #62ACDE;
    margin-right: 5px;
}

.checkBtnComplted {
    color: #B3ADAD;
}

.textCompleted {
    text-decoration: line-through;
    color: #B3ADAD;
}

.removeBtn {
    margin-left: auto;
    color: #B3ADAD;
}

.fade-enter-active,
.fade-leave-active {
    transition: transform 300ms ease-in-out
}

.fade-enter,
.fade-leave-to {
    transform: scale(0)
}
</style>