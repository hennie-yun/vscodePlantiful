import axios from "axios"

const kakaoHeader = {
  "Authorization": "46ce9a4e2e9c2327d2f47a43d1192c7b",
  "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
};

const getKakaoToken = async (code, uri) => {
  try {
    const data = {
      grant_type: "authorization_code",
      client_id: "d54083f94196531e75d7de474142e52e",
      redirect_uri: uri,
      code: code
    };
    const queryString = Object.keys(data)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
      .join("&");
    
    const result = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      queryString,
      { headers: kakaoHeader }
    );
    console.log(result);

    console.log("카카오 토큰", queryString);
    return result;
  } catch (e) {
    return e;
  }
};

const getKakaoUserInfo = async () => {
  let data = "";
  console.log(1);
  await window.Kakao.API.request({
    url: "/v2/user/me",
    success: function(response) {
      data = response;
    },
    fail: function(error) {
      console.log(error);
    }
  });
  console.log("카카오 계정 정보", data);
  return data;
};

const dropKakaoUser = async () => {
  let data = "";
  console.log(1);
  await window.Kakao.API.request({
    url: "/v1/user/unlink",
    success: function(response) {
      data = response;
    },
    fail: function(error) {
      console.log(error);
    }
  });
  console.log("카카오 계정 정보", data);
  // return data;
};

export { getKakaoToken, getKakaoUserInfo, dropKakaoUser };
