// 다크모드 토글 버튼 기능
const toggleBtn = document.querySelector(".toggle-btn");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const icon = toggleBtn.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.className = "bi bi-sun";
  } else {
    icon.className = "bi bi-moon";
  }
});

// 검색 필터링
const searchInput = document.querySelector(".header-center input");
const searchBtn = document.querySelector(".search-btn");
const videoCards = document.querySelectorAll(".video-card");

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

searchBtn.addEventListener("click", filterVideos);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    filterVideos();
  }
});
