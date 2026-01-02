# 빠른 시작 가이드 (Quick Start)

## 5분 안에 시작하기

### 준비사항

- Python 3.7 이상
- 인터넷 연결 (eBird API 사용)

### Step 1: 프로젝트 설정

```bash
# 프로젝트 디렉토리로 이동
cd c:\repository\Tamjo

# 가상환경 생성
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

### Step 2: 데이터베이스 초기화

```bash
python database.py
```

성공 메시지: `✓ 데이터베이스 초기화 완료`

### Step 3: Flask 서버 실행

```bash
python app.py
```

출력 예시:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

### Step 4: 브라우저에서 열기

[http://localhost:5000](http://localhost:5000) 열기

---

## 기본 사용법

### 1️⃣ 지역 추가

1. **"+ 지역 추가"** 버튼 클릭
2. 지역명 입력 (예: "여의도공원")
3. 설명 입력 (선택사항)
4. **"추가"** 클릭

### 2️⃣ 새 등록

1. 지역 카드 클릭 → 상세 페이지로 이동
2. **"+ 새 등록"** 버튼 클릭
3. 새 이름 입력 (예: "Northern Wrentit")
   - 입력하면 자동으로 eBird에서 검색됨
4. 검색 결과에서 선택하면 자동으로 정보 채워짐
5. **"등록"** 클릭

### 3️⃣ eBird 프로필 보기

- 새 카드의 **"eBird 보기"** 버튼 → 새 브라우저 탭에서 eBird 프로필 열림

### 4️⃣ 정보 수정/삭제

- **"수정"** 버튼: 정보 변경 가능
- **"삭제"** 버튼: 항목 제거 (주의: 되돌릴 수 없음)

---

## eBird API 키 설정 (선택사항)

eBird 검색 기능을 사용하려면 API 키가 필요합니다:

### 1. eBird API 키 발급받기

1. [eBird API 키 페이지](https://ebird.org/api/keygen) 방문
2. eBird 계정으로 로그인
3. API 키 복사

### 2. .env 파일 생성

프로젝트 루트에 `.env` 파일 생성:

```env
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=dev-key
EBIRD_API_KEY=your-api-key-here
```

### 3. 서버 재시작

```bash
# 터미널에서 Ctrl+C로 중지
# 다시 시작
python app.py
```

---

## 문제 해결

### "포트 5000이 이미 사용 중" 에러

```bash
# 다른 포트 사용
python app.py --port 5001
# 그 후 http://localhost:5001 접속
```

### "ModuleNotFoundError: No module named 'flask'"

```bash
# 가상환경 활성화 확인
# Windows:
venv\Scripts\activate
# 다시 설치
pip install -r requirements.txt
```

### 데이터베이스 오류

```bash
# 데이터베이스 초기화
python database.py
```

### 가상환경 비활성화 방법

```bash
deactivate
```

---

## 폴더 구조 이해

```
Tamjo/
├── app.py                 ← Flask 메인 파일 (실행 파일)
├── database.py            ← DB 초기화 스크립트
├── config.py              ← 설정 파일
├── ebird_service.py       ← eBird API 연동
├── requirements.txt       ← 필요한 패키지 목록
│
├── templates/             ← HTML 페이지
│   ├── index.html        ← 홈페이지 (지역 목록)
│   └── location.html     ← 지역 상세 (새 목록)
│
├── static/               ← CSS, JavaScript
│   ├── css/
│   │   └── style.css     ← 디자인
│   └── js/
│       ├── api.js        ← API 호출
│       ├── ui-helpers.js ← UI 함수
│       ├── index.js      ← 홈페이지 로직
│       └── location.js   ← 상세페이지 로직
│
└── database/             ← 데이터베이스 (자동 생성)
    └── tamjo.db
```

---

## 다음 단계

### 로컬에서 더 알아보기

- `/README.md` - 전체 문서
- `/DEPLOY_RENDER.md` - Render 배포 가이드
- `/DEPLOY_PYTHONANYWHERE.md` - PythonAnywhere 배포 가이드

### 배포하기

- **Render**: 가장 간단함 (GitHub 필요)
- **PythonAnywhere**: 직접 업로드 가능

### 기능 추가하기

현재 구현된 기능:
- ✅ 지역 추가/수정/삭제
- ✅ 새 등록/수정/삭제
- ✅ eBird 검색 및 연동
- ✅ 반응형 디자인

추가 가능한 기능:
- 사용자 계정
- 사진 업로드
- 관찰 기록
- 지도 표시
- 댓글 시스템

---

## 유용한 커맨드

```bash
# 가상환경 활성화
venv\Scripts\activate                # Windows
source venv/bin/activate             # macOS/Linux

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 초기화
python database.py

# Flask 개발 서버 시작
python app.py

# 다른 포트에서 실행
python app.py --port 5001

# 가상환경 비활성화
deactivate
```

---

## 영상으로 배우기

각 단계별 동작:

1. **지역 추가**: `"+ 지역 추가"` → 폼 입력 → `"추가"` 클릭
2. **새 등록**: 지역 카드 클릭 → `"+ 새 등록"` → 이름 입력 → 검색 결과 선택
3. **eBird 연결**: 새 카드 → `"eBird 보기"` 클릭 → 새 탭에서 eBird 프로필 열림

---

## 질문이나 문제가 있을 때

1. **README.md** - 상세 문서 확인
2. **에러 메시지** - 콘솔 출력 확인
3. **Flask 로그** - 터미널에서 오류 추적

---

**축하합니다! 🎉 탐조 앱 로컬 설정 완료!**

더 배우고 싶다면 README.md를 읽어보세요.
배포하고 싶다면 DEPLOY_*.md 파일을 참고하세요.

Happy bird watching! 🐦
