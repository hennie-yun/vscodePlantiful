<template lang="">
        <h1> 글 등록 </h1>
        <div style="padding:30px;">
            <form class="row g-3 needs-validation">
                <div class="row">
                <!-- radio (사이트 선택) -->
                    <div class="col-2 form-check">
                        <input type="radio" class="form-check-input" value="넷플릭스" id="validationFormCheck2" name="radio-stacked site" v-model="site" required>
                        <label class="form-check-label" for="validationFormCheck2">넷플릭스</label>
                    </div>
                    <div class="col-2 form-check">
                        <input type="radio" class="form-check-input" value="티빙" id="validationFormCheck4" name="radio-stacked site" v-model="site" required>
                        <label class="form-check-label" for="validationFormCheck4">티빙</label>
                    </div>
                    <div class="col-2 form-check">
                        <input type="radio" class="form-check-input" value="디즈니플러스" id="validationFormCheck6" name="radio-stacked site" v-model="site" required>
                        <label class="form-check-label" for="validationFormCheck6">디즈니플러스</label>
                    </div>
                    <div class="col-2 form-check">
                        <input type="radio" class="form-check-input" value="프라임비디오" id="validationFormCheck7" name="radio-stacked site" v-model="site" required>
                        <label class="form-check-label" for="validationFormCheck7">프라임비디오</label>
                    </div>
                    <div class="col-2 form-check">
                        <input type="radio" class="form-check-input" value="웨이브" id="validationFormCheck5" name="radio-stacked site" v-model="site" required>
                        <label class="form-check-label" for="validationFormCheck5">웨이브</label>
                    </div>
                    <div class="col-2 form-check mb-3">
                        <input type="radio" class="form-check-input" id="validationFormCheck3" name="radio-stacked site" v-model="site" required>
                        <label class="form-check-label" for="validationFormCheck3">왓차</label>
                        <div class="invalid-feedback"> 공유를 진행할 사이트를 선택해주세요.</div>
                    </div>
                </div>

                <div class="col-8">
                    <label for="validationCustom02" class="form-label">제목</label>
                    <input type="text" class="form-control" id="validationCustom02" v-model="title" placeholder="제목을 입력해주세요." required>
                    <div class="invalid-feedback">
                    제목을 입력해주세요.
                    </div>
                </div>
                <div class="col-4">
                    <label for="validationCustom01" class="form-label">작성자</label>
                    <input type="text" class="form-control" id="validationCustom01" name="email" v-model="email" required readonly>
                </div>
                
                <div class="row">
                    <div class="col">
                        <label for="validationCustom03" class="form-label">전체 금액 입력</label>
                        <input type="number" class="form-control" v-model="total_point" id="validationCustom03" required>
                        <div class="invalid-feedback">
                        Please provide a valid city.
                        </div>
                        
                    </div>
                    <div class="col">
                        <label for="validationCustom04" class="form-label">전체 모집 인원</label>
                        <input type="number" class="form-control" v-model="total_people" id="validationCustom04" required>
                        <div class="invalid-feedback">
                        모집할 전체 인원수(본인 포함)을 입력해주세요.
                        </div>
                    </div>
                </div>
                <div>
                     * 지불한 총 금액을 입력해주세요. 모집 인원에 따라 자동으로 인당 금액이 계산됩니다.
                </div>

                <div class="row">
                    <div class="col">
                        <label for="validationCustom04" class="form-label"> 모집 마감일 </label>
                        <input type="date" v-on:click="datepicker" v-model="recruit_endperiod" placeholder="날짜 선택"> 
                    </div>
                    
                    <div class="col">
                        <label for="validationCustom04" class="form-label"> 구독 시작일 </label>
                        <input type="date" v-on:click="datepicker" v-model="subscribe_startdate" placeholder="날짜 선택"> 
                    </div>
                    ~
                    <div class="col">
                        <label for="validationCustom04" class="form-label"> 구독 마감일 </label>
                        <input type="date" v-model="subscribe_enddate" placeholder="날짜 선택"> 
                    </div>
                    <div class="col">
                        <label for="validationCustom04" class="form-label"> 포인트 지불 날짜 </label>
                        <input type="date" v-model="payment_date" placeholder="날짜 선택"> 
                    </div>
                </div>

                <div class="col-12">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
                        <label class="form-check-label" for="invalidCheck">
                            모집 마감 기간까지 모집 인원이 충족되지 않을경우 모집은 자동 취소됩니다. 
                        </label>
                        <div class="invalid-feedback">
                            이용안내에 동의하셔야 글 등록이 가능합니다.
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" v-on:click="add">글 등록하기 </button>
                </div>
            </form>
        </div>
        
</template>

<script>
import dayjs from 'dayjs'

export default {

    name: 'SubscribeBoardAdd',

    component() {
        dayjs
    },
    data() {
        return {
            novalidate: true,
            email: sessionStorage.getItem('loginId'),
            title: '',
            site: '',
            total_point: 0,
            total_people: 0,
            register_date: dayjs().format("YYYY/MM/DD"),
            recruit_endperiod: dayjs().format("YYYY/MM/DD"),
            payment_date: dayjs().format("YYYY/MM/DD"),
            subscribe_startdate: dayjs().format("YYYY/MM/DD"),
            subscribe_enddate: dayjs().format("YYYY/MM/DD"),

            
        }
    },

    methods: {
        
        add() {


            const self = this;
            let formdata = new FormData();
            formdata.append('email', self.email)
            formdata.append('title', self.title)
            formdata.append('site', self.site)
            formdata.append('total_point', self.total_point)
            formdata.append('total_people', self.total_people)
            formdata.append('register_date', dayjs(self.register_date))
            formdata.append('recruit_endperiod', dayjs(self.recruit_endperiod))
            formdata.append('payment_date', dayjs(self.payment_date))
            formdata.append('subscribe_startdate', dayjs(self.subscribe_startdate))
            formdata.append('subscribe_startdate', dayjs(self.subscribe_startdate))
            formdata.append('subscribe_enddate', dayjs(self.subscribe_enddate))

            self.$axios.post('http://localhost:8181/subscribeboard', formdata)
                .then(function (res) {
                    if (res.status == 200) {
                        let dto = res.data.dto2
                        alert(" 글이 등록되었습니다.")
                    } else {
                        alert('에러코드:' + res.status)
                    }
                })

        }
    }
}

</script>
<style lang="">
    
</style>