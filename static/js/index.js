/**
 * 홈 페이지 - 지역 목록
 */

let locations = [];

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadLocations();
    setupModalCloseOnClickOutside('addLocationModal');
});

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 지역 추가 버튼
    const addLocationBtn = document.getElementById('addLocationBtn');
    if (addLocationBtn) {
        addLocationBtn.addEventListener('click', () => openModal('addLocationModal'));
    }

    // 지역 추가 폼 제출
    const addLocationForm = document.getElementById('addLocationForm');
    if (addLocationForm) {
        addLocationForm.addEventListener('submit', handleAddLocation);
    }

    // 모달 닫기 버튼
    const closeBtn = document.querySelector('#addLocationModal .modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal('addLocationModal'));
    }
}

/**
 * 지역 목록 로드
 */
async function loadLocations() {
    try {
        const container = document.getElementById('locationsContainer');
        container.innerHTML = '<div class="spinner"></div>';

        locations = await LocationAPI.getAll();

        if (locations.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1;">
                    <div class="empty-state">
                        <div class="empty-state-icon">🗺️</div>
                        <h3>아직 지역이 없습니다</h3>
                        <p>새로운 지역을 추가해보세요!</p>
                        <button class="btn btn-primary" onclick="openModal('addLocationModal')">
                            지역 추가하기
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = locations.map(location => `
            <div class="card" onclick="goToLocation(${location.id})">
                <div class="card-image">🌍</div>
                <div class="card-content">
                    <div class="card-title">${escapeHtml(location.name)}</div>
                    ${location.description ? `<div class="card-description">${escapeHtml(location.description)}</div>` : ''}
                    <div class="card-meta">생성일: ${formatDate(location.created_at)}</div>
                    <div class="card-actions">
                        <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); editLocation(${location.id})">
                            수정
                        </button>
                        <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); deleteLocation(${location.id})">
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        showAlert(`지역 로드 실패: ${error.message}`, 'error');
        document.getElementById('locationsContainer').innerHTML = `
            <div style="grid-column: 1 / -1;">
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>지역을 불러올 수 없습니다</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="loadLocations()">
                        다시 시도
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * 지역 추가
 */
async function handleAddLocation(event) {
    event.preventDefault();

    const data = getFormData('addLocationForm');
    const button = event.target.querySelector('button[type="submit"]');

    try {
        setLoading(button, true);
        await LocationAPI.create(data);
        showAlert('지역이 추가되었습니다!', 'success');
        resetForm('addLocationForm');
        closeModal('addLocationModal');
        await loadLocations();
    } catch (error) {
        showAlert(`지역 추가 실패: ${error.message}`, 'error');
    } finally {
        setLoading(button, false);
    }
}

/**
 * 지역 수정
 */
async function editLocation(locationId) {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    const name = prompt('지역명:', location.name);
    if (name === null) return;

    const description = prompt('설명:', location.description || '');
    if (description === null) return;

    try {
        await LocationAPI.update(locationId, { name, description });
        showAlert('지역이 수정되었습니다!', 'success');
        await loadLocations();
    } catch (error) {
        showAlert(`지역 수정 실패: ${error.message}`, 'error');
    }
}

/**
 * 지역 삭제
 */
async function deleteLocation(locationId) {
    if (!confirm('이 지역과 모든 새 정보가 삭제됩니다. 계속하시겠습니까?')) {
        return;
    }

    try {
        await LocationAPI.delete(locationId);
        showAlert('지역이 삭제되었습니다!', 'success');
        await loadLocations();
    } catch (error) {
        showAlert(`지역 삭제 실패: ${error.message}`, 'error');
    }
}

/**
 * 지역 상세 페이지로 이동
 */
function goToLocation(locationId) {
    window.location.href = `/location/${locationId}`;
}
