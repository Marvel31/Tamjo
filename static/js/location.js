/**
 * 지역 상세 페이지 - 새 목록
 */

let currentLocation = null;
let birds = [];

// URL에서 지역 ID 추출
const locationId = parseInt(window.location.pathname.split('/').pop());

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    if (!locationId) {
        window.location.href = '/';
        return;
    }
    setupEventListeners();
    loadLocationAndBirds();
    setupModalCloseOnClickOutside('addBirdModal');
});

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 새 추가 버튼
    const addBirdBtn = document.getElementById('addBirdBtn');
    if (addBirdBtn) {
        addBirdBtn.addEventListener('click', () => openModal('addBirdModal'));
    }

    // 새 추가 폼 제출
    const addBirdForm = document.getElementById('addBirdForm');
    if (addBirdForm) {
        addBirdForm.addEventListener('submit', handleAddBird);
    }

    // 모달 닫기 버튼
    const closeBtn = document.querySelector('#addBirdModal .modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal('addBirdModal'));
    }

    // 뒤로가기
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => window.location.href = '/');
    }
}

/**
 * eBird 검색 설정
 */
function setupEBirdSearch() {
    const birdNameInput = document.getElementById('birdName');
    const searchResults = document.getElementById('ebirdSearchResults');

    if (!birdNameInput) return;

    // 디바운싱된 검색
    let searchTimeout;
    birdNameInput.addEventListener('input', (event) => {
        clearTimeout(searchTimeout);
        const query = event.target.value.trim();

        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        searchTimeout = setTimeout(() => {
            searchEBird(query);
        }, 300);
    });

    // 검색 결과 외부 클릭 시 닫기
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.form-group') && !event.target.closest('.search-results')) {
            searchResults.classList.remove('active');
        }
    });
}

/**
 * eBird API 검색
 */
async function searchEBird(query) {
    const searchResults = document.getElementById('ebirdSearchResults');

    try {
        searchResults.innerHTML = '<div class="search-result-item" style="text-align: center;">검색 중...</div>';
        searchResults.classList.add('active');

        const results = await EBirdAPI.search(query);

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">검색 결과가 없습니다</div>';
            return;
        }

        searchResults.innerHTML = results.map(bird => `
            <div class="search-result-item" onclick="selectEBirdSpecies(
                '${escapeHtml(bird.comName)}',
                '${escapeHtml(bird.sciName)}',
                '${escapeHtml(bird.speciesCode)}'
            )">
                <div class="search-result-name">${escapeHtml(bird.comName)}</div>
                <div class="search-result-scientific">${escapeHtml(bird.sciName)}</div>
                <div class="search-result-code">${escapeHtml(bird.speciesCode)}</div>
            </div>
        `).join('');

    } catch (error) {
        searchResults.innerHTML = `<div class="search-result-item" style="color: red;">검색 오류: ${escapeHtml(error.message)}</div>`;
    }
}

/**
 * eBird 종 선택
 */
function selectEBirdSpecies(comName, sciName, speciesCode) {
    document.getElementById('birdName').value = comName;
    // 자동으로 eBird 종 페이지 URL 입력
    const ebirdUrl = `https://ebird.org/species/${speciesCode}`;
    const ebirdInput = document.getElementById('ebirdUrl');
    if (ebirdInput) ebirdInput.value = ebirdUrl;
    document.getElementById('ebirdSearchResults').classList.remove('active');
}

/**
 * 지역 및 새 목록 로드
 */
async function loadLocationAndBirds() {
    try {
        const container = document.getElementById('birdsContainer');
        const locationTitle = document.getElementById('locationTitle');

        container.innerHTML = '<div class="spinner"></div>';
        locationTitle.textContent = '로딩 중...';

        // 지역 정보 로드
        currentLocation = await LocationAPI.getById(locationId);
        locationTitle.textContent = escapeHtml(currentLocation.name);

        // 새 목록 로드
        birds = await BirdAPI.getByLocation(locationId);

        if (birds.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1;">
                    <div class="empty-state">
                        <div class="empty-state-icon">🐦</div>
                        <h3>아직 새가 없습니다</h3>
                        <p>${escapeHtml(currentLocation.name)}에서 볼 수 있는 새를 등록해보세요!</p>
                        <button class="btn btn-primary" onclick="openModal('addBirdModal')">
                            새 등록하기
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = birds.map(bird => `
            <div class="card">
                <div class="card-image">
                    ${bird.image_url ? `<img src="${escapeHtml(bird.image_url)}" alt="${escapeHtml(bird.name)}">` : '🐦'}
                </div>
                <div class="card-content">
                    <div class="card-title">${escapeHtml(bird.name)}</div>
                    ${bird.scientific_name ? `<div class="card-subtitle">${escapeHtml(bird.scientific_name)}</div>` : ''}
                    ${bird.ebird_url ? `<div class="card-meta"><a href="${escapeHtml(bird.ebird_url)}" target="_blank">eBird 페이지</a></div>` : ''}
                    <div class="card-actions">
                        <a href="${escapeHtml(bird.ebird_url)}" target="_blank" class="btn btn-primary btn-small" style="flex: 1; text-align: center;">
                            eBird 보기
                        </a>
                        <div style="position: relative;">
                            <button class="btn-menu" onclick="toggleCardMenu(${bird.id}, event)">⋮</button>
                            <div id="menu-${bird.id}" class="card-menu hidden">
                                <button class="card-menu-item" onclick="editBird(${bird.id})">수정</button>
                                <button class="card-menu-item delete" onclick="deleteBird(${bird.id})">삭제</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        showAlert(`로드 실패: ${error.message}`, 'error');
        const container = document.getElementById('birdsContainer');
        container.innerHTML = `
            <div style="grid-column: 1 / -1;">
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>정보를 불러올 수 없습니다</h3>
                    <p>${escapeHtml(error.message)}</p>
                    <button class="btn btn-primary" onclick="loadLocationAndBirds()">
                        다시 시도
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * 새 추가
 */
async function handleAddBird(event) {
    event.preventDefault();

    const name = document.getElementById('birdName').value.trim();
    const ebirdUrl = document.getElementById('ebirdUrl').value.trim();
    const imageUrl = document.getElementById('imageUrl') ? document.getElementById('imageUrl').value.trim() : '';

    if (!name || !ebirdUrl) {
        showAlert('새 이름과 eBird 링크는 필수입니다', 'error');
        return;
    }

    const button = event.target.querySelector('button[type="submit"]');

    try {
        setLoading(button, true);
        await BirdAPI.create({
            name,
            location_id: locationId,
            ebird_url: ebirdUrl,
            image_url: imageUrl
        });
        showAlert('새가 등록되었습니다!', 'success');
        resetForm('addBirdForm');
        closeModal('addBirdModal');
        await loadLocationAndBirds();
    } catch (error) {
        showAlert(`새 등록 실패: ${error.message}`, 'error');
    } finally {
        setLoading(button, false);
    }
}

/**
 * 새 수정
 */
async function editBird(birdId) {
    const bird = birds.find(b => b.id === birdId);
    if (!bird) return;

    const name = prompt('새 이름:', bird.name);
    if (name === null) return;

    const scientificName = prompt('학명:', bird.scientific_name || '');
    if (scientificName === null) return;

    const ebirdCode = prompt('eBird 코드:', bird.ebird_species_code);
    if (ebirdCode === null) return;

    const imageUrl = prompt('이미지 URL:', bird.image_url || '');
    if (imageUrl === null) return;

    try {
        await BirdAPI.update(birdId, {
            name,
            scientific_name: scientificName,
            ebird_species_code: ebirdCode,
            image_url: imageUrl
        });
        showAlert('새 정보가 수정되었습니다!', 'success');
        await loadLocationAndBirds();
    } catch (error) {
        showAlert(`새 수정 실패: ${error.message}`, 'error');
    }
}

/**
 * 새 삭제
 */
async function deleteBird(birdId) {
    if (!confirm('이 새를 삭제하시겠습니까?')) {
        return;
    }

    try {
        await BirdAPI.delete(birdId);
        showAlert('새가 삭제되었습니다!', 'success');
        await loadLocationAndBirds();
    } catch (error) {
        showAlert(`새 삭제 실패: ${error.message}`, 'error');
    }
}

/**
 * 카드 메뉴 토글
 */
function toggleCardMenu(birdId, event) {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${birdId}`);
    const isOpen = !menu.classList.contains('hidden');
    
    // 다른 메뉴 닫기
    document.querySelectorAll('.card-menu').forEach(m => m.classList.add('hidden'));
    
    // 현재 메뉴 토글
    if (isOpen) {
        menu.classList.add('hidden');
    } else {
        menu.classList.remove('hidden');
    }
}

// 메뉴 외부 클릭 시 닫기
document.addEventListener('click', () => {
    document.querySelectorAll('.card-menu').forEach(m => m.classList.add('hidden'));
});
