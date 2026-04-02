<div align="center">

<img src="public/ocular-banner.webp" alt="Ocular — Design in Focus" width="100%" />

<br />
<br />

# Ocular — Design in Focus

**A high-performance, real-time collaborative SVG design tool built for the modern web.**

<br />

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-ff5e00?style=for-the-badge&logo=liveblocks&logoColor=white)](https://liveblocks.io/)
[![Prisma](https://img.shields.io/badge/Prisma-2d3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-f97316?style=for-the-badge)](LICENSE)

<br />

[🚀 Live Demo](#-live-demo) · [✨ Features](#-features) · [🛠️ Tech Stack](#️-tech-stack) · [⚙️ Installation](#️-local-development) · [🙋 Author](#-author)

</div>

---

## 🎯 Why Ocular?

Most collaborative design tools are either too heavyweight or locked behind paywalls. Ocular is a focused, open-source alternative that demonstrates what's possible when you pair a modern React stack with real-time infrastructure — no plugins, no downloads, just a browser.

It was built to answer a specific question: **can you build a production-grade collaborative canvas — with live cursors, shared state, undo history, and a full property panel — entirely on the web platform?**

The answer is yes. Ocular does it with an SVG canvas, Liveblocks for conflict-free real-time sync, and a clean Next.js App Router architecture. Every architectural decision — from the bitmask-based resize handles to the normalized pencil-draft coordinate system — reflects deliberate, considered engineering, not boilerplate.

---

## 🌐 Live Demo

> **[https://ocular-umber.vercel.app](https://ocular-umber.vercel.app)**

Open it in two browser tabs side by side to see live collaboration in action. Create a room, invite yourself from the second tab, and watch cursors, selections, and edits sync in real time.

---

## ✨ Features

### 🎨 Canvas & Drawing Tools

- **Infinite SVG canvas** with smooth pan (click-and-drag) and zoom (scroll wheel, `+`/`-` buttons, clamped to 0.5x–2x)
- **Rectangle tool** — with adjustable corner radius
- **Ellipse tool** — full ellipse and circle support
- **Freehand pencil tool** — pressure-sensitive variable-width strokes powered by `perfect-freehand`, with live draft preview
- **Text tool** — double-click any text layer to edit inline; supports font family, size, and weight controls
- **Canvas background color** — customize the canvas background via the color picker when nothing is selected

### 🔲 Selection & Manipulation

- **Click to select** any layer; the selection box shows live dimensions (e.g. `200x100`)
- **Selection net** — click-drag on empty canvas to rubber-band select multiple layers at once
- **Multi-layer translate** — move all selected layers together
- **8-handle resize** — drag any corner or edge-midpoint handle; supports flipping (dragging past the opposite edge). Resize is intentionally disabled for freehand path layers since their geometry is point-based, not box-based
- **Right-click context menu** — bring any selected layer to front or send it to back, repositioning it in the `LiveList` z-order

### 🎛️ Property Panel (Right Sidebar)

Selecting a layer reveals a live property panel with controls for:

| Property          | Applies to                                |
| ----------------- | ----------------------------------------- |
| Position (X, Y)   | All layers                                |
| Dimensions (W, H) | Rectangle, Ellipse, Text                  |
| Opacity (0–1)     | All layers                                |
| Corner Radius     | Rectangle only                            |
| Fill color        | All layers                                |
| Stroke color      | All layers                                |
| Font Family       | Text only (Inter, Arial, Times New Roman) |
| Font Size         | Text only                                 |
| Font Weight       | Text only (100–900)                       |

All changes sync to Liveblocks storage and are immediately visible to every collaborator in the room.

### 🌐 Real-Time Collaboration (Powered by Liveblocks)

This is Ocular's defining feature.

- **Live cursors** — every collaborator's pointer is rendered on your canvas in real time, with a color-coded avatar showing their initial
- **Live pencil drafts** — see collaborators' freehand strokes appear stroke-by-stroke as they draw, before they even lift their pointer
- **Shared selections** — layers selected by other users are highlighted for you
- **Conflict-free shared state** — layer storage lives in a Liveblocks `LiveMap`; layer ordering in a `LiveList`. Concurrent edits are resolved automatically with CRDTs
- **Full undo/redo history** — `Ctrl+Z` / `Ctrl+Shift+Z` works across all operations, including layer insertions and property edits. Liveblocks `useHistory` manages this without any custom diffing logic
- **Collaborator avatar row** — the right sidebar header shows live avatars for everyone currently in the room

### 🗂️ Layer Panel (Left Sidebar)

- Live-updating list of all layers in reverse z-order (newest on top)
- Click any layer in the panel to select it on the canvas
- Highlights the currently selected layer(s)

### 🔐 Auth & Rooms

- **Email + password authentication** via NextAuth v5 (Auth.js) with bcrypt hashing
- **Design rooms** — create unlimited rooms from your dashboard; each room maps to a Liveblocks room with scoped access
- **Invite collaborators by email** — send access to any registered user via the Share modal; invitees get full edit access
- **Revoke access** — remove a collaborator from a room at any time
- **Room ownership** — only the room owner can rename or delete a room. Invited users can leave (revoke their own access)
- **Access control** — unauthenticated users are redirected by Next.js middleware; canvas pages 404 for users without access

### 🧰 Dashboard

- "My Designs" and "Shared with me" tabs for quick navigation
- Color-coded gradient thumbnails for each room (deterministic, based on room ID)
- Inline title editing — click the pencil icon or double-click the title field; `Enter` to save, `Escape` to cancel
- `Backspace` to delete a selected room card (with a confirmation modal)
- Double-click any room card to open the canvas

### ⌨️ Keyboard Shortcuts

| Shortcut                    | Action                                                      |
| --------------------------- | ----------------------------------------------------------- |
| `Backspace`                 | Delete selected layer(s) / Delete selected room (dashboard) |
| `Ctrl + Z`                  | Undo                                                        |
| `Ctrl + Shift + Z`          | Redo                                                        |
| `Ctrl + A`                  | Select all layers                                           |
| `Enter` / Double-click      | Open design (dashboard)                                     |
| `Double-click` (text layer) | Edit text inline                                            |

### 📱 Responsive Awareness

The canvas is a desktop-first experience. On screens narrower than 992px, users see a graceful fallback screen with a "Copy page URL" button so they can switch to a larger device without losing their link.

---

## 🛠️ Tech Stack

| Category             | Technology                                                                         |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Framework**        | [Next.js 15](https://nextjs.org/) (App Router, Turbopack)                          |
| **UI Library**       | [React 19](https://react.dev/)                                                     |
| **Language**         | [TypeScript](https://www.typescriptlang.org/)                                      |
| **Styling**          | [Tailwind CSS v4](https://tailwindcss.com/) with OKLCH color tokens                |
| **Real-time**        | [Liveblocks](https://liveblocks.io/) (Presence, Storage, History)                  |
| **Authentication**   | [NextAuth v5 / Auth.js](https://authjs.dev/) — Credentials provider + JWT sessions |
| **ORM**              | [Prisma](https://www.prisma.io/)                                                   |
| **Database**         | [PostgreSQL](https://www.postgresql.org/)                                          |
| **Freehand Drawing** | [perfect-freehand](https://github.com/steveruizok/perfect-freehand)                |
| **Color Picker**     | [react-colorful](https://github.com/omgovich/react-colorful)                       |
| **Icons**            | [Lucide React](https://lucide.dev/)                                                |
| **ID Generation**    | [nanoid](https://github.com/ai/nanoid)                                             |
| **Env Validation**   | [@t3-oss/env-nextjs](https://env.t3.gg/) + [Zod](https://zod.dev/)                 |
| **Package Manager**  | [pnpm](https://pnpm.io/)                                                           |
| **Deployment**       | [Vercel](https://vercel.com/)                                                      |

---

## 🗃️ Database Schema

```
User ──< Room (owned)
User ──< RoomInvitation >── Room
```

- **User** — stores email, bcrypt-hashed password, and NextAuth account/session records
- **Room** — owned by a single user; title defaults to `"Untitled"`
- **RoomInvitation** — join table connecting invitees to rooms; enforces a unique constraint on `(roomId, inviteeId)` to prevent duplicate invites

---

## ⚙️ Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 10 — `npm install -g pnpm`
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech/), [Supabase](https://supabase.com/))
- A [Liveblocks](https://liveblocks.io/) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/KeepSerene/ocular-figma-clone.git
cd ocular-figma-clone
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
# ── Database ──────────────────────────────────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# ── NextAuth ──────────────────────────────────────────────────
# Generate with: openssl rand -base64 32
AUTH_SECRET="your-auth-secret"

# ── Liveblocks ────────────────────────────────────────────────
LIVEBLOCKS_PUBLIC_KEY="pk_..."
LIVEBLOCKS_SECRET_KEY="sk_..."

# ── App URL ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Getting your Liveblocks keys:** Sign in at [liveblocks.io](https://liveblocks.io/), create a project, and copy the public and secret keys from the API Keys page.

### 4. Set up the database

```bash
# Push the schema to your database
pnpm db:push

# Or run migrations (recommended for production)
pnpm db:migrate
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Script             | Description                     |
| ------------------ | ------------------------------- |
| `pnpm dev`         | Start dev server with Turbopack |
| `pnpm build`       | Build for production            |
| `pnpm start`       | Start production server         |
| `pnpm check`       | Lint + type-check               |
| `pnpm typecheck`   | TypeScript type-check only      |
| `pnpm db:push`     | Push Prisma schema to database  |
| `pnpm db:migrate`  | Run pending migrations          |
| `pnpm db:generate` | Generate a new migration        |
| `pnpm db:studio`   | Open Prisma Studio              |

---

## 🚀 Deploying to Vercel

1. Push your repository to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add all environment variables from your `.env` file in the Vercel project settings
4. Set `NEXT_PUBLIC_APP_URL` to your deployed URL (e.g. `https://your-app.vercel.app`)
5. Deploy — Vercel handles the rest

> **Note:** `AUTH_SECRET` is **required** in production. The app will refuse to build without it.

---

## 📁 Project Structure (Tentative!)

```
ocular-figma-clone/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Sign-in / Sign-up pages
│   │   ├── dashboard/
│   │   │   └── designs/[designId]/ # Canvas page (Liveblocks room)
│   │   └── api/
│   │       └── liveblocks-auth/    # Liveblocks auth endpoint
│   ├── components/
│   │   ├── canvas/                 # SVG canvas + all layer components
│   │   ├── toolbar/                # Bottom toolbar (tools, undo, zoom)
│   │   ├── liveblocks/             # Room provider, live presence
│   │   ├── landing/                # Landing page sections
│   │   └── dashboard/              # Dashboard UI components
│   ├── actions/                    # Next.js Server Actions (auth, rooms)
│   ├── server/
│   │   ├── auth/                   # NextAuth config
│   │   ├── db.ts                   # Prisma client singleton
│   │   └── liveblocks.ts           # Liveblocks server client
│   ├── lib/utils.ts                # Canvas utilities (coord transforms, path math)
│   ├── types.ts                    # All shared TypeScript types & enums
│   └── env.js                      # Type-safe env validation
├── prisma/
│   └── schema.prisma               # Database schema
├── liveblocks.config.ts            # Liveblocks type declarations
└── middleware.ts                   # Route protection (dashboard auth guard)
```

---

## 🙋 Author

**Dhrubajyoti Bhattacharjee**

A full-stack developer with a focus on building real-time, interactive web applications with clean architecture and strong UX sensibility.

[![GitHub](https://img.shields.io/badge/GitHub-KeepSerene-181717?style=for-the-badge&logo=github)](https://github.com/KeepSerene)
[![Twitter](https://img.shields.io/badge/Twitter-@UsualLearner-1da1f2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/UsualLearner)

---

## 📄 License

Licensed under the [Apache 2.0 License](LICENSE).

---

<div align="center">

If you found this project interesting or learned something from it, consider giving it a ⭐ on GitHub — it helps a lot!

</div>
