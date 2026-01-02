# 탐조 (Tamjo) - 웹 기반 탐조 가이드 애플리케이션

## 개요

탐조(Bird watching) 애플리케이션으로, 사용자가 특정 지역에서 볼 수 있는 새들을 등록하고 관리할 수 있습니다. 각 새는 eBird로 연결되어 더 자세한 정보를 얻을 수 있습니다.

## 기능

### 1. 지역 관리
- 🗺️ 새로운 지역 추가/수정/삭제
- 각 지역에 대한 설명 추가 가능
- 지역 목록 카드 레이아웃으로 표시

### 2. 새 관리
- 각 지역별로 볼 수 있는 새 등록
- 새의 영문명, 학명, eBird 코드 기록
- 새 이미지 URL 저장 가능
- 새의 상세 정보 수정/삭제

### 3. eBird 연동
- eBird API를 활용한 새 이름 자동 검색
- 종 코드 자동완성 기능
- 각 새의 eBird 프로필 페이지로 직접 링크

### 4. 사용자 인터페이스
- 반응형 카드 레이아웃 (모바일/태블릿/데스크톱)
- 모달 폼으로 새로운 항목 추가
- 직관적인 네비게이션

## 기술 스택

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: SQLite3
- **External API**: eBird API (Cornell Lab of Ornithology)

## 설치 및 실행

### 1. 필수 요구사항

- Python 3.7 이상
- pip (Python 패키지 관리자)

### 2. 설치 단계

```bash
# 프로젝트 디렉토리로 이동
cd c:\repository\Tamjo

# 가상환경 생성
python -m venv venv

# 가상환경 활성화 (Windows)
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 초기화
python database.py
```

### 3. 실행

```bash
# Flask 개발 서버 시작
python app.py
```

애플리케이션은 `http://localhost:5000`에서 실행됩니다.

## 프로젝트 구조

```
Tamjo/
├── app.py                 # Flask 메인 애플리케이션
├── config.py              # 설정 파일
├── database.py            # 데이터베이스 초기화
├── ebird_service.py       # eBird API 통합
├── requirements.txt       # Python 의존성
├── .env                   # 환경 변수 (EBIRD_API_KEY 등)
├── database/
│   └── tamjo.db          # SQLite 데이터베이스 파일
├── templates/
│   ├── index.html        # 홈 페이지 (지역 목록)
│   └── location.html     # 지역 상세 페이지 (새 목록)
└── static/
    ├── css/
    │   └── style.css     # 전체 스타일
    └── js/
        ├── api.js        # API 호출 함수
        ├── ui-helpers.js # UI 헬퍼 함수
        ├── index.js      # 홈 페이지 로직
        └── location.js   # 지역 상세 페이지 로직
```

## API 엔드포인트

### Location (지역)

- `GET /api/locations` - 모든 지역 조회
- `GET /api/locations/<id>` - 특정 지역 조회
- `POST /api/locations` - 새 지역 추가
- `PUT /api/locations/<id>` - 지역 정보 수정
- `DELETE /api/locations/<id>` - 지역 삭제

### Bird (새)

- `GET /api/birds` - 모든 새 조회
- `GET /api/birds?location_id=<id>` - 특정 지역의 새 조회
- `GET /api/birds/<id>` - 특정 새 조회
- `POST /api/birds` - 새 등록
- `PUT /api/birds/<id>` - 새 정보 수정
- `DELETE /api/birds/<id>` - 새 삭제

### eBird

- `GET /api/ebird/search?query=<bird_name>` - 새 이름으로 종 검색

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key-here
EBIRD_API_KEY=your-ebird-api-key-here
```

**eBird API 키 발급:**
1. [eBird API](https://ebird.org/api/keygen) 방문
2. 로그인 후 API 키 발급
3. 발급된 키를 `.env` 파일에 입력

## 배포

### Render에 배포

1. [Render](https://render.com) 가입 및 로그인
2. 새 Web Service 생성
3. GitHub 리포지토리 연결
4. 환경 변수 설정
5. 배포

### PythonAnywhere에 배포

1. [PythonAnywhere](https://www.pythonanywhere.com) 가입
2. 새 Flask 웹 앱 생성
3. 코드 업로드
4. WSGI 설정
5. 배포

자세한 배포 방법은 각 플랫폼의 공식 문서를 참고하세요.

## 사용 방법

### 1. 지역 추가

1. 홈 페이지에서 "+ 지역 추가" 버튼 클릭
2. 지역명과 설명 입력
3. 확인 버튼 클릭

### 2. 새 등록

1. 지역 카드를 클릭하여 상세 페이지 이동
2. "+ 새 등록" 버튼 클릭
3. 새 이름 입력 (자동 검색 가능)
4. eBird 종 코드 입력 또는 검색 결과에서 선택
5. 확인 버튼 클릭

### 3. eBird 프로필 보기

1. 새 카드에서 "eBird 보기" 버튼 클릭
2. 새 브라우저 탭에서 eBird 프로필 페이지 열림

### 4. 정보 수정/삭제

- 지역/새 카드의 "수정" 또는 "삭제" 버튼 사용

## 주요 기능 설명

### eBird API 자동완성

새 이름을 입력하면 실시간으로 eBird API에 검색 요청을 보내 매칭되는 종들을 자동완성으로 제시합니다. 사용자는 검색 결과에서 선택하면 영문명, 학명, 종 코드가 자동으로 채워집니다.

### 반응형 디자인

CSS Grid와 Flexbox를 사용하여 모든 화면 크기에서 최적의 레이아웃을 제공합니다.

### 모달 인터페이스

추가/수정 폼은 모달 형태로 제공되어 페이지 새로고침 없이 편리하게 데이터를 입력할 수 있습니다.

## 향후 계획

- 사용자 인증 및 권한 관리
- 새 검색/필터 기능 개선
- 지도 통합 (각 지역의 위치 표시)
- 사용자 기록/통계 기능
- 다국어 지원
- 모바일 앱 개발 (React Native, Flutter)

## 문제 해결

### 데이터베이스 초기화 오류

```bash
# 기존 데이터베이스 파일 삭제 후 재생성
rm database/tamjo.db
python database.py
```

### eBird API 검색 오류

- API 키가 올바르게 설정되었는지 확인
- API 키의 유효성 확인 (eBird 웹사이트에서)
- 네트워크 연결 확인

### Flask 서버 시작 오류

```bash
# 포트 5000이 이미 사용 중인 경우
python app.py --port 5001
```

## 라이센스

이 프로젝트는 개인 학습 목적으로 작성되었습니다.

## 기여

이슈 리포팅 및 기능 제안은 언제든 환영합니다!

## 참고 자료

- [Flask 공식 문서](https://flask.palletsprojects.com/)
- [eBird API 문서](https://documenter.getpostman.com/view/664302/S1nxo78p)
- [SQLite 튜토리얼](https://www.sqlitetutorial.net/)
- [Vanilla JS DOM 조작](https://javascript.info/dom-manipulation)

---

**작성일**: 2026년 1월 1일  
**버전**: 1.0.0 (MVP)
