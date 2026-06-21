# VocaSa

`VocaSa` la frontend Next.js 14 cho he thong hoc tu vung TOEIC, duoc to chuc theo pattern tach lop ro rang de goi API tu `D:\toeic-vocab-api`.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn-style UI structure
- Radix UI
- Axios
- TanStack Query
- Zustand

## Cau truc thu muc

```text
app/
components/
config/
hooks/
lib/
services/
store/
types/
utils/
```

## Bien moi truong

Tao file `.env` tu `.env.example`:

```bash
NEXT_PUBLIC_APP_NAME=VocaSa
API_BASE_URL=http://127.0.0.1:5050
```

## Chay du an

```bash
npm install
npm run dev
```

Backend can duoc chay rieng trong `D:\toeic-vocab-api`:

```bash
docker compose up -d
./mvnw.cmd spring-boot:run
```

Mac dinh frontend se proxy moi request `/api/v1/*` sang backend `API_BASE_URL`, nen FE co the call API cung origin ma khong can xu ly CORS o client.

## Deploy len Vercel

- Khong commit file env nay len repo. Vercel se doc bien moi truong tu Project Settings.
- Can tao it nhat 2 env:
  - `NEXT_PUBLIC_APP_NAME=VocaSa`
  - `API_BASE_URL=https://<backend-domain>`
- `API_BASE_URL` la bien server-only dung trong `next.config.mjs` de rewrite `/api/v1/*` sang backend, nen khong bi expose trong browser bundle.
- Neu backend da deploy tren Render, dat `API_BASE_URL` tro thang vao domain public cua BE. Khong can them `/api/v1`, vi FE tu normalize san.
- Sau khi them hoac doi env tren Vercel, can redeploy de Next.js build lai rewrite config.

Luu y tren Windows: dung `127.0.0.1` on dinh hon `localhost` neu backend khong bind qua IPv6.

## Nhung gi da duoc scaffold

- Landing page hien danh sach study set public
- Study set detail page
- Practice shell cho 4 mode hoc
- Guest progress dung `progressToken` stateless, FE can tu cap nhat token moi nhat o client
- Tầng `services` + `hooks` + `types` map theo DTO backend
- Admin catalog service skeleton de mo rong CRUD sau nay



