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
            location : {},
            place : {}
        }
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
                console.log(this.location)
                if(result.data.documents.length > 0) {
                    self.$axios('https://dapi.kakao.com/v2/local/search/keyword.json?autoload=false&query='+self.location.road_address.building_name, {
                        headers : {
                            'Authorization' : 'KakaoAK '+`${process.env.VUE_APP_RESTAPI_KEY}`
                        }
                    }).then((result) => {
                        console.log(result)
                        if(self.location.road_address.building_name === result.data.documents[0].place_name) {
                            self.place = result.data.documents[0]
                        }

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
                    }).catch((err) => {
                        console.log("error : "+err)
                    });

                    
                } else {

                }
            }).catch((err) => {
                console.log("error : "+err)    
            });

            if(this.location != null) {
                
            }

        },

        initMap() {
            var x = this.location.x
            var y = this.location.y
            const container = document.getElementById("map")
            const option = {
                center : new kakao.maps.LatLng(y, x),
                level : 2,
            }
            
            var infoContent = '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + 
            '            카카오 스페이스닷원' + 
            '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">' +
            '           </div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>' + 
            '                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' + 
            '                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';

                // '<div style="padding:5px;">'+ this.location.road_address.building_name +' <br><a href="https://map.kakao.com/link/map/'+this.location.address_name+','+y+','+x+'" style="color:blue" target="_blank">큰지도보기</a> | <a href="https://map.kakao.com/link/to/'+this.location.address_name+','+y+','+x+'" style="color:blue" target="_blank">길찾기</a></div>'
            var infoPosition = new kakao.maps.LatLng(y, x) 
            this.map = new kakao.maps.Map(container, option)
            var marker = new kakao.maps.Marker({
                map: this.map,
                position: new kakao.maps.LatLng(y, x)
            });

            marker.setMap(this.map)

            var infoWindow = new kakao.maps.InfoWindow({
                position : infoPosition, 
                content : infoContent 
            });


            infoWindow.open(this.map, marker)
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

    .wrap {
        position: absolute;
        left: 0;bottom: 40px;
        width: 288px;
        height: 132px;
        margin-left: -144px;
        text-align: left;
        overflow: hidden;
        font-size: 12px;
        font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
        line-height: 1.5;
    }

    .wrap * {
        padding: 0;
        margin: 0;
    }

    .wrap .info {
        width: 286px;
        height: 120px;
        border-radius: 5px;
        border-bottom: 2px solid #ccc;
        border-right: 1px solid #ccc;
        overflow: hidden;
        background: #fff;
    }

    .wrap .info:nth-child(1) {
        border: 0;
        box-shadow: 0px 1px 2px #888;
    }

    .info .title {
        padding: 5px 0 0 10px;
        height: 30px;
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-size: 18px;
        font-weight: bold;
    }

    .info .close {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #888;
        width: 17px;
        height: 17px;
        background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
    }

    .info .close:hover {
        cursor: pointer;
    }

    .info .body {
        position: relative;
        overflow: hidden;
    }
    .info .desc {
        position: relative;
        margin: 13px 0 0 90px;
        height: 75px;
    }

    .desc .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .desc .jibun {
        font-size: 11px;
        color: #888;
        margin-top: -2px;
    }
    .info .img {
        position: absolute;
        top: 6px;
        left: 5px;
        width: 73px;
        height: 71px;
        border: 1px solid #ddd;
        color: #888;
        overflow: hidden;
    }
    .info:after {
        content: '';
        position: absolute;
        margin-left: -12px;
        left: 50%;
        bottom: 0;
        width: 22px;
        height: 12px;
        background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')
    }
    .info .link {
        color: #5085BB;
    }

</style>