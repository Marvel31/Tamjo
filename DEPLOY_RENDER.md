# Render에 배포하기

## 준비사항

1. GitHub 계정 (코드 저장소)
2. Render 계정 (https://render.com)
3. eBird API 키

## 1단계: GitHub에 코드 업로드

```bash
# 로컬 Git 저장소 초기화
git init
git add .
git commit -m "Initial commit: Tamjo bird watching app"

# GitHub 저장소에 푸시
git remote add origin https://github.com/YOUR_USERNAME/tamjo.git
git branch -M main
git push -u origin main
```

## 2단계: Render에서 Web Service 생성

1. [Render 대시보드](https://dashboard.render.com)에 로그인
2. **New** → **Web Service** 클릭
3. **Connect a repository** 선택
4. GitHub 계정 연결 (처음이면 권한 부여)
5. `tamjo` 리포지토리 선택

## 3단계: 배포 설정

Render에서 다음 설정을 입력하세요:

| 항목 | 값 |
|------|-----|
| **Name** | tamjo |
| **Environment** | Python 3 |
| **Build Command** | `pip install -r requirements.txt && python database.py` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | Free (또는 Paid) |

## 4단계: 환경 변수 설정

Render 대시보드에서:

1. Web Service 페이지의 **Environment** 탭 클릭
2. **Add Environment Variable** 클릭
3. 다음 환경 변수 추가:

```
FLASK_ENV=production
SECRET_KEY=<생성된 무작위 문자열>
EBIRD_API_KEY=<eBird API 키>
```

**SECRET_KEY 생성:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

## 5단계: 배포

Render는 GitHub push를 감지하여 자동으로 배포합니다.

1. 로컬에서 코드 변경 및 push
```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. Render 대시보드에서 배포 상태 확인

## 6단계: 데이터베이스 영구 저장소 설정 (선택사항)

Render의 무료 인스턴스는 재배포 시 파일 시스템이 초기화됩니다. 데이터를 보존하려면:

### 옵션 A: Render Disk 사용 (유료)

1. Web Service 설정에서 **Disk** 추가
2. 마운트 경로: `/var/data`
3. `config.py`에서 데이터베이스 경로 변경:

```python
import os
DB_PATH = os.path.join('/var/data', 'tamjo.db')
SQLALCHEMY_DATABASE_URI = f'sqlite:///{DB_PATH}'
```

### 옵션 B: PostgreSQL 사용 (권장)

1. Render에서 PostgreSQL 서비스 생성
2. 연결 문자열 확인
3. `config.py` 수정:

```python
import os
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://')
SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'sqlite:///database/tamjo.db'
```

4. `app.py`에 Flask-SQLAlchemy 추가 (추후 마이그레이션)

## 배포 후 확인

배포 완료 후:

1. Render에서 제공하는 URL 방문
2. 지역 추가, 새 등록 등 모든 기능 테스트
3. eBird 검색 기능 테스트

## 문제 해결

### 배포 실패

Render 대시보드의 **Logs** 탭에서 오류 확인:

```
Build failed: ModuleNotFoundError: No module named 'flask'
→ requirements.txt에 Flask 없음

Runtime error: Database file not found
→ database.py 실행 필요 (Build Command 확인)
```

### 데이터베이스 오류

```bash
# Render에서 직접 데이터베이스 초기화
python database.py
```

또는 Shell 접근:
1. Render 대시보드 → **Shell** 탭
2. 다음 명령 실행:
```bash
python database.py
```

### 느린 초기 로딩

Render 무료 인스턴스의 정상 동작입니다. 유료 플랜으로 업그레이드하면 개선됩니다.

## 다음 단계

- 데이터베이스를 PostgreSQL로 마이그레이션
- Sentry를 통한 에러 모니터링 추가
- CloudFlare를 통한 DNS 커스텀 도메인 설정
- 자동 백업 설정

---

배포 완료 후 애플리케이션이 정상 작동하는지 확인하세요!
