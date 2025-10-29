// script.js (수정본)

// 다크모드 토글 버튼 기능
const toggleBtn = document.querySelector(".toggle-btn");

// ‼️ toggleBtn이 페이지에 존재할 때만 이벤트 리스너 추가
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const icon = toggleBtn.querySelector("i");
    if (document.body.classList.contains("dark-mode")) {
      icon.className = "bi bi-sun";
    } else {
      icon.className = "bi bi-moon";
    }
  });
}

// 검색 필터링
const searchInput = document.querySelector(".header-center input");
const searchBtn = document.querySelector(".search-btn");
const videoCards = document.querySelectorAll(".video-card"); // index.html에만 있음

function filterVideos() {
  const query = searchInput.value.trim().toLowerCase();

  videoCards.forEach((card) => {
    const title = card.querySelector(".video-title").textContent.toLowerCase();

    if (title.includes(query) || query === "") {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// ‼️ 검색 관련 요소들이 모두 존재할 때(index.html)만 이벤트 리스너 추가
if (searchBtn && searchInput && videoCards.length > 0) {
  searchBtn.addEventListener("click", filterVideos);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      filterVideos();
    }
  });
}