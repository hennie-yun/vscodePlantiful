<template>
    <div>
        <div id="map"></div>
    </div>
    <div v-show="false">
        {{ propsdata }}
    </div>
</template>
<script>
export default {
    props:['propsdata'],
    data() {
        return {
            map : null,
            markerPosition : {},
            markers : [],
            location : {}
        }
    }, 

    mounted() {
        
    }, 

    created() {
        
    },

    methods : {
        relay() {
            const self = this
            self.$axios('https://dapi.kakao.com/v2/local/search/address.json?autoload=false&query='+this.propsdata, {
                headers : {
                    'Authorization' : 'KakaoAK '+`${process.env.VUE_APP_RESTAPI_KEY}`
                }
            }).then((result) => {
                this.location = result.data.documents[0]
                if(result.data.documents.length > 0) {
                    if(!window.kakao || window.kakao.maps) {
                        // script 객체 생성
                        const script = document.createElement("script")

                        // src 속성을 추가하고 .env에 등록한 API키 사용
                        script.src = `//dapi.kakao.com/v2/maps/sdk.js?&autoload=false&appkey=${process.env.VUE_APP_KAKAOMAP_KEY}`
                        
                        /* global kakao */
                        script.addEventListener("load", () => {
                            kakao.maps.load(()=>{
                                this.initMap()
                            })
                        })

                        document.head.appendChild(script)
                    } else {
                        console.log("already loaded! : ", window.kakao)
                        this.initMap()
                    }
                } else {

                }
            }).catch((err) => {
                console.log("error : "+err)    
            });

            

        },

        initMap() {
            const container = document.getElementById("map")
            const option = {
                center : new kakao.maps.LatLng(this.location.y, this.location.x),
                level : 1,
            }
            
            this.map = new kakao.maps.Map(container, option)
            var marker = new kakao.maps.Marker({
                map: this.map,
                position: new kakao.maps.LatLng(this.location.y, this.location.x)
            });

            marker.setMap(this.map)
        },

        // displayMakers(position) {
        //     // 1. 현재 표시 돼있는 marker들이 있다면 marker에 등록된 map을 제거
        //     if(this.makers.length > 0) {
        //         this.markers.forEach((item) => {
        //             item.setMap(null)
        //         }) 
        //     }

        //     // 2. marker 이미지  커스터마이징
        //     // const imgSrc = require("@/assets/map/markerStar.png")
        //     // const imgSize = new kakao.maps.Size(24, 35)
        //     // const markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize)

        //     // 3. marker 표시
        //     position.forEach((position) => {
        //         const infowindow = new kakao.maps.InfoWindow({
        //             removable : true.valueOf,
        //             content : `<div style="padding:5px;">${position.title}</div>`
        //         })

        //         const marker = new kakao.maps.Marker({
        //             map:this.map,               
        //             position : position.latlng,  // 마커의 위치
        //             // title : position.title,      // 마우스 오버 시 표시할 마커 제목
        //             // image : markerImage,         // 마커의 이미지
        //         })

        //         kakao.maps.event.addListener(marker, "mouseover", ()=> {infowindow.open(this.map, marker)})
        //         kakao.maps.event.addListener(marker, "mouseoutr", ()=> {infowindow.close(this.map, marker)})

        //         this.markers.push(marker)
        //     })

        //     // 4. 지도를 이동시키기
        //     // 배열.reduce( (누적 값, 현재 값, 인덱스, 요소) => {return 결과 값}. 초기 값)
        //     const bounds = position.reduce(
        //         (bounds, position) => bounds.extends(position.latlng),
        //         new kakao.maps.LatLngBounds()
        //     )

        //     this.map.setBounds(bounds)
        // }
    },

    // updated() {
    //     this.initMap()
    // },
}
</script>
<style scoped>
    #map {
        width:100%;
        height:400px;
    }
</style>