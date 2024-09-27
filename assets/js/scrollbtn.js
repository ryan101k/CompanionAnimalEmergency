
   
     // 스크롤 버튼 이벤트 
    document.getElementById("scroll-to-top").addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("scroll-to-bottom").addEventListener("click", function() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });



       // 스크롤 감지 및 버튼 표시 제어 이벤트
       window.addEventListener("scroll", function() {
        let scrollTop = window.scrollY;
        let scrollBottom = document.body.scrollHeight - window.innerHeight;

        // 제일 위에 있을 때 'scroll-to-top' 버튼 숨기기
        

        // 제일 아래에 있을 때 'scroll-to-bottom' 버튼 숨기기
 
    });