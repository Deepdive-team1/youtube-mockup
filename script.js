//jsonplaceholder 데이터 받아오기
//postData를 가져온 후, 필요한 부분은 랜덤값으로 채워넣어 사용함
let postData = [];
let videoData = [];

//무한 스크롤 생성
let page = 0; //페이지 번호
const pageSize = 12; // 한 페이지에 들어갈 데이터량 
let isLoading = false; // 데이터 중복 호출 방지 

//fetch 반복 사용으로 함수화
function fnPostPromise(){
  //데이터 호출 시작
  isLoading = true;

  fetch('https://jsonplaceholder.typicode.com/posts')
  .then((response) => response.json())
  .then((results) => {
    console.log("데이터 불러오기 성공");

    //results는 postData의 결과 배열입니다.
    //postData = results;
    //무한 스크롤 생성을 위해서 한번에 삽입하는 데이터량 조절
    const start = page * pageSize;
    const end = ++page * pageSize;

    results.slice(start, end).forEach(obj => {
      postData.push(obj);  
    });


    // 데이터 구조에 post 데이터를 넣고, 필요한 부분을 메꿔넣음
    videoData = postData.map((post) => {

      // picsum.photos의 사진을 동적으로 적용
      const imgUrl = `https://picsum.photos/seed/${post.id}/600/350`; 
      
      // 데이터 객체 생성
      const newVideo = {
        id: post.id,
        title: post.title, 
        channel: `채널 ${post.userId}`, 
        img: imgUrl, 
        description: post.body.replace(/\n/g, "<br />"), 
        views: `${Math.floor(Math.random() * 100) + 1}만회`, 
        time: `${Math.floor(Math.random() * 7) + 1}일 전`, 
        subss: `${Math.floor(Math.random() * 50) + 50}만명`, 
        thumbs: `${Math.floor(Math.random() * 20) + 1}만`, 
      };

      return newVideo;
    }); 


    // 데이터가 준비된 후에 렌더링 및 페이지 로딩 함수 호출
    if (window.location.pathname.includes('watch.html')) {

        loadWatchPage(); 
        renderWatchlistVideos(videoData);
    } else {
      renderVideoList(videoData);
    }

  }).catch((error) => {
    console.error("데이터 받아오기 실패:", error);
  });

}


// 화면상에 영상 리스트 추가
const videoContainer = document.querySelector('.video-section');
const template = document.getElementById('video-card-template');


function renderVideoList(dataArray) {
  if (videoContainer && template){
    const fragment = document.createDocumentFragment();

      dataArray.forEach(data => {
          // cloneNode 함수를 사용하여 노드들이 개별적으로 동작하도록 깊은 복사함
          const newCard = template.content.cloneNode(true).firstElementChild;

          // 복제된 노드 내용 수정
          newCard.href = `watch.html?id=${data.id}`;
          
          // 자식 요소 내용 수정
          newCard.querySelector('img').src = data.img;
          newCard.querySelector('img').alt = data.title;
          newCard.querySelector('.video-title').textContent = data.title;
          newCard.querySelector('.video-channel').textContent = data.channel;
          newCard.querySelector('.video-views').textContent = `${data.views} • ${data.time}`;

          // fragment에 추가하여 바로 HTML에 삽입되지 않고, 임시로 데이터들을 담아둠
          fragment.appendChild(newCard);
      });
    // HTML에 필요한 노드들을 한 번에 삽입
    videoContainer.appendChild(fragment);
    //데이터 호출 완료
    isLoading = false;
  }
}


// watch.html에서 다음 동영상 리스트를 렌더링하는 함수
function renderWatchlistVideos(dataArray) {
    const playlistContainer = document.querySelector('.playlist-videos');
    const playlistTemplate = document.getElementById('playlist-card-template');

    if (playlistContainer && playlistTemplate) {

        const fragment = document.createDocumentFragment();

        dataArray.forEach(data => {
            const newCard = playlistTemplate.content.cloneNode(true).firstElementChild;
  
            newCard.href = `watch.html?id=${data.id}`;
            
            newCard.querySelector('img').src = data.img;
            newCard.querySelector('img').alt = data.title;
            newCard.querySelector('.video-title').textContent = data.title;
            newCard.querySelector('.video-channel').textContent = data.channel;
            newCard.querySelector('.video-views').textContent = `${data.views} • ${data.time}`;

            fragment.appendChild(newCard);
        });

        playlistContainer.appendChild(fragment);
        //데이터 호출 완료
        isLoading = false;
    }
}

// 🔍 버튼 클릭 → 검색창 열기 & 아이콘 숨기기
const searchToggleBtn = document.querySelector('.search-toggle-btn');
const headerCenter = document.querySelector('.header-center');
const headerRight = document.querySelector('.header-right');

searchToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // 클릭 버블링 방지
  headerCenter.classList.add('show');
  headerRight.classList.add('hide-search-icon');

  // 인풋에 포커스
  const input = headerCenter.querySelector('input');
  input.focus();
});

// 🔍 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
  if (
    headerCenter.classList.contains('show') &&
    !headerCenter.contains(e.target) &&
    !searchToggleBtn.contains(e.target)
  ) {
    headerCenter.classList.remove('show');
    headerRight.classList.remove('hide-search-icon');
    resetVideoFilter();
  }
});

function resetVideoFilter() {
  const videoCards = document.querySelectorAll('.video-card-link');
  videoCards.forEach((card) => {
    card.style.display = ''; // 전부 다시 보이기
  });
  const searchInput = document.querySelector('.header-center input');
  if (searchInput) searchInput.value = ''; // 검색어 초기화
}

// 사이드바 토글
const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');

// 오버레이 생성 (배경 클릭 시 닫기용)
let overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // 이벤트 버블링 방지
  sidebar.classList.toggle('show');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('show');
  overlay.classList.remove('active');
});



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

function filterVideos() {
  const query = searchInput.value.trim().toLowerCase();

  const videoCards = document.querySelectorAll(".video-card-link"); // index.html에만 있음

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

  console.log(video);
  
  // 영상 api를 바로 삽입하여 썸네일 이미지를 적용시킬 필요가 없는 상태이므로 주석처리함
  //document.querySelector('.video-player img').src = video.img;
  document.querySelector('.watch-title').textContent = video.title;
  document.querySelector('.channel-name').textContent = video.channel;
  document.querySelector('.channel-subs').textContent = `구독자 ${video.subss}`; 
  document.querySelector('.action-buttons button:first-child').innerHTML = `<i class="bi bi-hand-thumbs-up"></i>&nbsp;${video.thumbs}`; 

  const descriptionBox = document.querySelector('.description-box');
  descriptionBox.querySelector('p:first-child').textContent = `조회수 ${video.views} • ${video.time}`;
  descriptionBox.querySelector('p:last-child').innerHTML = video.description; 
}




// 좋아요, 싫어요 버튼 토글
document.querySelectorAll(".feedback-buttons").forEach(btn => {
  btn.addEventListener("click", () => {

    const iconElement = btn.querySelector('i');
    const iconClass = btn.classList.contains('unlike')? 'bi-hand-thumbs-down' : 'bi-hand-thumbs-up';

    btn.classList.toggle("clicked");

    const newIconClass = btn.classList.contains("clicked")? `${iconClass}-fill`:iconClass
    iconElement.classList.remove(iconClass);
    iconElement.classList.add(newIconClass);
    
  })
})



// 공유 버튼 토글
document.querySelectorAll(".subscribe-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("subscribed");
    btn.innerHTML = btn.classList.contains("subscribed") ? 
      `<i class="bi bi-bell"></i>&nbsp;<i class="bi bi-chevron-down"></i>` : "구독";
  })
})


//초기 데이터 생성  
fnPostPromise();








