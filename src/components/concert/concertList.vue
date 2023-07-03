<template>
    <div id="app">
        <div class="inputBox">
            <input type="text" placeholder="검색어 입력">
            <b-button class="searchBtn">검색</b-button>
        </div>
        <div>
            <ul >
                <li v-for="(item, index) in arr" :key="index">
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            arr : [
                {1 : 'asd', 2 : "22"}, 
                {1 : 'asd', 2 : "22"},
                {1 : 'asd', 2 : "22"},
                {1 : 'asd', 2 : "22"},
                {1 : 'asd', 2 : "22"}
            ]
        }
    },
}
</script>
<style scoped>

    #app {
        width:65%;
        margin:0 auto;
    }

    .inputBox {
        margin : 0 auto;
        width: 60%;
        background: #C8C8C8;
        line-height: 50px;
        border-radius : 5px;
    }
    .inputBox input {
        background : white;
        width:75%;
        /* border-style : none; */
        font-size : 0.9rem;
        border-radius: 5px 0 0 5px;
    }

    .searchBtn {
        background: linear-gradient(to right, #40aef7, #5d8bff);
        color: white;
        font-weight: 700;
        width: 5rem;
        height: 3.3rem;
        border-radius: 0 5px 5px 0;
    }

    ul {
        list-style-type : none;
        padding-left: 0;
        margin-top: 0;
        text-align: 0;
    }

    ul li {
        float: left;
        width: 33%;
        padding-bottom: 20px;
        margin-top: 20px;
        border-bottom: 1px solid #e0e0e0;
        height: 175px;
    }


</style>