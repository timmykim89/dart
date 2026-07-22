# Instagram 실시간 연동 설정 (@dartseoul)

Curatorial 페이지의 그리드는 Vercel 서버리스 함수(`/api/instagram`)를 통해
`@dartseoul` 인스타그램의 최신 게시물을 실시간으로 불러옵니다.
토큰은 서버 쪽에만 저장되고 브라우저에는 절대 노출되지 않습니다.

> 코드는 이미 다 되어 있습니다. 아래는 **한 번만** 하면 되는 계정/토큰 작업입니다.
> (Meta 앱 생성과 인스타 로그인은 계정 소유자만 할 수 있어 직접 진행하셔야 합니다.)
> 토큰을 넣기 전까지는 페이지에 기존 플레이스홀더 이미지가 자연스럽게 표시됩니다.

---

## 1. 인스타 계정을 프로페셔널로 전환
`@dartseoul` 인스타 앱 → 설정 → 계정 → **프로페셔널 계정으로 전환**
(비즈니스 또는 크리에이터). 이미 되어 있으면 넘어가세요.

## 2. Meta 개발자 앱 만들기
1. https://developers.facebook.com → 로그인 → **My Apps → Create App**
2. 앱에 **Instagram** 제품 추가 (“Instagram API setup with Instagram login” 쪽).
3. 안내에 따라 `@dartseoul` 계정을 앱에 연결합니다.

## 3. 장기(Long-lived) 액세스 토큰 발급
- 개발자 화면의 토큰 생성 도구로 **장기 토큰(60일 유효)** 을 발급받습니다.
- 이 토큰 문자열을 복사해 둡니다. (이게 핵심입니다.)

## 4. Vercel에 배포하고 토큰 넣기
1. 이 폴더(`dart-site`)를 Vercel 프로젝트로 배포합니다.
   (GitHub에 올린 뒤 Vercel에서 Import, 또는 `vercel` CLI)
2. Vercel 프로젝트 → **Settings → Environment Variables** 에서 추가:
   - 이름: `IG_ACCESS_TOKEN`
   - 값: 3단계에서 복사한 토큰
3. **Redeploy** 합니다.

끝입니다. 이제 `https://<사이트주소>/api/instagram` 이 실시간 피드를 반환하고,
Curatorial 페이지가 자동으로 최신 게시물을 보여줍니다.

---

## (권장) 토큰 자동 갱신 — 손 안 대도 되게
위 토큰은 60일마다 만료됩니다. 자동으로 계속 갱신되게 하려면 **Vercel KV** 를 연결하세요:

1. Vercel 프로젝트 → **Storage → Create Database → KV**(Upstash for Redis)를
   만들고 이 프로젝트에 연결합니다. (관련 `KV_*` 환경변수는 Vercel이 자동 주입)
2. 재배포합니다.

그러면 매일 새벽 3시(UTC)에 `api/refresh` 크론이 토큰을 자동 갱신해
KV에 저장하고, `api/instagram` 은 항상 최신 토큰을 사용합니다. → **무관리.**

KV를 안 쓰면: 약 50일마다 3단계에서 새 토큰을 발급해 `IG_ACCESS_TOKEN` 값만
갱신하면 됩니다. (아래 “수동 갱신” 참고)

### 수동 갱신 방법
브라우저에서 아래 주소를 열면 새 토큰이 나옵니다(`access_token` 값):
```
https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=현재토큰
```
그 값을 Vercel `IG_ACCESS_TOKEN` 에 다시 넣고 재배포하세요.

---

## 로컬에서 확인
`/api/instagram` 은 Vercel 환경에서만 동작합니다. 로컬에서 함수까지 테스트하려면:
```bash
npm i -g vercel
vercel dev
```
그냥 정적 파일만 볼 때(`python3 -m http.server`)는 함수가 없으므로
플레이스홀더 그리드가 표시됩니다 — 정상입니다.

## 참고
- 사용하는 API: **Instagram API with Instagram Login** (`graph.instagram.com/me/media`).
  구형 Basic Display API는 2024년 종료되어 쓰지 않습니다.
- 게시물 캐시: 엣지에서 30분 캐시 후 백그라운드 갱신 → 빠르고 rate limit 안전.
- Meta 개발자 화면의 메뉴 명칭은 종종 바뀝니다. 큰 흐름(앱 생성 → 인스타 연결 →
  장기 토큰 발급 → Vercel 환경변수)만 맞으면 됩니다.
