# 🪄 Plink Frontend

## 📘 프로젝트 개요

> **Plink**는 React + Vite 기반의 웹 애플리케이션으로,  
> 스타일링은 styled-components와 디자이너 정의 테마 시스템(theme.js) 을 활용하여 일관된 디자인과 높은 유지보수성을 확보했습니다.
> 또한 ESLint, Prettier, Git Flow, GitHub Actions 자동화를 적용해  
> 코드 품질과 협업 효율을 강화했습니다.

---

## 🧩 협업 구조 및 개발 환경

### 🔹 Git Flow 전략

main ← dev ← feature

- **main**: 배포용 브랜치
- **dev**: 통합 개발 브랜치 (feature 브랜치 병합 대상)
- **feature**: 기능 단위 작업 브랜치

**브랜치 네이밍 규칙**  
브랜치종류/#이슈번호/상세기능  
예: feat/#7/mainPage

---

### 🔹 Commit & Issue Convention

커밋 메시지는 **Gitmoji + 타입 + 이슈번호** 규칙으로 작성합니다.

✨ Feat: 메인 페이지 구현 (#7)  
🐛 Fix: 로그인 버그 수정 (#12)  
💄 Design: UI 스타일 수정 (#15)  
🔥 Del: 불필요한 파일 삭제 (#9)

> Commit 시에는 `gitmoji -c` 명령어를 사용합니다.  
> → Gitmoji CLI 설치: `brew install gitmoji`

---

### 🔹 Git Alias (자동 브랜치 생성기)

로컬 환경에서 아래 명령어를 한 번만 입력하면  
`git feature <이슈번호> <기능명>` 으로 자동 브랜치 생성이 가능합니다 👇

git config --global alias.feature '!f() { \
 if [ -z "$1" ] || [ -z "$2" ]; then \
 echo "❌ Usage: git feature <issue-number> <feature-name>"; \
 return 1; \
 fi; \
 ISSUE=$1; \
  NAME=$2; \
  echo "🔄 Switching to dev branch..."; \
  git checkout dev && git pull origin dev && \
  BRANCH="feat/#${ISSUE}/${NAME}"; \
 echo "🌿 Creating new branch: $BRANCH"; \
 git checkout -b $BRANCH; \
}; f'

> 예시:  
> git feature 7 mainPage  
> → 자동으로 `feat/#7/mainPage` 브랜치 생성 🎯

---

### 🔹 협업 플로우

1️⃣ **이슈 생성** → GitHub Issues에서 작업 단위 등록  
2️⃣ **브랜치 생성** → `git feature <이슈번호> <기능명>`  
 예: `git feature 7 mainPage`  
3️⃣ **작업 및 커밋** → `gitmoji -c`  
4️⃣ **PR 생성** → 자동 템플릿 & 라벨링 확인  
5️⃣ **리뷰 후 병합 및 feature 브랜치 삭제**

---

## 🤖 GitHub 자동화 시스템

> 이 프로젝트는 GitHub Actions 및 템플릿을 통해  
> **이슈 생성 → 브랜치 생성 → PR 생성 → 자동 라벨링**이 자동으로 연동됩니다.

📁 자동화 구조  
Plink-frontend/
├─ .github/
│ ├─ ISSUE_TEMPLATE/ # 이슈 생성 템플릿
│ ├─ workflows/ # GitHub Actions CI/CD 워크플로우
│ └─ pull_request_template.md # PR 기본 템플릿
│
├─ public/ # 정적 리소스 (favicon, manifest 등)
│
├─ src/
│ ├─ assets/ # 이미지, 아이콘, 폰트 등 정적 파일
│ ├─ components/ # 재사용 가능한 UI 컴포넌트
│ ├─ pages/ # 라우팅되는 페이지 단위 컴포넌트
│ ├─ data/ # 더미 데이터, API 응답 mock
│ ├─ hooks/ # 커스텀 훅 (useAuth, useModal 등)
│ ├─ styles/ # 전역 스타일 및 theme.js
│ └─ main.jsx # 진입 파일 (ThemeProvider, Router 등 설정)
│
├─ .eslintrc.cjs # ESLint 설정 (코드 규칙 관리)
├─ .prettierrc # Prettier 설정 (자동 포맷)
└─ package.json # 프로젝트 메타 정보 및 의존성

---

### ⚙️ 자동화 기능 요약

| 기능               | 설명                                    | 예시                             |
| ------------------ | --------------------------------------- | -------------------------------- |
| 🧩 이슈 템플릿     | Issue 생성 시 자동으로 양식 표시        | “🧩 General Issue Template” 선택 |
| 🔗 PR 템플릿       | Pull Request 생성 시 자동으로 형식화    | 작업 내용 / 이슈 연결 자동       |
| 🏷️ Auto Label      | 브랜치명 기반 라벨 자동 추가            | `feat/#7/mainPage` → `✨ Feat`   |
| 🔗 Auto Link Issue | 브랜치명에 포함된 `#이슈번호` 자동 연결 | `Closes #7` 자동 삽입            |

---

## 🎨 코드 스타일 및 품질 관리

| 항목      | 도구                  | 설명                                               |
| --------- | --------------------- | -------------------------------------------------- |
| 코드 포맷 | **Prettier**          | 저장 시 자동 포맷 및 일관된 코드 스타일 유지       |
| 코드 검사 | **ESLint**            | 코드 규칙 및 문법 검사로 품질 보장                 |
| UI 스타일 | **styled-components** | 컴포넌트 단위 스타일 관리 및 테마 기반 디자인 적용 |
| 개발 서버 | **Vite**              | 빠른 빌드 속도와 HMR(Hot Module Reload) 지원       |
| 자동화    | **GitHub Actions**    | PR 라벨링, 이슈 트래킹 및 테스트 자동화            |

---

## 🧑‍🤝‍🧑 역할 분담 (예시)

| 팀원   | 역할            | 담당 브랜치 예시   |
| ------ | --------------- | ------------------ |
| 최선우 | 메인 페이지     | `feat/#7/mainPage` |
| 한슬기 | 로그인/회원가입 | `feat/#8/auth`     |
| 김현수 | 게시글 CRUD     | `feat/#9/postCRUD` |

---

## 🧠 기술 스택

| 구분                 | 기술                               |
| -------------------- | ---------------------------------- |
| **Frontend**         | React, Vite                        |
| **Styling**          | Tailwind CSS, styled-components    |
| **State Management** | (예: Recoil, Zustand 등 추가 예정) |
| **Code Quality**     | ESLint, Prettier                   |
| **Automation**       | GitHub Actions                     |
| **Collaboration**    | Git, GitHub, Gitmoji, Git Flow     |
| **Tools**            | Node.js 20+, npm 10+               |

---

## ⚙️ 실행 방법

# 패키지 설치

npm install

# 개발 서버 실행

npm run dev

# 코드 검사 및 자동 수정

npx eslint src --fix

---

## ✅ 협업 프로세스 요약

1️⃣ **이슈 생성** → 템플릿 자동 표시  
2️⃣ **브랜치 생성**  
git feature <이슈번호> <기능명>  
3️⃣ **커밋** → `gitmoji -c`  
4️⃣ **PR 생성** → 자동 템플릿 & 라벨 확인  
5️⃣ **코드 리뷰 → dev 병합 → feature 브랜치 삭제**

---

## ✨ 총정리

- Git Flow + Commit Convention + ESLint/Prettier + GitHub Actions  
  → 코드 품질 & 협업 자동화 완성
- Tailwind + styled-components 병용으로 깔끔한 디자인 구조
- `git feature` alias로 브랜치 관리 자동화
- 이슈/브랜치/PR이 모두 연결되는 **현업 수준 협업 파이프라인 구축 완료**
