<template lang="">
    <div>
        
    </div>
</template>
<script>
export default {
mounted(){
    const script = document.createElement('script')
    script.onload = () => {
        const naver_id_login = new window.naver_id_login("IiiFJKBOyzL3qvfXasPq", "http://localhost:8181/api/naver/callback")
        alert(naver_id_login.oauthParams.access_token)
    }
    document.write(script)
}
}

</script>
<style lang="">
    
</style>