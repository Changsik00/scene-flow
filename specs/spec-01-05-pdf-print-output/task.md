# Task List: spec-01-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + scaffolds

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-01-05-pdf-print-output`

### 1-2. scaffolds add + commit
- [ ] `git add specs/spec-01-05-pdf-print-output/{spec,plan,task}.md`
- [ ] Commit: `chore(spec-01-05): add spec/plan/task scaffolds`

---

## Task 2: Playwright 자동 검증

### 2-1. Playwright 일회성 install
- [ ] `pnpm --dir studio add -D playwright`
- [ ] `pnpm --dir studio exec playwright install chromium` (캐시 재사용)

### 2-2. 검증 스크립트 작성
- [ ] `studio/.verify-pdf.mjs` 작성:
  - 시나리오 A: `?print-pdf` 접속 + body `.print-pdf` 클래스 + console 에러 0
  - 시나리오 B: `page.pdf()` 로 PDF buffer + 페이지 수 검증 (PDF 헤더 파싱 또는 Reveal 의 페이지 wrapper 카운트)
  - 시나리오 C: 페이지별 PNG 3장 캡처 (scene 1/2/3)
  - PDF 본체 buffer 는 *임시 저장 → 검증 → 삭제* (commit 안 함)

### 2-3. 검증 실행
- [ ] dev 서버 백그라운드 실행 (`pnpm --dir studio run dev`)
- [ ] `node studio/.verify-pdf.mjs` (또는 cwd 명시)
- [ ] 결과: 시나리오 A/B/C 모두 PASS, fragment 보임 확인

### 2-4. (필요 시) CSS 보강
- [ ] PDF 결과에 회귀 발견 시 `studio/src/index.html` 의 `<style>` 또는 별 CSS 보강
- [ ] 회귀 없으면 변경 없음

### 2-5. 정리 + 스크린샷 add
- [ ] `rm studio/.verify-pdf.mjs`
- [ ] `pnpm --dir studio remove playwright`
- [ ] dev 서버 정지
- [ ] root 잔재 정리 점검 (`git status` 로 확인 — 이전 spec 처럼 잔재 가능성 인지)

### 2-6. Commit
- [ ] `git add specs/spec-01-05-pdf-print-output/screenshot-pdf-page-{1,2,3}.png`
- [ ] (CSS 보강 있으면 같이 add) `git add studio/src/index.html`
- [ ] Commit: `test(spec-01-05): playwright verification of print-pdf mode`

---

## Task 3: README "PDF 출력" 섹션

### 3-1. README 갱신
- [ ] `README.md` 에 새 섹션:
  ```
  ## PDF 출력
  ...
  ```

### 3-2. Commit
- [ ] Commit: `docs(spec-01-05): add PDF export user guide to README`

---

## Task 4: Ship

- [ ] **타입 체크**: `pnpm --dir studio run build` 에러 0
- [ ] **전체 테스트**: `pnpm --dir studio run test` PASS (11/11 회귀)
- [-] (Integration Test = Playwright 시나리오 A/B/C 로 갈음)
- [ ] **walkthrough.md 작성** — 결정 / 검증 결과 / 회귀 발견 시 보강 노트
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-01-05): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-01-05-pdf-print-output`
- [ ] **PR 생성**: `gh pr create` (사용자 `[Y/n]`)
- [ ] **사용자 알림**: PR URL

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (Pre-flight 별도) |
| **예상 commit 수** | 5~6 (scaffolds / playwright + CSS / README / ship / finalize) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
