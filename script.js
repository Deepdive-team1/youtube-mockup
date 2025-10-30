// script.js

//기본 영상리스트 정보 
const videoData = [
  {
    id: 1,
    title: "고양이 Cat 영상 이미지",
    channel: "고양이",
    img: "images/cat.png",
    description: "귀여운 고양이 영상입니다. <br /> 매일 새로운 고양이 영상이 올라옵니다.",
    views: "10만회",
    time: "2일 전",
    subss: "100만명",
    thumbs: "1.2만",
  },
  {
    id: 2,
    title: "강아지 Dog 영상 이미지",
    channel: "강아지",
    img: "images/dog.png",
    description: "활발한 강아지들의 일상입니다. <br /> 지친 하루에 활력을 줍니다.",
    views: "10만회",
    time: "2일 전",
    subss: "112만명",
    thumbs: "1.5만",
  },
  {
    id: 3,
    title: "펭귄 Penguin 영상 이미지",
    channel: "펭귄",
    img: "images/penguin.png",
    description: "남극의 귀염둥이 펭귄 영상입니다. <br /> 추위를 잊게 하는 매력!",
    views: "10만회",
    time: "2일 전",
    subss: "80만명",
    thumbs: "1만",
  },
];

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

  if (videoCards.length > 0) {
    let cardCount = 0;
    
    videoCards.forEach((card) => {
      const title = card.querySelector(".video-title").textContent.toLowerCase();
      const channelName = card.querySelector(".video-channel").textContent.toLowerCase();

      if (title.includes(query) || channelName.includes(query)||query == "") {
        card.style.display = "";
        cardCount++;
      } else {
        card.style.display = "none";
      }
    });
    
    if(cardCount === 0 && query !== ""){
      alert('조건에 맞는 영상이 없습니다.');
    }

  } else { 
      if (query) {
          // 검색어를 URL 쿼리로 전달하며 index.html로 이동
          window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      } else {
          // 검색어가 없으면 그냥 index.html로 이동
          window.location.href = `index.html`;
      }
      return; 
  }
}

if (searchBtn && searchInput ) {
  searchBtn.addEventListener("click", filterVideos);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      filterVideos();
    }
  });
}

//watch 로딩 함수 
function loadWatchPage() {
  //url과 id번호 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = parseInt(urlParams.get('id'));

  const video = videoData.find(item => item.id === videoId); 

  //url이 잘못된 경우 
  if (!video) {
    alert("비디오 정보를 찾을 수 없습니다. 메인 페이지로 이동합니다.");
    window.location.href = "index.html";
    return;
  }
  
  document.querySelector('.video-player img').src = video.img;
  document.querySelector('.watch-title').textContent = video.title;
  document.querySelector('.channel-name').textContent = video.channel;
  document.querySelector('.channel-subs').textContent = `구독자 ${video.subss}`; 
  document.querySelector('.action-buttons button:first-child').innerHTML = `<i class="bi bi-hand-thumbs-up"></i> ${video.thumbs}`; 

  const descriptionBox = document.querySelector('.description-box');
  descriptionBox.querySelector('p:first-child').textContent = `조회수 ${video.views} • ${video.time}`;
  descriptionBox.querySelector('p:last-child').innerHTML = video.description; 
}

if (window.location.pathname.includes('watch.html')) {
    loadWatchPage(); 
}