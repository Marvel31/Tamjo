# 탐조 (Tamjo) 프로젝트 완성 요약

## 🎉 개발 완료!

당신의 탐조(Bird-watching) 웹 애플리케이션이 완성되었습니다!

---

## 📦 프로젝트 구조

```
Tamjo/
│
├── 📄 문서
│   ├── README.md                    # 전체 프로젝트 문서
│   ├── QUICKSTART.md                # 빠른 시작 가이드 ← 여기서 시작!
│   ├── DEPLOY_RENDER.md             # Render 배포 가이드
│   └── DEPLOY_PYTHONANYWHERE.md     # PythonAnywhere 배포 가이드
│
├── 🔧 백엔드 (Python + Flask)
│   ├── app.py                       # Flask 메인 애플리케이션
│   ├── config.py                    # 환경 설정
│   ├── database.py                  # SQLite 데이터베이스 관리
│   ├── ebird_service.py             # eBird API 연동
│   ├── requirements.txt             # 파이썬 의존성
│   ├── Procfile                     # 배포 설정
│   ├── .env.example                 # 환경 변수 템플릿
│   └── .gitignore                   # Git 제외 파일 목록
│
├── 🎨 프론트엔드
│   ├── templates/
│   │   ├── index.html               # 홈 페이지 (지역 목록)
│   │   └── location.html            # 지역 상세 (새 목록)
│   │
│   └── static/
│       ├── css/
│       │   └── style.css            # 전체 스타일 (반응형)
│       │
│       └── js/
│           ├── api.js               # API 호출 (Location, Bird, eBird)
│           ├── ui-helpers.js        # UI 유틸 (모달, 알림 등)
│           ├── index.js             # 홈 페이지 로직
│           └── location.js          # 지역 상세 페이지 로직
│
└── 📊 데이터베이스
    └── database/
        └── tamjo.db                 # SQLite (자동 생성)
```

---

## 🚀 시작하기

### 1️⃣ 로컬 개발 시작 (5분)

```bash
cd c:\repository\Tamjo

# 가상환경 생성
python -m venv venv

# 가상환경 활성화
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 초기화
python database.py

# Flask 서버 시작
python app.py
```

🌐 브라우저에서 [http://localhost:5000](http://localhost:5000) 열기

### 2️⃣ 배포하기

**Render 사용 (권장)** - 가장 간단함
- 📖 문서: `DEPLOY_RENDER.md`
- ⏱️ 소요시간: 10-15분

**PythonAnywhere 사용** - 직접 업로드 가능
- 📖 문서: `DEPLOY_PYTHONANYWHERE.md`
- ⏱️ 소요시간: 15-20분

---

## ✨ 완성된 기능

### ✅ 지역 관리
- [x] 새 지역 추가
- [x] 지역 정보 수정
- [x] 지역 삭제
- [x] 지역별 새 목록 표시

### ✅ 새 관리
- [x] 지역별로 새 등록
- [x] 새 정보 수정 (영문명, 학명, 이미지)
- [x] 새 삭제
- [x] 카드 레이아웃으로 미리보기

### ✅ eBird 연동
- [x] eBird API로 새 검색
- [x] 자동완성 (검색 결과에서 선택)
- [x] eBird 프로필 페이지 직접 링크
- [x] 종 코드 자동 관리

### ✅ 사용자 인터페이스
- [x] 반응형 디자인 (모바일/태블릿/PC)
- [x] 모달 폼 (페이지 새로고침 없음)
- [x] 직관적인 네비게이션
- [x] 에러/성공 메시지
- [x] 로딩 상태 표시

---

## 🔐 API 엔드포인트

### 지역 (Location)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/locations` | 모든 지역 조회 |
| GET | `/api/locations/<id>` | 특정 지역 조회 |
| POST | `/api/locations` | 새 지역 추가 |
| PUT | `/api/locations/<id>` | 지역 수정 |
| DELETE | `/api/locations/<id>` | 지역 삭제 |

### 새 (Bird)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/birds` | 모든 새 조회 |
| GET | `/api/birds?location_id=<id>` | 지역별 새 조회 |
| POST | `/api/birds` | 새 등록 |
| PUT | `/api/birds/<id>` | 새 수정 |
| DELETE | `/api/birds/<id>` | 새 삭제 |

### eBird 검색

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/ebird/search?query=<name>` | 새 이름으로 검색 |

---

## 🔑 필수 설정

### eBird API 키 (선택사항이지만 권장)

1. [eBird API](https://ebird.org/api/keygen) 방문
2. 로그인 후 API 키 발급
3. `.env` 파일에 추가:
   ```env
   EBIRD_API_KEY=your-api-key-here
   ```

### 프로덕션 배포 시

`.env` 파일에 다음 설정:
```env
FLASK_ENV=production
SECRET_KEY=<생성된 무작위 키>
EBIRD_API_KEY=<eBird API 키>
```

---

## 📚 문서

| 문서 | 용도 | 읽어보기 |
|------|------|---------|
| **QUICKSTART.md** | 5분 안에 시작 | ⭐⭐⭐ 가장 먼저 읽기 |
| **README.md** | 전체 상세 정보 | 🔍 깊이 있는 학습용 |
| **DEPLOY_RENDER.md** | Render 배포 | 🚀 배포할 때 읽기 |
| **DEPLOY_PYTHONANYWHERE.md** | PythonAnywhere 배포 | 🚀 배포할 때 읽기 |

---

## 🛠️ 기술 스택

| 계층 | 기술 |
|------|------|
| **Backend** | Flask 3.0.0 (Python) |
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript |
| **Database** | SQLite3 |
| **External API** | eBird API (Cornell Lab) |
| **Deployment** | Render / PythonAnywhere |

---

## 📊 데이터 모델

### locations 테이블
```
id (PK)          - 지역 ID
name (UNIQUE)    - 지역명
description      - 설명
created_at       - 생성 시간
```

### birds 테이블
```
id (PK)                   - 새 ID
name                      - 새 이름 (영문)
scientific_name           - 학명
location_id (FK)          - 지역 ID
ebird_species_code (UNIQUE) - eBird 종 코드
ebird_url                 - eBird 프로필 링크
image_url                 - 이미지 URL
created_at                - 생성 시간
```

---

## 🎯 사용 흐름

```
홈페이지
  ↓
[지역 추가] 또는 [지역 선택]
  ↓
지역 상세 페이지
  ↓
[새 등록] 또는 [새 카드 클릭]
  ↓
[eBird 보기] → eBird 프로필 열기
```

---

## 🔄 다음 단계

### 즉시 할 수 있는 것
1. ✅ 로컬에서 실행 (`QUICKSTART.md` 따라)
2. ✅ 지역과 새 추가해보기
3. ✅ eBird 링크 테스트

### 배포하기
1. 🚀 GitHub 계정에 코드 올리기
2. 🚀 Render 또는 PythonAnywhere 배포 (`DEPLOY_*.md`)
3. 🚀 커스텀 도메인 설정 (선택)

### 기능 확장하기
- 사용자 인증 추가
- 관찰 기록 추가
- 지도 통합
- 사진 업로드
- 댓글 시스템

---

## 💡 팁

### 개발 중
```bash
# 터미널에서 Ctrl+C로 서버 중지
# 코드 수정 후 python app.py로 재시작

# 자동 새로고침 원하면 app.py에서:
app.run(debug=True)  # 이미 설정됨
```

### 배포 중
- 환경 변수를 안전하게 관리
- .env 파일은 Git에 커밋하지 않기
- 프로덕션에서는 SECRET_KEY를 안전한 값으로 변경

### 디버깅
```bash
# 콘솔에서 JavaScript 에러 확인
# F12 → Console 탭

# Flask 에러 로그 확인
# 터미널의 Flask 출력 메시지
```

---

## 📞 문제가 발생했을 때

### "포트 5000 사용 중" 에러
```bash
python app.py --port 5001
```

### "ModuleNotFoundError"
```bash
# 가상환경 활성화 확인
venv\Scripts\activate
pip install -r requirements.txt
```

### 데이터베이스 초기화
```bash
python database.py
```

### 더 도움이 필요하면
1. `README.md` 전체 문서 확인
2. Flask 공식 문서: https://flask.palletsprojects.com/
3. eBird API: https://documenter.getpostman.com/view/664302/S1nxo78p

---

## 🎓 학습 포인트

이 프로젝트를 통해 배운 기술:

✅ **Python + Flask** - 웹 백엔드 개발
✅ **SQLite** - 관계형 데이터베이스
✅ **REST API** - JSON 기반 API 설계
✅ **Vanilla JavaScript** - DOM 조작, 비동기 처리
✅ **HTML/CSS** - 반응형 웹 디자인
✅ **Web 배포** - 클라우드 호스팅

---

## 🏆 축하합니다!

당신은 다음을 성공적으로 구축했습니다:

- 🐦 완전한 기능의 웹 애플리케이션
- 🎨 반응형 사용자 인터페이스
- 📊 관계형 데이터베이스
- 🔗 외부 API 통합
- ☁️ 배포 가능한 구조

**다음 단계: QUICKSTART.md 문서를 읽고 시작하세요!**

---

## 📄 참고 자료

- Flask 공식: https://flask.palletsprojects.com/
- eBird API: https://ebird.org/api/keygen
- SQLite 튜토리얼: https://www.sqlitetutorial.net/
- Render 배포: https://render.com/
- PythonAnywhere: https://www.pythonanywhere.com/

---

**Happy bird watching! 🐦🌿**

Made with ❤️ on 2026-01-01
