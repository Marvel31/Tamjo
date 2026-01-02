# PythonAnywhere에 배포하기

## 준비사항

1. PythonAnywhere 계정 (https://www.pythonanywhere.com)
2. eBird API 키
3. 로컬에서 완성된 Flask 앱

## 1단계: PythonAnywhere 계정 생성

1. https://www.pythonanywhere.com 방문
2. 회원가입 (무료 계정 가능)
3. 로그인

## 2단계: 코드 업로드

PythonAnywhere는 Git, 파일 업로드, 직접 편집을 지원합니다.

### 방법 1: Git 사용 (권장)

1. PythonAnywhere **Bash** 콘솔 열기
2. 다음 명령 실행:

```bash
# 앱 디렉토리 생성
mkdir ~/tamjo
cd ~/tamjo

# Git 저장소 클론
git clone https://github.com/YOUR_USERNAME/tamjo.git .
```

### 방법 2: ZIP 파일 업로드

1. 로컬에서 프로젝트 ZIP 파일 생성
2. PythonAnywhere **Files** 탭 에서 업로드
3. **Bash**에서 압축 해제:

```bash
unzip tamjo.zip -d ~/tamjo
```

## 3단계: 가상환경 설정

PythonAnywhere **Bash** 콘솔에서:

```bash
cd ~/tamjo

# 가상환경 생성 (Python 3.9 이상 권장)
mkvirtualenv --python=/usr/bin/python3.9 tamjo

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 초기화
python database.py
```

## 4단계: Flask 웹 앱 설정

### 4-1. 새 Web App 생성

1. PythonAnywhere 대시보드 → **Web**
2. **Add a new web app**
3. 선택:
   - 도메인: `yourusername.pythonanywhere.com` (또는 커스텀)
   - 프레임워크: **Flask**
   - Python 버전: **3.9**

### 4-2. WSGI 파일 설정

1. Web 앱 설정 페이지에서 **WSGI configuration file** 클릭
2. 다음 내용으로 수정:

```python
import sys
import os

# 프로젝트 경로 추가
path = '/home/yourusername/tamjo'
if path not in sys.path:
    sys.path.append(path)

# 환경 변수 설정
os.environ['FLASK_ENV'] = 'production'
os.environ['SECRET_KEY'] = 'your-secret-key-here'
os.environ['EBIRD_API_KEY'] = 'your-ebird-api-key-here'

# Flask 앱 import
from app import app as application
```

**주의:** `yourusername`을 실제 PythonAnywhere 사용자명으로 변경하세요.

### 4-3. 가상환경 경로 설정

같은 설정 페이지에서:

1. **Virtualenv** 섹션 찾기
2. 경로 입력: `/home/yourusername/.virtualenvs/tamjo`
3. **Save** 클릭

## 5단계: 환경 변수 설정

### 방법 1: WSGI 파일에 하드코딩 (간단)

위의 WSGI 파일에서 직접 설정 (개발 환경에만 권장)

### 방법 2: .env 파일 사용 (권장)

1. PythonAnywhere **Files** → `/home/yourusername/tamjo/.env`
2. 다음 내용 추가:

```env
FLASK_ENV=production
SECRET_KEY=<생성된 무작위 문자열>
EBIRD_API_KEY=<eBird API 키>
```

3. `app.py`에서 `.env` 로드 확인:

```python
from dotenv import load_dotenv
load_dotenv()  # .env 파일 자동 로드
```

## 6단계: 배포

1. PythonAnywhere 대시보드 → **Web** → 해당 앱
2. **Reload** 버튼 클릭
3. URL로 접속하여 확인

```
https://yourusername.pythonanywhere.com
```

## 7단계: 커스텀 도메인 설정 (선택사항)

1. Web 앱 설정에서 **Web address**
2. 도메인 설정 옵션 선택
3. 도메인 DNS 설정 (PythonAnywhere 지침 따라)

## 데이터베이스 관리

### 데이터베이스 초기화 (필요시)

```bash
cd ~/tamjo
python database.py
```

### 데이터베이스 백업

PythonAnywhere **Bash**에서:

```bash
cp ~/tamjo/database/tamjo.db ~/tamjo/database/tamjo_backup.db
```

## 정적 파일 설정 (선택사항)

PythonAnywhere가 CSS/JS 파일을 제대로 제공하지 않는 경우:

1. Web 앱 설정 → **Static files**
2. 추가:
   - URL: `/static/`
   - 경로: `/home/yourusername/tamjo/static/`

## 로그 확인

에러 발생 시 로그 확인:

1. Web 앱 설정 → **Logs**
2. **Server log** 또는 **Error log** 확인

또는 **Bash**에서:

```bash
tail -f /var/log/yourusername_pythonanywhere_com_server.log
```

## 자동 코드 업데이트

GitHub에서 최신 코드를 가져오려면:

**Bash**에서:

```bash
cd ~/tamjo
git pull origin main
# 필요하면 다시 reload
```

또는 PythonAnywhere의 Task Scheduler를 사용하여 자동화:

1. **Scheduled tasks** → **Create a new scheduled task**
2. 시간 설정
3. 명령어:

```bash
cd /home/yourusername/tamjo && git pull origin main
```

## 문제 해결

### 모듈 찾기 못함 (ModuleNotFoundError)

```bash
# 가상환경 활성화 후 다시 설치
workon tamjo
pip install -r requirements.txt
```

### 정적 파일 로드 안 됨

```python
# app.py에 static 폴더 경로 명시
app = Flask(__name__, 
    static_url_path='/static',
    static_folder='/home/yourusername/tamjo/static'
)
```

### 502 Bad Gateway

1. 에러 로그 확인
2. WSGI 파일 문법 확인
3. 가상환경 경로 확인
4. Web 앱 **Reload** 클릭

### 데이터베이스 파일 권한 오류

```bash
chmod 644 ~/tamjo/database/tamjo.db
chmod 755 ~/tamjo/database/
```

## 무료 vs 유료 플랜

| 기능 | 무료 | 유료 |
|------|------|------|
| 월간 CPU | 100초 | 제한 없음 |
| 데이터베이스 크기 | 제한 | 무제한 |
| 커스텀 도메인 | ❌ | ✅ |
| 전자메일 | ❌ | ✅ |
| API 접근 | 제한 | ✅ |

## 다음 단계

- 커스텀 도메인 설정
- HTTPS 인증서 적용
- 데이터베이스 마이그레이션 (PostgreSQL)
- 백업 자동화
- 모니터링 설정

---

배포 완료 후 애플리케이션이 정상 작동하는지 확인하세요!
