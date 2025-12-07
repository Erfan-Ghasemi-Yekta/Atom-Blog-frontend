// js/footer.js
document.addEventListener("DOMContentLoaded", function () {
    const footerContainer = document.getElementById("footer");
    if (!footerContainer) {
        console.warn("⚠️ عنصر با id='footer' پیدا نشد.");
        return;
    }

    fetch("../html/footer.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error("خطا در دریافت فایل فوتر");
            }
            return response.text();
        })
        .then((data) => {
            footerContainer.innerHTML = data;
        })
        .catch((error) => console.error("خطا در بارگذاری فوتر:", error));
});
