<p align="center">
  <img src="https://img.icons8.com/fluency/96/car.png" alt="Zippy Rides Logo" width="80" />
</p>

<h1 align="center">🏍️ Zippy Rides — Vehicle Maintenance Tracker</h1>

<p align="center">
  Aplikasi web full-stack untuk melacak perawatan kendaraan, spare part, biaya servis, dan pajak — untuk motor maupun mobil — dalam satu dashboard yang modern dan responsif.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?logo=supabase" alt="Supabase" />
</p>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Database](#-arsitektur-database)
- [Struktur Folder](#-struktur-folder)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Environment Variables](#-environment-variables)
- [Penggunaan](#-penggunaan)
- [Screenshot](#-screenshot)
- [Lisensi](#-lisensi)

---

## 🚀 Tentang Proyek

**Zippy Rides** adalah aplikasi web vehicle maintenance tracker yang dibangun menggunakan arsitektur modern full-stack. Aplikasi ini memungkinkan pengguna untuk:

- Mengelola **banyak kendaraan** (motor & mobil) dalam satu akun
- Melacak **spare part** dengan interval penggantian berbasis kilometer
- Mencatat **biaya servis** dan menyimpan bukti receipt
- Memantau **pajak tahunan & 5 tahunan** dengan countdown otomatis
- Melihat **analytics** pengeluaran maintenance per kendaraan
- Menulis **journal** untuk mencatat gejala, modifikasi, dan catatan umum

### Logika Relasional

Sistem menggunakan logika kalkulasi dinamis untuk menentukan status part:

```
Sisa Umur Part = (km_saat_ganti + interval_km) - km_saat_ini
```

- 🟢 **Safe** — Sisa umur > 30% interval
- 🟡 **Warning** — Sisa umur ≤ 30% interval
- 🔴 **Overdue** — Sisa umur ≤ 0 (sudah lewat)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🏍️ **Multi-Vehicle Garage** | Kelola banyak kendaraan (Motor/Mobil) dengan foto, tipe, dan odometer |
| 🔧 **Smart Part Tracking** | Definisikan interval penggantian part, lihat progress bar sisa umur |
| 📝 **Service Logging** | Log servis multi-part sekaligus dengan biaya per-part dan upload receipt |
| 📊 **Expense Analytics** | Grafik batang bulanan pengeluaran per kendaraan menggunakan Recharts |
| 📅 **Tax Countdown** | Countdown pajak tahunan & 5 tahunan dengan badge warna otomatis |
| 📓 **Vehicle Journal** | Catat gejala (Symptom), modifikasi, dan catatan umum per kendaraan |
| 🌙 **Dark/Light Mode** | Toggle tema gelap/terang dengan next-themes |
| 🔐 **Authentication** | Signup/Login dengan Supabase Auth (email + password) |
| 📱 **Responsive Design** | Sidebar collapsible, mobile-friendly dengan split-screen auth layout |
| ⚡ **Turbopack** | Development server super cepat dengan Turbopack |

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Next.js](https://nextjs.org/) | 16.2.6 | React framework dengan App Router & Server Actions |
| [React](https://react.dev/) | 19.2.4 | UI library |
| [TypeScript](https://typescriptlang.org/) | 5.x | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS framework |
| [Shadcn UI](https://ui.shadcn.com/) | Latest | Component library (Base UI primitives) |
| [Lucide React](https://lucide.dev/) | 1.14.0 | Icon library |
| [Recharts](https://recharts.org/) | 3.8.0 | Chart library untuk analytics |
| [Sonner](https://sonner.emilkowal.dev/) | 2.0.7 | Toast notification |
| [date-fns](https://date-fns.org/) | 4.1.0 | Date utility library |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6 | Dark/light mode |

### Backend & Database
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Supabase](https://supabase.com/) | — | Authentication, PostgreSQL database, & file storage |
| [Prisma](https://prisma.io/) | 7.8.0 | ORM & database migrations |
| [@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/postgresql) | 7.8.0 | PostgreSQL adapter untuk Prisma 7 |
| [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side) | 0.10.3 | Server-side auth dengan cookie-based sessions |

---

## 🗄️ Arsitektur Database

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│    User      │──1:N──│   Vehicle     │──1:N──│  PartInterval   │
│              │       │              │       │                 │
│ id (UUID)    │       │ id           │       │ id              │
│ email        │       │ userId (FK)  │       │ vehicleId (FK)  │
│ name         │       │ name         │       │ partName        │
│ avatarUrl    │       │ type (enum)  │       │ intervalKm      │
│ createdAt    │       │ currentMileage│      │ createdAt       │
│ updatedAt    │       │ imageUrl     │       └────────┬────────┘
└──────────────┘       │ annualTaxDate│                │
                       │ fiveYearTaxDate│              │ 1:N
                       │ createdAt    │                │
                       │ updatedAt    │       ┌────────┴────────┐
                       └──────┬───────┘       │ PartReplacement │
                              │               │                 │
                              │ 1:N           │ id              │
                              │               │ partIntervalId  │
                       ┌──────┴───────┐       │ replacedAtKm    │
                       │VehicleJournal│       │ cost            │
                       │              │       │ receiptImageUrl │
                       │ id           │       │ replacedAt      │
                       │ vehicleId    │       └─────────────────┘
                       │ type (enum)  │
                       │ title        │
                       │ description  │
                       │ createdAt    │
                       └──────────────┘
```

### Enums
- **VehicleType**: `MOTOR` | `MOBIL`
- **JournalType**: `SYMPTOM` | `MODIFICATION` | `GENERAL`

---

## 📁 Struktur Folder

```
zippy-rides/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth layout group
│   │   │   ├── login/         # Login page
│   │   │   ├── signup/        # Signup page
│   │   │   └── layout.tsx     # Split-screen auth layout
│   │   ├── (dashboard)/       # Dashboard layout group
│   │   │   ├── garage/        # Vehicle garage
│   │   │   │   ├── [vehicleId]/ # Vehicle detail (dynamic)
│   │   │   │   └── page.tsx   # Garage listing
│   │   │   ├── analytics/     # Expense analytics
│   │   │   ├── settings/      # User settings
│   │   │   └── layout.tsx     # Sidebar + header layout
│   │   ├── auth/callback/     # Supabase auth callback
│   │   ├── globals.css        # Global styles + theme tokens
│   │   ├── layout.tsx         # Root layout (providers)
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Shadcn UI components
│   │   ├── analytics/         # Chart & stats components
│   │   ├── journal/           # Journal components
│   │   ├── parts/             # Part interval & service components
│   │   ├── settings/          # Settings form
│   │   ├── vehicles/          # Vehicle CRUD components
│   │   ├── app-sidebar.tsx    # Main sidebar navigation
│   │   └── mode-toggle.tsx    # Dark/light theme toggle
│   ├── generated/prisma/      # Generated Prisma client
│   ├── lib/
│   │   ├── actions/           # Server Actions (auth, vehicles, parts, journal, settings)
│   │   ├── supabase/          # Supabase client configs (server, browser, middleware)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── proxy.ts               # Next.js 16 proxy (auth middleware)
├── .env.local                 # Environment variables (local)
├── prisma.config.ts           # Prisma configuration
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 📦 Prasyarat

Pastikan tools berikut sudah terinstall di komputer kamu:

| Tool | Versi Minimum | Cek Versi |
|------|---------------|-----------|
| [Node.js](https://nodejs.org/) | 18.x | `node --version` |
| [npm](https://www.npmjs.com/) | 9.x | `npm --version` |
| [Git](https://git-scm.com/) | 2.x | `git --version` |

Selain itu, kamu memerlukan:
- Akun [Supabase](https://supabase.com/) (gratis) untuk database dan authentication

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/zippy-rides.git
cd zippy-rides
```

### 2. Install Dependencies

```bash
npm install
```

> Script `postinstall` akan otomatis menjalankan `prisma generate` untuk membuat Prisma client.

### 3. Setup Supabase

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard)
2. Copy URL dan Anon Key dari **Settings → API**
3. Copy connection string dari **Settings → Database → Connection string** (pilih URI)

### 4. Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase Auth & Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Connect to Supabase via connection pooling (used by Prisma)
DATABASE_URL="postgresql://postgres.[your-project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database (used for Prisma migrations)
DIRECT_URL="postgresql://postgres.[your-project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### 5. Jalankan Database Migration

```bash
npx prisma migrate dev --name init
```

Perintah ini akan:
- Membuat tabel-tabel di database Supabase
- Generate Prisma client

### 6. (Opsional) Matikan Email Confirmation

Agar bisa langsung login setelah signup tanpa verifikasi email:

1. Buka Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Uncheck **"Confirm email"**
3. Save

---

## 🚀 Menjalankan Aplikasi

### Development Mode (dengan Turbopack)

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 🔑 Environment Variables

| Variable | Deskripsi | Wajib |
|----------|-----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public API key Supabase | ✅ |
| `DATABASE_URL` | Connection string PostgreSQL (pooled, port 6543) | ✅ |
| `DIRECT_URL` | Direct connection string (port 5432, untuk migrations) | ✅ |

---

## 📖 Penggunaan

### 1. Registrasi & Login
- Buka `http://localhost:3000` → klik **"Get Started"** atau **"Sign In"**
- Buat akun baru dengan email dan password
- Login dengan credentials yang sudah dibuat

### 2. Menambah Kendaraan
- Klik tombol **"Add Vehicle"** di halaman Garage
- Isi nama kendaraan, tipe (Motor/Mobil), odometer, dan tanggal pajak
- Upload foto kendaraan (opsional)

### 3. Mengelola Part Interval
- Buka detail kendaraan → tab **"Parts & Service"**
- Klik **"Add Part"** untuk mendefinisikan interval penggantian (misal: Filter Udara setiap 10.000 km)
- Klik **"Log Service"** untuk mencatat penggantian part dengan biaya dan receipt

### 4. Update Odometer
- Di kartu kendaraan, klik area odometer
- Masukkan kilometer terbaru → progress bar part akan terupdate otomatis

### 5. Melihat Analytics
- Buka halaman **Analytics** di sidebar
- Lihat grafik pengeluaran bulanan per kendaraan
- Lihat total biaya, rata-rata bulanan, dan kendaraan paling mahal

### 6. Menulis Journal
- Buka detail kendaraan → tab **"Journal"**
- Klik **"Add Entry"** → pilih tipe (Symptom/Modification/General)
- Tulis judul dan deskripsi

---

## 📸 Screenshot

### Landing Page
> Halaman utama dengan hero section, fitur-fitur, dan CTA

### Auth (Login/Signup)
> Split-screen layout dengan branding panel dan form

### Dashboard — Garage
> Grid kendaraan dengan progress bar part dan countdown pajak

### Vehicle Detail
> Info card + tab Parts & Service dan Journal

### Analytics
> Grafik pengeluaran bulanan dengan stats cards

---

## 👨‍💻 Dibuat Oleh

**Danendra Bagas Himawan**

---

## 📄 Lisensi

Project ini dibuat untuk keperluan **Tugas Produktif**.

---

<p align="center">
  Built with ❤️ using Next.js 16, Prisma 7, Supabase, and Tailwind CSS 4
</p>
