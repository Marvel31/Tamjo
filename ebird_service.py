import requests
from config import Config

EBIRD_API_BASE_URL = Config.EBIRD_API_BASE_URL
EBIRD_API_KEY = Config.EBIRD_API_KEY

def search_ebird_species(query):
    """
    eBird API에서 새 종 검색
    
    Args:
        query (str): 검색할 새 이름 (영문)
    
    Returns:
        list: 매칭되는 종 정보 리스트
        [
            {
                'speciesCode': 'norwhe',
                'comName': 'Northern Wrentit',
                'sciName': 'Chamaea fasciata'
            },
            ...
        ]
    """
    if not EBIRD_API_KEY:
        return []
    
    try:
        url = f'{EBIRD_API_BASE_URL}/ref/taxonomy/ebird'
        params = {
            'fmt': 'json',
            'key': EBIRD_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        
        all_species = response.json()
        
        # 검색어로 필터링 (대소문자 구분 없음)
        query_lower = query.lower()
        results = [
            {
                'speciesCode': sp.get('code'),
                'comName': sp.get('comName'),
                'sciName': sp.get('sciName')
            }
            for sp in all_species
            if query_lower in sp.get('comName', '').lower() or
               query_lower in sp.get('sciName', '').lower()
        ]
        
        return results[:20]  # 최대 20개 결과 반환
        
    except requests.RequestException as e:
        print(f"eBird API 에러: {e}")
        return []

def get_ebird_url(species_code):
    """eBird 프로필 URL 생성"""
    return f'https://ebird.org/species/{species_code}'

def validate_species_code(species_code):
    """종 코드 유효성 검증 (간단한 형식 체크)"""
    # eBird 종 코드는 보통 소문자 영문자로 이루어짐
    return isinstance(species_code, str) and species_code.isalnum() and len(species_code) > 0
