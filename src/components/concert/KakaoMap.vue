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
            place : {},
            locByAddressName : {}
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

                    self.$axios('https://dapi.kakao.com/v2/local/search/address.json?autoload=false&query='+self.location.address_name, {
                        headers : {
                            'Authorization' : 'KakaoAK '+`${process.env.VUE_APP_RESTAPI_KEY}`
                        }
                    }).then((result) => {
                        self.locByAddressName = result.data.documents[0]
                    }).catch((err) => {
                        console.log("error : "+err)
                    }) 
                    
                } else {

                }
            }).catch((err) => {
                console.log("error : "+err)    
            });

            if(this.location != null) {
                
            }

        },

        initMap() {
            console.log(this.locByAddressName)
            console.log(this.place)
            var str = ''
            if(this.locByAddressName.address.address_name == this.place.address_name) {
                str = this.place.place_url
            } else {
                str = 'https://map.kakao.com/link/search/'+this.locByAddressName.address_name
            }
            var x = this.location.x
            var y = this.location.y
            var infoPosition = new kakao.maps.LatLng(y, x) 
            const container = document.getElementById("map")
            const option = {
                center : infoPosition,
                level : 3,
            }
            
            

            var infoContent =   '<div class="overlay">' +
                                '  <a href="' + str + '" target="_blank" class="">' +
                                '    <span class="title">'+this.place.place_name+'</span>' +
                                '  </a>' +
                                '</div>';
            
            this.map = new kakao.maps.Map(container, option)
            var marker = new kakao.maps.Marker({
                position: infoPosition
            });

            marker.setMap(this.map)

            var customOverlay = new kakao.maps.CustomOverlay({
                map : this.map,
                position : infoPosition, 
                content : infoContent, 
                yAnchor : 1
            });


        },
    },

    // updated() {
    //     this.initMap()
    // },
}
</script>
<style>
    
    #map {
        font-family: pretend-regular;
        width: 100%;
        height: 400px;
    }

    .overlay {
        position:relative;
        bottom:85px;
        border-radius:6px;border: 1px solid #ccc;
        border-bottom:2px solid #ddd;
        float:left;
    }

    .overlay:nth-of-type(n) {
        border:0; 
        box-shadow:0px 1px 2px #888;
    }

    .overlay a {
        display:block;
        text-decoration:none;
        color:#000;
        text-align:center;
        border-radius:6px;
        font-size:14px;
        font-weight:bold;
        overflow:hidden;
        background: #7AC6FF;
        background: #7AC6FF url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;
    }
    
    .overlay .title {
        display:block;
        text-align:center;
        background:#fff;
        margin-right:35px;
        padding:10px 15px;
        font-size:14px;
        font-weight:bold;
    }

    .overlay:after {
        content:'';
        position:absolute;
        margin-left:-12px;
        left:50%;
        bottom:-12px;
        width:22px;
        height:12px;
        background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')
    }

</style>