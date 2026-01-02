/**
 * UI 헬퍼 함수들
 */

/**
 * 모달 열기
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * 모달 닫기
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Alert 표시
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} active`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.maxWidth = '400px';
    alertDiv.style.zIndex = '2000';

    document.body.appendChild(alertDiv);

    if (duration > 0) {
        setTimeout(() => {
            alertDiv.remove();
        }, duration);
    }

    return alertDiv;
}

/**
 * 로딩 상태 표시
 */
function setLoading(element, isLoading) {
    if (isLoading) {
        element.disabled = true;
        element.dataset.originalText = element.textContent;
        element.textContent = '로딩 중...';
    } else {
        element.disabled = false;
        element.textContent = element.dataset.originalText || element.textContent;
    }
}

/**
 * 날짜 포맷팅
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * 모달 외부 클릭 닫기
 */
function setupModalCloseOnClickOutside(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modalId);
        }
    });
}

/**
 * 폼 데이터 객체로 변환
 */
function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

/**
 * 폼 초기화
 */
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * 요소 숨기기/보이기
 */
function toggleDisplay(elementId, show = null) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (show === null) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    } else {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 확인 대화상자
 */
// Preserve native confirm to avoid accidental recursion when overriding.
// Use assignment (not a function declaration) so we capture the native
// implementation before we override `window.confirm`.
const _nativeConfirm = (typeof window !== 'undefined' && window.confirm && window.confirm.bind)
    ? window.confirm.bind(window)
    : function () { return true; };

window.confirm = function(message) {
    return _nativeConfirm(message);
};
