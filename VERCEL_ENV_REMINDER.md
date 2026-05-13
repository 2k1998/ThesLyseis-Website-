# Vercel Environment Variables

The following environment variables must be added in the Vercel dashboard under:
**Project Settings → Environment Variables → Production**

| Variable | Scope |
|---|---|
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Public (client + server) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Public (client + server) |
| `META_CAPI_ACCESS_TOKEN` | Server only |
| `META_CAPI_PIXEL_ID` | Server only |

> `NEXT_PUBLIC_*` variables are exposed to the browser. The CAPI token and pixel ID are server-only and must never be prefixed with `NEXT_PUBLIC_`.
