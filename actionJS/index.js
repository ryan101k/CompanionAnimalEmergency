// 예시: 세션 스토리지에 저장된 사용자 권한을 확인하는 로직
document.addEventListener("DOMContentLoaded", function() {
    // 세션 스토리지에서 "userRole" 값을 확인 (예: "admin"이면 관리자)
    var userRole = sessionStorage.getItem("userRole");

    // 조건: 사용자가 관리자일 때 관리자 페이지 링크를 보여줌
    if (userRole === "admin") {
        document.getElementById("admin-link").style.display = "block";
    }
});