<template>
    <div id="app">
        <div class="inputBox" style="">
            <input class="my-6 w-75" v-model="keyword" type="text" placeholder="검색어 입력" 
            @keyup.enter="search">
            <v-btn class="searchBtn" @click="search">
                <img style="max-width: 100%; max-height: 100%;" :src="require('@/assets/image/search.png')">
            </v-btn>
            <v-btn class="searchBtn" @click="rollback">
                <img style="max-width: 100%; max-height: 100%;" :src="require('@/assets/image/undo.png')">
            </v-btn>
        </div>
        <div class="text-center">
            <v-progress-circular
                color="blue-lighten-3"
                indeterminate
                :size="128"
                :width="16"
                class="ma-16"
                v-show="isShow"
            ></v-progress-circular>
        </div>
        <div>
            <div class="empty-div" v-if="items.length === 0 && isShow === false"> 
                <div class="inner-empty-div">검색 결과가 없습니다</div> 
            </div>
            <ul id="itemList">
                <li class="uls" v-for="(item, index) of items" :key="index">
                    <div class="imgDiv">
                        <a style="cursor: pointer;" @click="detail(item.id)">
                            <img :src="item.poster">
                        </a>
                    </div>
                    <div class="zi">
                        <h4>{{item.name}}</h4>
                        <ul class="zl">
                            <li>기간 : {{ item.startDate }} ~  {{ item.endDate }}</li>
                            <li>장소 : {{ item.loc }}</li>
                        </ul>
                        <b-button class="w-100 rounded-lg" 
                            style="background-color:#7AC6FF; 
                            font-family: 'TheJamsil5Bold'; color:white;
                            margin-top: 10px;" @click="detail(item.id)">
                            상세보기
                        </b-button>
                    </div>
                </li>
            </ul>
            <div style="text-align: center;">
                <b-pagination v-model="currentPage" 
                    :total-rows="count" align="center"
                    :per-page="perPage" size="lg" page-class="custom-page"
                ></b-pagination>
            </div>
            <div>
                <h3 class="source">
                    출처: (재)예술경영지원센터 공연예술통합전산망(www.kopis.or.kr)
                </h3>
            </div>
        </div>
    </div>
</template>
<script>

import ConcertFooter from '@/components/concert/conertFooter.vue'

export default {
    components : {
        'concertFooter' : ConcertFooter
    },

    data() {
        return {
            originalItems : [],
            items : [],
            tempItems : [],
            perPage : 30, 
            currentIndex : -1,
            currentPage : 1,
            count : 0,
            isShow : true,
            keyword : ''
        }
    }, 

    created : function() {
        this.getList(this.page)
    },
    
    methods : {
        getList() {
            const self = this
            self.$axios.get("http://localhost:8181/concert/1")
            .then((result) => {
                this.items = []
                for(let obj of result.data.list) {
                    this.items.push(obj)
                    this.originalItems.push(obj)
                }

                this.count = this.items.length
                this.isShow = false
            }).catch((e) => {
                console.log("error : " +e)
            })
        },

        detail(id) {
            this.$router.push({'name' : 'concertdetail', query : {'id' : id}})
        }, 
        
        pageChange : function(value) {
            console.log(value)
            this.currentPage = value
        }, 

        search() {
            console.log(this.keyword)

            for(let item of this.originalItems) {
                if(item.name.includes(this.keyword)) {
                    this.tempItems.push(item)
                }
            }

            console.log(this.tempItems)
            this.items = this.tempItems
            this.count = this.tempItems.length
            this.tempItems = []
        },

        rollback() {
            this.items = this.originalItems
            this.count = this.items.length
            this.keyword = ''
        }
    }, 

    computed : {
        rows() {
            return this.items.length
        },

        items() {
            return this.items.slice(
                (this.currentPage-1) * this.perPage,
                this.currentPage * this.perPage
            ) 
        }, 
    }
}
</script>
<style scoped>
    html {
        height: 100%;
    }

    body {
        height: 100%;
    }

    #app {
        width:65%;
        margin:0 auto;
        
    }

    .concert-footer { 
        height: 170px;
        position:absolute;
        bottom: 0;
        left: 0;
        right: 0;
        /* color: white; */
        /* background-color: #333333; */
    }

    

    .inputBox {
        text-align: center;
        /* margin : 0 auto; */
        width: 100%;
        line-height: 50px;
        border-radius : 5px;
    }
    .inputBox input {
        background : white;
        width:90%;
        font-size : 0.9rem;
        height: 2.5rem;
        border-radius: 5px 0 0 5px;
    }

    .searchBtn {
        /* background: linear-gradient(to right, #40aef7, #5d8bff); */
        color: white;
        font-weight: 700;
        background-color: #7AC6FF;
        width: 5rem;
        height: 2.5rem;
        border-radius: 5px 5px 5px 5px;
        margin : 5px;
    }

    #itemList {
        width:100%;
        display:inline-block;
        list-style-type : none;
        padding-left: 0;
        margin-top: 0;
        text-align: 0;
        
    }

    #itemList .uls {
        float: left;
        width: 33%;
        padding-bottom: 20px;
        margin-top: 20px;
        border-bottom: 1px solid #e0e0e0;
        height: 175px;
        overflow: hidden;

    }

    .zi {
        display: table-cell;
        vertical-align: top;
        padding: 0 10px;
        max-width: 203px;
    }

    .zi h4 {
        font-weight: normal;
        font-size: 15px;
        color: #000;
        margin-top: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    } 

    .imgDiv {
        display: table-cell;
        width: 101px;
        height: 130px;
        padding-left: 10px;
    }

    .imgDiv img {
        max-height: 100%;
        max-width: 100%;
    }

    .zi .zl{
        margin-top: 12px;
        padding-left: 0px;
    }
    
    .zl li{
        font-size: 13px;
        color: #6d6d6d;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .source {
        padding:36px;
        font-family: Arial, 
        Helvetica, sans-serif; 
        font-weight: 600;
        text-align: center;
    }

    .empty-div {
        height:300px;
        text-align: center;
        font-family: TheJamsil5Bold;
        font-weight: 900;
        justify-content: center;
        align-items : center;

    }

    .inner-empty-div{
        font-size: 60px; 
    }
</style>
