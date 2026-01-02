/**
 * API 호출 유틸리티
 */

const API_BASE_URL = '';

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Location API
 */
const LocationAPI = {
    getAll: () => apiCall('/api/locations'),
    getById: (id) => apiCall(`/api/locations/${id}`),
    create: (data) => apiCall('/api/locations', 'POST', data),
    update: (id, data) => apiCall(`/api/locations/${id}`, 'PUT', data),
    delete: (id) => apiCall(`/api/locations/${id}`, 'DELETE')
};

/**
 * Bird API
 */
const BirdAPI = {
    getAll: () => apiCall('/api/birds'),
    getByLocation: (locationId) => apiCall(`/api/birds?location_id=${locationId}`),
    getById: (id) => apiCall(`/api/birds/${id}`),
    create: (data) => apiCall('/api/birds', 'POST', data),
    update: (id, data) => apiCall(`/api/birds/${id}`, 'PUT', data),
    delete: (id) => apiCall(`/api/birds/${id}`, 'DELETE')
};

/**
 * eBird API
 */
const EBirdAPI = {
    search: (query) => apiCall(`/api/ebird/search?query=${encodeURIComponent(query)}`)
};
