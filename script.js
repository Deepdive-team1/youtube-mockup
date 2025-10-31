// script.js

//기본 영상리스트 정보 
// const videoData = [
//   {
//     id: 1,
//     title: "고양이 Cat 영상 이미지",
//     channel: "고양이",
//     img: "images/cat.png",
//     description: "귀여운 고양이 영상입니다. <br /> 매일 새로운 고양이 영상이 올라옵니다.",
//     views: "10만회",
//     time: "2일 전",
//     subss: "100만명",
//     thumbs: "1.2만",
//   },
//   {
//     id: 2,
//     title: "강아지 Dog 영상 이미지",
//     channel: "강아지",
//     img: "images/dog.png",
//     description: "활발한 강아지들의 일상입니다. <br /> 지친 하루에 활력을 줍니다.",
//     views: "10만회",
//     time: "2일 전",
//     subss: "112만명",
//     thumbs: "1.5만",
//   },
//   {
//     id: 3,
//     title: "펭귄 Penguin 영상 이미지",
//     channel: "펭귄",
//     img: "images/penguin.png",
//     description: "남극의 귀염둥이 펭귄 영상입니다. <br /> 추위를 잊게 하는 매력!",
//     views: "10만회",
//     time: "2일 전",
//     subss: "80만명",
//     thumbs: "1만",
//   },
// ];





// jsonplaceholder 데이터 받아오기
// postData를 가져온 후, 필요한 부분은 랜덤값으로 채워넣어 사용함
let postData = [];
let videoData = [];

const postPromise = fetch('https://jsonplaceholder.typicode.com/posts')
  .then((response) => response.json())
  .then((results) => {
    console.log("데이터 불러오기 성공");

    // results는 postData의 결과 배열입니다.
    postData = results;
    
    // 데이터 구조에 post 데이터를 넣고, 필요한 부분을 메꿔넣음
    videoData = postData.map((post) => {
      
      // placehold.co의 사진을 일괄적용
      const imgUrl = "https://placehold.co/600x400"; 
      
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
    } else {
        renderVideoList(videoData);
    }
    
  }).catch((error) => {
    console.error("데이터 받아오기 실패:", error);
  });






// 화면상에 영상 리스트 추가
const videoContainer = document.querySelector('.video-section');
const template = document.getElementById('video-card-template');


function renderVideoList(dataArray) {
  if (videoContainer && template){
    const fragment = document.createDocumentFragment();
      dataArray.forEach(data => {
          // 1. cloneNode 함수를 사용하여 노드들이 개별적으로 동작하도록 깊은 복사함
          const newCard = template.content.cloneNode(true).firstElementChild;

          // 2. 복제된 노드 내용 수정
          newCard.href = `watch.html?id=${data.id}`;
          
          // 자식 요소 내용 수정
          newCard.querySelector('img').src = data.img;
          newCard.querySelector('img').alt = data.title;
          newCard.querySelector('.video-title').textContent = data.title;
          newCard.querySelector('.video-channel').textContent = data.channel;
          newCard.querySelector('.video-views').textContent = `${data.views} • ${data.time}`;

          // 3. fragment에 추가하여 바로 HTML에 삽입되지 않고, 임시로 데이터들을 담아둠
          fragment.appendChild(newCard);
      });
    // 4. HTML에 필요한 노드들을 한 번에 삽입
    videoContainer.appendChild(fragment);
  }
}




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

  console.log(video);
  
  // 영상 api를 바로 삽입하여 썸네일 이미지를 적용시킬 필요가 없는 상태이므로 주석처리함
  //document.querySelector('.video-player img').src = video.img;
  document.querySelector('.watch-title').textContent = video.title;
  document.querySelector('.channel-name').textContent = video.channel;
  document.querySelector('.channel-subs').textContent = `구독자 ${video.subss}`; 
  document.querySelector('.action-buttons button:first-child').innerHTML = `<i class="bi bi-hand-thumbs-up"></i> ${video.thumbs}`; 

  const descriptionBox = document.querySelector('.description-box');
  descriptionBox.querySelector('p:first-child').textContent = `조회수 ${video.views} • ${video.time}`;
  descriptionBox.querySelector('p:last-child').innerHTML = video.description; 
}




//좋아요, 싫어요 버튼 토글
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
