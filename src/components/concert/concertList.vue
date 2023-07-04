<template>
    <div id="app" style="margin: auto;">
        <div class="inputBox">
            <input class="" type="text" placeholder="검색어 입력">
            <b-button class="searchBtn">검색</b-button>
        </div>
        <div>
            <b-pagination v-model="currentPage" :total-rows="count" align="center"
                :per-page="perPage" pills size="lg" class="my-3"
            ></b-pagination>
        </div>
        <div style="height: 100%;">
            <ul id="itemList">
                <li class="uls" v-for="(item, index) of items" :key="index" @click="detail(item.id)">
                    <div class="imgDiv">
                        <img height="142" :src="item.poster">
                    </div>
                    <div class="zi">
                        <h4>{{item.name}}</h4>
                        <ul class="zl">
                            <li>기간 : {{ item.startDate }} ~  {{ item.endDate }}</li>
                            <li>장소 : {{ item.loc }}</li>
                        </ul>
                        <b-button class="w-100 rounded-lg" style="margin-top: 10px;">
                            상세보기
                        </b-button>
                    </div>
                </li>
            </ul>
            
        </div>
        <!-- <div>
            <b-pagination v-model="currentPage" :total-rows="count" align="center"
                :per-page="perPage" pills size="lg"
            ></b-pagination>
        </div> -->
    </div>
    
</template>
<script>
export default {
    data() {
        return {
            items : [],
            perPage : 30, 
            currentIndex : -1,
            currentPage : 1,
            count : 0
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
                    console.log(obj)
                    this.items.push(obj)
                }

                this.count = this.items.length
            }).catch((e) => {
                console.log("error : " +e)
            })
        },

        detail(id) {
            alert(id)
            this.$router.push({'name' : 'concertdetail', query : {'id' : id}})
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

    #app {
        width:65%;
        margin:0 auto;
    }

    .inputBox {
        margin : 0 auto;
        width: 100%;
        background: #C8C8C8;
        line-height: 50px;
        border-radius : 5px;
    }
    .inputBox input {
        background : white;
        width:90%;
        font-size : 0.9rem;
        border-radius: 5px 0 0 5px;
        height:3rem;
    }

    .searchBtn {
        background: linear-gradient(to right, #40aef7, #5d8bff);
        color: white;
        font-weight: 700;
        width: 5rem;
        height: 3rem;
        border-radius: 0 5px 5px 0;
    }

    #itemList {
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
        padding-left: 10px;
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

</style>