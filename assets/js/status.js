const serviceKey = 'api키넣는곳';  // 발급받은 인증키
const apiUrl = `https://apis.data.go.kr/6310000/petsHospital/getPetHospitalList?numOfRows=100&pageNo=1&serviceKey=${encodeURIComponent(serviceKey)}`;

var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(35.5383773, 129.3113596),  // 울산 좌표
    zoom: 12
});

var markers = [], infoWindows = [];
const hospitalList = document.getElementById('hospital-list-items');
const closedHospitalList = document.getElementById('closed-hospital-list-items');

const selectDateElement = document.getElementById('selectDate');
const applyDateBtn = document.getElementById('applyDateBtn');

// 병원 영업 여부 판단
function isOpen(hospital, date) {
    const wkdBsn = hospital.getElementsByTagName("wkdBsn")[0].textContent;
    const wknBsn = hospital.getElementsByTagName("wknBsn")[0].textContent;
    const currentDay = new Date(date).getDay();  // 일요일(0)~토요일(6)
    
    // 영업 시간이 '-'로 되어있는 경우 처리
    if (wkdBsn === '-' || wknBsn === '-') return false;

    const openTime = currentDay === 0 || currentDay === 6 ? wknBsn : wkdBsn;
    return openTime.includes('-') ? false : true; // 날짜 기준으로 영업 여부만 체크
}

// 동물병원 API 호출
fetch(apiUrl)
    .then(response => response.text())  // XML 응답을 텍스트로 받음
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");

        const resultCode = xmlDoc.getElementsByTagName("resultCode")[0].textContent;
        const totalCount = xmlDoc.getElementsByTagName("totalCount")[0].textContent;

        if (resultCode === "00" && totalCount > 0) {
            const hospitals = xmlDoc.getElementsByTagName("list");

            for (let i = 0; i < hospitals.length; i++) {
                const hospital = hospitals[i];
                const lat = parseFloat(hospital.getElementsByTagName("lat")[0].textContent);
                const lng = parseFloat(hospital.getElementsByTagName("lng")[0].textContent);
                const facility = hospital.getElementsByTagName("facility")[0].textContent;
                const address = hospital.getElementsByTagName("address")[0].textContent;
                const tel = hospital.getElementsByTagName("tel")[0].textContent;
                const wkdBsn = hospital.getElementsByTagName("wkdBsn")[0].textContent === '-' ? "정보 없음" : hospital.getElementsByTagName("wkdBsn")[0].textContent;
                const wknBsn = hospital.getElementsByTagName("wknBsn")[0].textContent === '-' ? "정보 없음" : hospital.getElementsByTagName("wknBsn")[0].textContent;
                const cls = hospital.getElementsByTagName("cls")[0].textContent || "정보 없음";
                const position = new naver.maps.LatLng(lat, lng);

                // 마커 생성
                const marker = new naver.maps.Marker({
                    position: position,
                    map: map,
                    title: facility
                });

                // 인포윈도우 생성
                const infoWindow = new naver.maps.InfoWindow({
                    content: `
                        <div class="info-window-content" style="width:200px;padding:10px;">
                            <h4>${facility}</h4>
                            <p><b>주소:</b> ${address}</p>
                            <p><b>전화:</b> ${tel}</p>
                            <p><b>평일 영업시간:</b> ${wkdBsn}</p>
                            <p><b>주말 영업시간:</b> ${wknBsn}</p>
                            <p><b>휴무일:</b> ${cls}</p>
                        </div>
                    `
                });

                // 마커 클릭 시 인포윈도우 표시
                naver.maps.Event.addListener(marker, 'click', function() {
                    infoWindow.open(map, marker);
                });

                // 병원 목록에 추가
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${facility}</strong><br>${address}<br>전화: ${tel}`;
                listItem.onclick = function() {
                    map.setCenter(position);
                    infoWindow.open(map, marker);
                };

                // 현재 날짜에 따라 영업 여부 확인
                const selectedDate = selectDateElement.value;
                if (isOpen(hospital, selectedDate)) {
                    hospitalList.appendChild(listItem);
                } else {
                    closedHospitalList.appendChild(listItem);
                }

                markers.push(marker);
                infoWindows.push(infoWindow);
            }
        } else {
            console.log('검색 결과가 없습니다.');
            hospitalList.innerHTML = '<li>검색 결과가 없습니다.</li>';
        }
    })
    .catch(error => {
        console.error('API 요청 중 오류 발생:', error);
    });

// 사용자 설정 날짜 적용
applyDateBtn.addEventListener('click', function() {
    const selectedDate = selectDateElement.value;
    hospitalList.innerHTML = '';  // 기존 목록 초기화
    closedHospitalList.innerHTML = '';  // 기존 영업 종료된 목록 초기화

    markers.forEach((marker, index) => {
        const hospital = xmlDoc.getElementsByTagName("list")[index];
        if (isOpen(hospital, selectedDate)) {
            hospitalList.appendChild(marker);
        } else {
            closedHospitalList.appendChild(marker);
        }
    });
});
