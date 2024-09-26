
    document.getElementById("scroll-to-top").addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("scroll-to-bottom").addEventListener("click", function() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
