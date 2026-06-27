# ARCHITECTURE.md — نقشه‌ی مهندسی فاز L2 (Visual Overhaul)

> این سند «چه چیزی» و «چرایی» فاز L2 را تعریف می‌کند؛ «چگونگی» گام‌به‌گام در `tasks.md` (L2-1 تا L2-N).
> اصول حاکم (که از قبل پیاده شده‌اند و دست‌نخورده می‌مانند): **Server-Authoritative**، **RLS-First**، **Atomic via RPC**.

---

## ۱. وضعیت موجود (Snapshot — برای زمینه، نه برای تغییر)

> این بخش فقط برای آگاهی کدنویس است. این موارد ساخته‌شده‌اند و در این فاز بازنویسی نمی‌شوند مگر صریحاً در یک تسک گفته شود.

### ۱.۱. ساختار فعلی فرانت‌اند

- **`App.tsx`** (ورودی اصلی): مدیریت Page routing، رندر `BottomNav`، lazy-load صفحات سنگین (`ChatView`, `ProjectsView`, `SubscriptionPage`)، مودال‌های سراسری (`TaskEditorModal`, `NoteEditorModal`, `HabitManagerModal`, `PaywallModal`, `ProfileModal`)، `NetworkBanner`، `ToastNotifications`. کانتینر ریشه: `bg-gray-950 min-h-screen text-white` با `h-[100dvh]`.
- **`contexts/`**: `AuthContext` (احراز هویت Supabase) و `DataContext` (دسترسی سراسری به داده از طریق `useDataManager`).
- **`hooks/`**: `useDataManager` (CRUD کامل + استیت)، `useOfflineSync`، `useRealtimeSync`، `useReminderScheduler`، `useNetworkStatus`.
- **`services/`**: لایه‌ی ارتباط با Supabase و Gemini. تغییر ساختاری ممنوع.
- **`components/`**: کامپوننت‌های مشترک (`BottomNav`, `Modal`, `icons`, `NetworkBanner`, `ToastNotifications`, `ProfileModal`, `PaywallModal`, `Auth`).
- **`features/`**: ساختار feature-based برای dashboard، tasks، notes، projects، chat، habits، billing، onboarding، announcements.

### ۱.۲. ساختار فعلی داشبورد (`features/dashboard/`)

| فایل | نقش | کلاس‌های پایه‌ی فعلی | نکات حیاتی |
|------|------|----------------------|-------------|
| `Dashboard.tsx` | ارکستراسیون: هدر + grid ۵ ستونی + مودال‌ها | `pb-2` → `px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pt-5` | استیت `isProfileOpen`, `isReportOpen`؛ محاسبه `selectedDayProgressStats` |
| `DashboardHeader.tsx` | هدر چسبان موبایل با رینگ پیشرفت | `bg-gray-950/80 backdrop-blur-xl border-b border-white/10 pt-safe` | **قانون طلایی: ساختار حفظ شود، فقط استایل آپدیت شود**؛ props: `onOpenProfile`, `todayProgress`, `hasTasksToday` |
| `WeekCalendar.tsx` | تقویم هفته‌ی جاری | روز فعال: `bg-gradient-to-br from-indigo-500 to-purple-600` | props: `selectedDate`, `onDateChange`؛ استفاده از `toJalaali`, `persianMonths` |
| `TodaysPlan.tsx` | لیست کارهای امروز | `WidgetContainer` + checkbox `bg-sky-500 border-sky-400` | `toggleTaskCompletion`؛ sort: done → آخر |
| `TodaysNotes.tsx` | یادداشت‌های امروز | `bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl` | فیلتر با `isSameTehranDay` — مستقل از WidgetContainer |
| `QuickCapture.tsx` | ورودی سریع | `WidgetContainer` + textarea `bg-gray-800/70` + دکمه `bg-sky-600/80` و `bg-purple-600/80` | `addTask`, `addNote`؛ استیت `input` |
| `StatsOverview.tsx` | ۴ کارت آمار + دکمه‌ی گزارش | `WidgetContainer` + StatCard `bg-gray-800/70 border border-white/5` + دکمه `bg-zinc-850/40` | `onOpenWeeklyReport` باید به `WeeklyReportModal` متصل شود |
| `HabitTracker.tsx` | ردیاب عادت‌ها | `WidgetContainer` + checkbox `bg-green-500 border-green-400` + دکمه `bg-orange-600/20` | `toggleHabitCompletion`, `editHabit` |
| `KeyProjects.tsx` | پروژه‌های اولویت‌بالا | `WidgetContainer` + progress bar `bg-gray-700/50` + `getColorClass()` | فیلتر `Priority.High` |
| `WeeklyReportModal.tsx` | مودال گزارش هفتگی | `bg-zinc-950/90 border-t sm:border border-white/10 rounded-t-[2.5rem]` | استیت `activeTab`؛ محاسبه `weekBoundaries`؛ motion/react |
| `WidgetContainer.tsx` | wrapper پایه‌ی ویجت‌ها | `bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/30` | فقط `children` + `className` + `id` |

### ۱.۳. استایل سراسری فعلی (`index.css`)

- متغیرهای `safe-area-inset` (top/bottom) — **حیاتی برای iOS**.
- کلاس‌های `.pt-safe`, `.pb-safe`, `.pb-safe-content`, `.pb-bottom-nav`, `.bottom-nav-inset`, `.pb-safe-lg`, `.safe-spacer-bottom`.
- هک‌های `-webkit-overflow-scrolling: touch`، `overscroll-behavior: contain`، `-webkit-text-size-adjust: 100%`.
- هک autofill برای فیلدهای فرم.
- **هیچ توکن رنگی وجود ندارد.** همه‌ی رنگ‌ها هاردکد شده در کلاس‌های Tailwind کامپوننت‌ها.
- **همه‌ی این موارد باید دست‌نخورده بمانند.**

### ۱.۴. `index.html` فعلی

- Tailwind CDN (`cdn.tailwindcss.com`).
- فونت Vazirmatn از Google Fonts.
- `theme-color` meta = `#09090b`.
- importmap برای React/Vite/Supabase.
- **هیچ اسکریپت تشخیص تم وجود ندارد.**

### ۱.۵. سایر صفحات (فاز دوم)

| صفحه | فایل اصلی | رنگ‌های فعلی که باید جایگزین شوند |
|------|-----------|----------------------------------|
| تسک‌ها | `features/tasks/TasksView.tsx` | `bg-sky-500/10 border-sky-500/20 text-sky-400`, `text-zinc-500`, `bg-zinc-900`, `border-zinc-800` |
| کارت تسک | `features/tasks/components/TaskCard.tsx` | `bg-sky-500 border-sky-500`, `bg-zinc-900/60 border-white/5`, `text-zinc-200`, `text-zinc-500` |
| یادداشت‌ها | `features/notes/NotesView.tsx` | `bg-zinc-950`, `from-purple-600 to-fuchsia-600`, `bg-zinc-900 border-zinc-800` |
| کارت یادداشت | `features/notes/components/NoteCard.tsx` | `bg-zinc-900 border-white/5`, `from-purple-500/20 to-fuchsia-600/20` |
| پروژه‌ها | `features/projects/ProjectsView.tsx` | `bg-slate-950`, `bg-sky-600`, `from-white via-indigo-200 to-sky-300` |
| کارت پروژه | `features/projects/components/ProjectCard.tsx` | `bg-zinc-900/60 border-white/5`, `colorClasses` و `priorityClasses` با sky/red/green/yellow/purple |
| چت AI | `features/chat/ChatView.tsx` | `bg-sky-600`, `bg-gray-800/50`, `text-sky-400`, `ring-sky-400/50` |
| نوار پایین | `components/BottomNav.tsx` | `bg-gray-900/70 backdrop-blur-xl border-white/10`, `from-sky-500 to-fuchsia-500`, `text-sky-400`, `text-gray-500` |
| نوار کناری | `components/Sidebar.tsx` | **خالی (۰ بایت)** — باید ساخته شود |
| Auth | `components/Auth.tsx` | `bg-gray-950`, `text-sky-400`, `bg-sky-600` |
| ProfileModal | `components/ProfileModal.tsx` | `bg-gray-900 border-white/10`, `text-sky-400` |
| PaywallModal | `components/PaywallModal.tsx` | `bg-gray-900 border-white/10`, `bg-sky-600` |

---

## ۲. معماری فاز L2 — ریدیزاین داشبورد (فاز اول)

### ۲.۱. استراتژی کلی

تمام کامپوننت‌های زنده از تم تیره‌ی هاردکد شده استفاده می‌کنند. هدف: جایگزینی تمام رنگ‌های هاردکد با توکن‌های CSS Variable که در `index.css` تعریف می‌شوند، و افزودن چیدمان دسکتاپ سه‌ستونه.

**رویکرد:** «توکن جایگزین هاردکد» — هر کلاس رنگی هاردکد شده (مثل `bg-gray-900/50`) با کلاس توکنی معادل (مثل `glass-card`) جایگزین می‌شود. هیچ کدی از فایل ماکت استاتیک کپی نمی‌شود. تمام دستورالعمل‌ها در `tasks.md` به صورت دقیق «کلاس X را حذف کن، کلاس Y را اضافه کن» مشخص شده‌اند.

> ### ⚠️ بازنگری بنیادین معماری L2 (Hardening Pass)
> این بخش پس از کالبدشکافیِ کاملِ کد اضافه شده و **بر هر تصمیم متناقضِ قبلی در این سند ارجح است**. خلاصه‌ی ۴ تصمیمِ کلیدیِ معماری که سرچشمه‌ی بیشتر باگ‌ها بود:
>
> 1. **تک‌منبع کردن پس‌زمینه + حذف تصویر خارجی (رفع «پس‌زمینه‌ی نامرئی»):** ماکت از `--bg-image: url(unsplash...)` و یک `div.bg-nature` با `z-index:-1` استفاده می‌کرد. این برای یک PWAی Offline-First **ریسک پروداکشن** است (در آفلاین/۴۰۴ تصویر بارگذاری نمی‌شود و کارت‌های گلسِ نیمه‌شفاف بی‌پس‌زمینه و ناخوانا می‌شوند). علاوه بر این، نقشه‌ی قبلی `div.bg-nature` را **هم در `App.tsx` و هم در `Dashboard.tsx`** رندر می‌کرد (Double Background). **تصمیم نهایی:** پس‌زمینه‌ی پایه توکن‌محور و خوداتکا است (`--bg-base`، سالید/گرادیان CSS، طبق `DesignSystem.md`)، و **دقیقاً یک‌بار** در ریشه‌ی `App.tsx` اعمال می‌شود (نه در Dashboard). کلاس `.bg-nature` دیگر به تصویر خارجی وابسته نیست (به `--bg-base` نگاشت می‌شود).
> 2. **تثبیت استراتژی دارک‌مود کلاس‌محور (رفع «عدم تطابق توکن Tailwind با CSS»):** Tailwind Play-CDN به‌صورت پیش‌فرض `darkMode: 'media'` است، یعنی utilityهای `dark:` به `prefers-color-scheme`ی سیستم‌عامل گوش می‌دهند، نه به کلاس `.dark`ی که toggle تم روی `<html>` می‌گذارد. نتیجه: تمِ split-brain (متغیرهای CSS با toggle عوض می‌شوند ولی `dark:`های Tailwind با سیستم‌عامل). **تصمیم نهایی:** افزودن `tailwind.config = { darkMode: 'class' }` به‌صورت inline در `index.html` بلافاصله بعد از اسکریپت CDN (تسک L2-2). تنها سلکتور تم `.dark` است (`data-theme` حذف می‌شود تا سطح کاهش یابد).
> 3. **هک Autofill توکن‌محور (رفع باگ Autofill):** هک فعلی `#09090b` را هاردکد می‌کند که در لایت‌مود (فیلد سفید) جعبه‌ی تقریباً مشکی با متن سفید می‌سازد و فیلد را خراب می‌کند. نقشه‌ی قبلی (L2-27) می‌خواست قانون را «داخل `:root`» بگذارد که از نظر CSS بی‌معناست (`:root` خودِ html است، نه wrapper). **تصمیم نهایی:** دو توکن `--autofill-bg` و `--autofill-text` تعریف و در یک قانونِ واحدِ autofill با `var()` استفاده می‌شوند؛ مقادیر در `:root`/`.dark` تغییر می‌کنند.
> 4. **حذف Prop Drilling در ناوبری (رفع باگ سایدبار):** `Sidebar` و هر کامپوننتِ ناوبری، `currentPage`/`setCurrentPage` را **مستقیماً از `useData()`** می‌گیرند (این مقادیر در `DataContext` موجودند). از `Dashboard` فقط `onOpenProfile` به‌عنوان prop پاس می‌شود (یک نگرانیِ UIِ محلی، قابل قبول).
>
> **هم‌چنین — نگاشت توکن‌ها (تک منبع حقیقت):** نام توکن‌ها بین `DesignSystem.md` (مفهومی: `--bg-base`, `--bg-surface`, `--text-primary`, `--text-secondary`) و ماکت/پیاده‌سازی (`--bg-card`, `--text-main`, `--text-muted`) متفاوت بود. برای پرهیز از over-engineering و ریپلِ گسترده، **نام‌های پیاده‌سازی (ماکت) به‌عنوان مجموعه‌ی کانونی** انتخاب می‌شوند (چون جدول جایگزینی §۲.۵ و هر ۲۷ تسک از همین نام‌ها استفاده می‌کنند و مقادیرشان با DesignSystem یکی است)؛ تنها استثناء: `--bg-image` با `--bg-base` جایگزین می‌شود. نگاشت کامل در §۹.

### ۲.۲. ساختار چیدمان دسکتاپ — سایدبارِ گلوبال در App + گرید واحدِ داشبورد

> ### ⛔️ اصلاح بحرانی: تله‌ی ناوبری دسکتاپ (Sidebar حتماً Global)
> نسخه‌ی قبلیِ این سند `<Sidebar/>` را **داخل `Dashboard.tsx`** می‌گذاشت. این یک باگِ مرگبارِ پروداکشن است: `App.tsx` با تغییر `currentPage` کلِ `Dashboard` را Unmount می‌کند؛ پس وقتی کاربرِ دسکتاپ روی «کارها/یادداشت‌ها/پروژه‌ها» می‌رود، سایدبار **ناپدید** می‌شود و چون `BottomNav` هم در دسکتاپ `lg:hidden` است، کاربر **بدون هیچ راهِ ناوبری حبس** می‌شود.
>
> **تصمیم نهایی:** سایدبارِ دسکتاپ یک المانِ **Global و دائمی** در `App.tsx` است (کنار `<main>`)، خارج از `renderContent()`/صفحات. روی همه‌ی صفحات می‌ماند و هرگز Unmount نمی‌شود. `Dashboard.tsx` دیگر `Sidebar` را رندر نمی‌کند و گریدِ آن **دوستونه** می‌شود (سایدبار از بیرون می‌آید).

**ساختار صحیح در `App.tsx` (لِی‌اوتِ ریشه — Shell سراسری):**
```jsx
// MainApp
<div className="relative flex h-[100dvh]" id="main-app-container">
  <div className="bg-nature" />            {/* تنها لایه‌ی پس‌زمینه، گلوبال */}

  {/* سایدبارِ دسکتاپ — گلوبال، دائمی، روی همه‌ی صفحات */}
  <Sidebar currentPage={currentPage} setPage={setCurrentPage} onOpenProfile={() => setIsProfileOpen(true)} className="hidden lg:flex shrink-0" />

  {/* ستون محتوا */}
  <div className="flex-1 flex flex-col min-w-0">
    <NetworkBanner />
    <main className="flex-1 overflow-y-auto overflow-x-hidden pb-bottom-nav lg:pb-6" id="view-viewport">
      {renderContent()}
    </main>
  </div>

  <ToastNotifications ... />
  <div className="lg:hidden"><BottomNav ... /></div>   {/* فقط موبایل */}

  {/* مودال‌های گلوبال — شامل ProfileModal (منتقل‌شده از Dashboard) */}
  <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} ... />
  <TaskEditorModal ... /> <NoteEditorModal ... /> ...
</div>
```

**ساختار صحیح در `Dashboard.tsx` (فقط محتوای داشبورد — دوستونه):**
```jsx
<div className="pb-2">
  {/* هدر موبایل — فقط موبایل. دکمه‌ی پروفایل از طریق CustomEvent باز می‌شود (پایین). */}
  <div className="lg:hidden">
    <DashboardHeader onOpenProfile={() => window.dispatchEvent(new CustomEvent('hexer:open-profile'))} ... />
  </div>

  <div className="px-4 sm:px-6 max-w-[1280px] mx-auto pt-5 space-y-6">
    {/* گریدِ داشبورد: موبایل ۱ ستون، دسکتاپ ۲ ستون (سایدبار از App می‌آید، نه اینجا) */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-6">

      {/* ستون مرکز فرمان */}
      <div className="space-y-6 min-w-0">
        <QuickCapture />
        <ProductivityChart />     {/* L2-14: Presentational با داده‌ی واقعیِ tasks */}
        <TodaysPlan />
      </div>

      {/* ستون بافتار داده */}
      <div className="space-y-6 min-w-0">
        <StatsOverview onOpenWeeklyReport={() => setIsReportOpen(true)} />
        <WeekCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <KeyProjects />
        <FocusTimer />            {/* L2-15: پومودوروی کلاینت با state محلی + setInterval */}
      </div>
    </div>
  </div>

  <WeeklyReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
  {/* ProfileModal دیگر اینجا نیست — به App منتقل شد */}
</div>
```

**مکانیزمِ بازکردنِ پروفایل بدون Prop Drilling/Duplicate:**
- `ProfileModal` به‌صورت **گلوبال در `App.tsx`** رندر می‌شود (state `isProfileOpen` در `MainApp`) — هم‌سو با بقیه‌ی مودال‌های گلوبال.
- سایدبارِ دسکتاپ (در App): مستقیماً `onOpenProfile={() => setIsProfileOpen(true)}`.
- هدر موبایل (در Dashboard): `window.dispatchEvent(new CustomEvent('hexer:open-profile'))`؛ `App.tsx` با `addEventListener('hexer:open-profile', ...)` آن را باز می‌کند. این دقیقاً هم‌الگوی رویدادِ موجودِ `navigate_to_subscription` در `App.tsx` است (بدون تغییرِ hook/context، بدون درَیل).

**قانون حیاتی — ممنوعیت Duplicate Mounting (بدون تغییر):**
- هر کامپوننت دقیقاً **یک بار** در درخت JSX نوشته شود؛ ساختِ دو کانتینرِ مجزای موبایل/دسکتاپ ممنوع.
- چیدمان فقط با گریدِ ریسپانسیو و wrapperهای `hidden lg:flex` / `lg:hidden` کنترل شود.
- `bg-nature` فقط یک‌بار (در App).

> **تصمیمِ نهاییِ پروداکت (TodaysNotes & HabitTracker):** این دو ویجت در ماکت نیستند و در طرحِ جدید لازم نیستند. از درختِ رندرِ `Dashboard.tsx` **حذف** می‌شوند (حذفِ import/رندر در L2-4). **فایل‌هایشان Delete نمی‌شوند** (احتمال بازگشت در فاز بعد). تسک‌های ری‌استایلِ آن‌ها (L2-12 HabitTracker و L2-13 TodaysNotes) منسوخ شده‌اند.

### ۲.۳. توکن‌های CSS Variable (اضافه شدن به `index.css`)

> ### ⛔️ اصلاح بحرانی: شفافیتِ Tailwind (مدلِ دو-توکنی Hex + RGB-channel)
> در Tailwind v3، ترکیبِ یک متغیرِ Hex با مودیفایرِ شفافیت (`bg-[var(--color-primary)]/10`) **خروجیِ نامعتبر** می‌دهد (`background-color: #D8F066 / 0.1`) و تمام Badgeها/پس‌زمینه‌های شفاف **ناپدید** می‌شوند. راهکارِ اصولی و idiomatic: هر رنگی که با مودیفایرِ `/opacity` در Tailwind استفاده می‌شود، به‌صورت **کانالِ خامِ RGB** تعریف و در `tailwind.config` با سینتکسِ `rgb(var(--x) / <alpha-value>)` ثبت شود.
>
> **مدلِ دو-توکنی (هر دو لازم‌اند):**
> - **توکن‌های کانالی `*-rgb`** (فقط اعداد، فاصله‌دار) → برای رجیستر در `tailwind.config` و استفاده با utilityهای رنگیِ Tailwind + شفافیت (`bg-primary/10`، `border-primary/30`، `text-muted`).
> - **توکن‌های مقدارِ کاملِ Hex/rgba** → برای استفاده‌ی مستقیم در **CSSِ سفارشی، SVG و کلاس‌های گلس** (`.glass-card`, `.tile-lime`, `stroke="var(--color-primary)"`). این‌ها هرگز با مودیفایرِ `/opacity`ی Tailwind ترکیب نمی‌شوند.

**Light Mode (`:root`):**

توکن‌های کانالی (channels — برای Tailwind config):
`--color-primary-rgb: 216 240 102` · `--color-primary-hover-rgb: 193 219 60` · `--on-primary-rgb: 0 0 0`
`--text-main-rgb: 17 24 39` · `--text-muted-rgb: 107 114 128` · `--border-subtle-rgb: 229 231 235`
`--success-rgb: 16 185 129` · `--error-rgb: 239 68 68` · `--warning-rgb: 245 158 11`

توکن‌های مقدار-کامل (برای CSS/SVG/گلس):
`--color-primary: #D8F066` · `--color-primary-hover: #C1DB3C` · `--text-on-primary: #000000`
`--bg-base: #F4F5F7`  ← پس‌زمینه‌ی پایه‌ی خوداتکا (بدون تصویر خارجی؛ گرادیان ملایم مجاز: `linear-gradient(180deg,#F4F5F7,#ECEEF2)`)
`--bg-app-glass: rgba(244,245,247,0.6)` · `--bg-panel-glass: rgba(255,255,255,0.7)` · `--bg-card: rgba(255,255,255,0.85)`
`--text-main: #111827` · `--text-muted: #6B7280` · `--border-subtle: #E5E7EB` · `--border-neon: transparent`
`--input-focus-ring: #111827` · `--nav-active-bg: var(--color-primary)` · `--nav-active-text: var(--text-on-primary)`
`--nav-hover-bg: rgba(255,255,255,0.6)` · `--ink-bg: #16161A` · `--ink-text: #FFFFFF`
`--semantic-error: #EF4444` · `--semantic-error-soft: rgba(239,68,68,0.1)` · `--semantic-success: #10B981`
`--shadow-glass: 0 30px 60px -15px rgba(0,0,0,0.15)` · `--shadow-card: 0 10px 25px rgba(0,0,0,0.05)` · `--shadow-btn: none`
`--autofill-bg: #FFFFFF` · `--autofill-text: #111827`
`--radius-sm: 12px` · `--radius-md: 16px` · `--radius-lg: 24px` · `--radius-pill: 9999px`

**Dark Mode (`.dark`):**

توکن‌های کانالی (override):
`--text-main-rgb: 249 250 251` · `--text-muted-rgb: 156 163 175` · `--border-subtle-rgb: 51 65 85`
`--success-rgb: 34 197 94` · `--error-rgb: 255 107 107` · `--warning-rgb: 251 191 36`
(`--color-primary-rgb`/`--on-primary-rgb` در هر دو مود یکسان‌اند.)

توکن‌های مقدار-کامل (override):
`--bg-base: #121212`  ← (گرادیان مجاز: `linear-gradient(180deg,#121212,#0E0E10)`)
`--bg-app-glass: rgba(18,18,20,0.6)` · `--bg-panel-glass: rgba(30,41,59,0.4)` · `--bg-card: rgba(30,41,59,0.55)`
`--text-main: #F9FAFB` · `--text-muted: #9CA3AF` · `--border-subtle: #334155` · `--border-neon: #D8F066`
`--input-focus-ring: #D8F066` · `--nav-active-bg: rgba(216,240,102,0.08)` · `--nav-active-text: var(--color-primary)`
`--nav-hover-bg: rgba(255,255,255,0.05)` · `--ink-bg: rgba(216,240,102,0.08)` · `--ink-text: var(--color-primary)`
`--semantic-error: #FF6B6B` · `--semantic-error-soft: rgba(255,107,107,0.1)` · `--semantic-success: #22C55E`
`--shadow-glass: none` · `--shadow-card: none` · `--shadow-btn: none`
`--autofill-bg: #09090b` · `--autofill-text: #FFFFFF`

> **چرا هم Hex و هم RGB؟** اگر `--color-primary` را فقط کانال کنیم (`216 240 102`)، آنگاه `.bg-lime { background: var(--color-primary) }` و `stroke="var(--color-primary)"` **می‌شکنند** (مقدارِ `216 240 102` رنگِ معتبر نیست). پس مقدارِ Hex برای CSS/SVG و کانال برای Tailwind utility هر دو لازم‌اند.

### ۲.۴. کلاس‌های کمکی (اضافه شدن به `index.css`)

> **پیکربندی Tailwind (در `index.html`، تسک L2-2):** برای اینکه utilityهای رنگی + شفافیت کار کنند، توکن‌های کانالی باید در `tailwind.config` ثبت شوند:
> ```html
> <script src="https://cdn.tailwindcss.com"></script>
> <script>
>   tailwind.config = {
>     darkMode: 'class',
>     theme: { extend: { colors: {
>       primary:        'rgb(var(--color-primary-rgb) / <alpha-value>)',
>       'primary-hover':'rgb(var(--color-primary-hover-rgb) / <alpha-value>)',
>       'on-primary':   'rgb(var(--on-primary-rgb) / <alpha-value>)',
>       main:           'rgb(var(--text-main-rgb) / <alpha-value>)',
>       muted:          'rgb(var(--text-muted-rgb) / <alpha-value>)',
>       subtle:         'rgb(var(--border-subtle-rgb) / <alpha-value>)',
>       success:        'rgb(var(--success-rgb) / <alpha-value>)',
>       error:          'rgb(var(--error-rgb) / <alpha-value>)',
>       warning:        'rgb(var(--warning-rgb) / <alpha-value>)',
>     } } }
>   };
> </script>
> ```
> پس از این، مدلِ کدنویس از کلاس‌های تمیزِ Tailwind استفاده می‌کند: `bg-primary`, `bg-primary/10`, `text-primary`, `border-primary/30`, `ring-primary/50`, `text-main`, `text-muted`, `border-subtle`, `bg-error/10`, `text-error`, `bg-success/10`, `text-on-primary` — همگی با مودیفایرِ `/opacity` به‌درستی کار می‌کنند. سطوحِ گلس (`--bg-card`, `--bg-app-glass`...) که از قبل rgba هستند، از طریقِ کلاس‌های `.glass-*` یا `bg-[var(--bg-card)]` **بدونِ** مودیفایرِ شفافیت استفاده می‌شوند.

```css
.glass-app { background: var(--bg-app-glass); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-glass); transition: all 0.4s ease; }
.glass-panel { background: var(--bg-panel-glass); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-card); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: all 0.4s ease; }
.glass-card { background: var(--bg-card); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-card); transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
.glass-card:hover { transform: translateY(-2px); }
.tile-ink { background: var(--ink-bg); color: var(--ink-text); border: 1px solid var(--border-neon); box-shadow: var(--shadow-card); transition: all 0.4s ease; }
.tile-lime { background-color: var(--color-primary); color: var(--text-on-primary) !important; border: none; box-shadow: var(--shadow-card); }
.dark .tile-lime { box-shadow: 0 0 25px rgba(216,240,102,0.15); }
.nav-active { background: var(--nav-active-bg); color: var(--nav-active-text); border: 1px solid var(--border-neon); font-weight: bold; transition: all 0.3s ease; }
.bg-lime { background-color: var(--color-primary); color: var(--text-on-primary) !important; }
.text-lime { color: var(--color-primary); }
/* پس‌زمینه‌ی پایه‌ی خوداتکا — بدون تصویر خارجی. یک‌بار در ریشه‌ی App اعمال می‌شود. */
.bg-nature { position: fixed; inset: 0; z-index: -1; background: var(--bg-base); transition: background 0.4s ease; }
/* یک هاله‌ی ملایمِ لیمویی برای عمق (اختیاری، خوداتکا و سبک) */
.bg-nature::after { content: ''; position: absolute; inset: 0; background: radial-gradient(1200px 600px at 80% -10%, rgba(216,240,102,0.06), transparent 60%); }
.soft-scroll::-webkit-scrollbar { width: 4px; }
.soft-scroll::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 99px; opacity: 0.3; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.task-check.is-done { background: var(--color-primary); border-color: var(--color-primary); }
.task-check.is-done svg { color: var(--text-on-primary); }

/* نمایش/پنهان آیکن تم به‌صورت CSS-محور (نه querySelector) — مقاوم در برابر re-render ریکت */
/* ⛔️ هشدار: روی تگِ این آیکن‌ها هرگز کلاسِ `hidden`ی Tailwind گذاشته نشود (display:none که این قوانین را خنثی می‌کند). فقط کلاس‌های theme-icon-* قرار بگیرند؛ مدیریتِ نمایش کاملاً با همین CSS است. */
.theme-icon-dark { display: none; }
.theme-icon-light { display: inline-flex; }
.dark .theme-icon-light { display: none; }
.dark .theme-icon-dark { display: inline-flex; }

/* هک Autofill توکن‌محور (جایگزین مقدار هاردکدِ #09090b) */
input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus,
textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus,
select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px var(--autofill-bg) inset !important;
  -webkit-text-fill-color: var(--autofill-text) !important;
  caret-color: var(--autofill-text);
  transition: background-color 5000s ease-in-out 0s;
}
```

### ۲.۵. جدول جایگزینی جامع رنگ‌ها

> این جدول مرجع اصلی تمام تسک‌هاست. هر کلاس قدیمی در کامپوننت‌ها باید با معادل جدید جایگزین شود.
> **⛔️ به‌روزرسانیِ بحرانی (شفافیت):** ستونِ «کلاس جدید» اکنون از **کلاس‌های سمانتیکِ Tailwind** که در `tailwind.config` ثبت شده‌اند استفاده می‌کند (`primary`, `main`, `muted`, `subtle`, `error`, `success`, `on-primary`). این کلاس‌ها مودیفایرِ `/opacity` را به‌درستی پشتیبانی می‌کنند. **هرگز `bg-[var(--color-primary)]/10` ننویس** (نامعتبر در Tailwind v3) — به‌جایش `bg-primary/10`.

| کلاس قدیمی (هاردکد) | کلاس جدید (صحیح) | کاربرد |
|---------------------|-------------------|--------|
| `bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl` | `glass-card rounded-[var(--radius-lg)]` | WidgetContainer و کارت‌ها |
| `bg-gray-800/70 border border-white/5` | `glass-card rounded-[var(--radius-md)]` | StatCard و کارت‌های کوچک |
| `bg-gray-950/80 backdrop-blur-xl` | `backdrop-blur-xl` + `style={{ background: 'var(--bg-app-glass)' }}` | هدر چسبان |
| `bg-gray-950/90 backdrop-blur-xl` | `backdrop-blur-xl` + `style={{ background: 'var(--bg-app-glass)' }}` | هدر صفحات |
| `text-white` | `text-main` | متن اصلی |
| `text-gray-400` / `text-zinc-400` / `text-gray-500` | `text-muted` | متن فرعی |
| `border-white/5` / `border-white/10` / `border-zinc-800` | `border-subtle` | حاشیه‌ها |
| `bg-sky-500` / `bg-sky-600` | `bg-lime` (دکمه‌ی لیمویی با متن مشکی) یا `bg-primary` | دکمه‌ی Primary |
| `text-sky-400` | `text-primary` | متن لیمویی |
| `from-sky-500 to-fuchsia-500` | `bg-lime` (حذف gradient) | دکمه‌ی مرکزی BottomNav |
| `from-indigo-500 to-purple-600` | `bg-primary` | روز فعال تقویم |
| `bg-sky-500 border-sky-400` (checkbox done) | `bg-primary border-primary` | checkbox انجام‌شده |
| `border-sky-500` (hover/focus) | `border-[var(--input-focus-ring)]` (مقدارِ کامل، بدون شفافیت) | focus state |
| `ring-sky-500` / `ring-sky-400/50` | `ring-primary/50` | ring focus |
| `bg-sky-500/10 text-sky-400 border-sky-500/20` | `bg-primary/10 text-primary border-primary/20` | ViewMode فعال / badge |
| `bg-red-500/20 text-red-300` | `bg-error/10 text-error` | badge خطا |
| `bg-green-500/20 text-green-300` | `bg-success/10 text-success` (یا برای تأکید برند: `bg-primary/10 text-primary`) | badge موفقیت |
| `bg-orange-600/20 text-orange-400` | `bg-primary/10 text-primary` | دکمه عادت |
| `bg-gray-950` (ریشه App) | حذف — `bg-nature` div گلوبال در App | پس‌زمینه ریشه |
| `shadow-sky-500/30` | `shadow-[0_0_15px_rgb(var(--color-primary-rgb)/0.3)]` | سایه لیمویی |
| `bg-zinc-950/90 border-white/10` (مودال) | `bg-[var(--bg-card)] border-subtle` | بدنه مودال |

> **قاعده‌ی کلی برای مدلِ کدنویس:**
> - رنگِ سالید با شفافیت → کلاسِ سمانتیک: `bg-primary/10`, `text-error`, `border-primary/30`, `ring-primary/50`.
> - سطحِ گلسِ آماده (rgba از پیش‌پخته) → کلاسِ `.glass-card`/`.glass-panel`/`.tile-*` یا `bg-[var(--bg-card)]` بدون `/opacity`.
> - مقدارِ تک (focus-ring, border-neon, shadow) → `[var(--token)]` یا `rgb(var(--*-rgb)/alpha)` برای شفافیت.
> - **هرگز** `Hex-var + /opacity` (مثل `bg-[var(--color-primary)]/10`) — نامعتبر است.

---

## ۳. معماری فاز L2 — ریدیزاین سایر صفحات (فاز دوم)

### ۳.۱. اصول

- **بدون شکستن ساختار المان‌ها** (مگر موارد خاص و ضروری).
- تمرکز: جایگزینی رنگ‌های هاردکد با توکن‌های CSS Variable، بومی‌سازی چیدمان دسکتاپ، ریسپانسیو کردن.
- تمام صفحات باید خط‌به‌خط با سیستم جدید منطبق شوند.
- **هدر موبایل:** ساختار فعلی حفظ، فقط رنگ/پدینگ/استایل آپدیت شود.
- **BottomNav:** ساختار فعلی حفظ، فقط رنگ/استایل آپدیت شود.

### ۳.۲. هک‌های iOS/Safari که نباید آسیب ببینند

1. `env(safe-area-inset-bottom/top)` در `index.css` و کامپوننت‌ها.
2. `-webkit-overflow-scrolling: touch` برای اسکرول نرم مودال‌ها.
3. `overscroll-behavior: contain/none` برای جلوگیری از scroll chaining.
4. `-webkit-text-size-adjust: 100%` برای جلوگیری از zoom متن.
5. `h-[100dvh]` به جای `h-screen` در `App.tsx`.
6. `-webkit-tap-highlight-color: transparent` (در ماکت وجود دارد، باید به `index.css` اضافه شود).
7. `viewport-fit=cover` در meta tag.
8. کلاس‌های `.pb-safe`, `.pt-safe`, `.pb-bottom-nav`, `.bottom-nav-inset`, `.safe-spacer-bottom`.
9. `maximum-scale=1.0, user-scalable=no` در viewport meta.
10. هک autofill — **با توکن `var(--autofill-bg)`/`var(--autofill-text)` در یک قانونِ واحد** (نه دو بلوک جدا، نه مقدار هاردکد). مقادیر در `:root` (سفید/مشکی) و `.dark` (`#09090b`/سفید) عوض می‌شوند. `transition: background-color 5000s` حفظ شود.

---

## ۴. مسیردهی فایل‌های جدید

> ### ✅ اصلاح: فیچرها حذف/موکول نمی‌شوند — منطقِ view-layer برایشان ساخته می‌شود
> ماکتِ `index.html` طرحِ **نهایی و قطعی** است و شاملِ ProductivityChart (بهره‌وری) و FocusTimer/Pomodoro (تمرکز عمیق) است. معمار حقِ حذفِ صورت‌مسئله را ندارد. هر دو با منطقِ **کاملاً کلاینتیِ خوداتکا** ساخته می‌شوند (بدون درگیر کردن بک‌اند/سرویس/هوک/کانتکست) — این منطقِ view-layer است و قانونِ «دست‌نزدن به State/Logic/Contextِ داده» را نقض نمی‌کند.

| فایل جدید | مسیر | نقش | وضعیت در L2 |
|-----------|------|------|------|
| `Sidebar.tsx` (بازنویسی) | `components/` | نوار کناری دسکتاپ؛ ناوبری via `useData()`؛ **رندرِ گلوبال در `App.tsx`** (نه داخل Dashboard) | **ساخته شود (L2-3)** |
| `ProductivityChart.tsx` | `features/dashboard/components/` | چارت SVG بهره‌وری هفته | **ساخته شود (L2-14)** — Presentational، با `useMemo`ِ خوانشی روی `tasks` از `useData()` (درصد تکمیلِ روزانه). بدون mutation/fetch جدید. **بدون داده‌ی ساختگی.** |
| `FocusTimer.tsx` | `features/dashboard/components/` | پومودوروی تمرکز عمیق | **ساخته شود (L2-15)** — استیتِ محلیِ کلاینت: `timeLeft`/`isRunning`/`selectedTask`/`isDropdownOpen` + یک `useEffect` با `setInterval`. **بدون بک‌اند، بدون سرویس، بدون تغییر `useDataManager`.** |

> **تصمیمِ نهاییِ پروداکت:** `TodaysNotes` و `HabitTracker` در طرحِ جدید لازم نیستند و از درختِ رندرِ Dashboard **حذف** می‌شوند (منطبق با ماکت و بریفِ اولیه). **فایل‌هایشان Delete نمی‌شوند** (احتمال بازگشت در فاز بعد) — فقط import/رندرشان از `Dashboard.tsx` برداشته می‌شود. تسک‌های ری‌استایلِ آن‌ها (L2-12/L2-13) منسوخ‌اند.

> هیچ فایل جدیدی خارج از مسیرهای فوق ساخته نشود. هیچ پکیج npm جدیدی نصب نشود.

---

## ۵. قوانین تطبیق با کامپوننت‌های زنده

1. **هر مودال باید به هندلر زنده متصل بماند.** مثال: دکمه «مشاهده» در StatsOverview → `onOpenWeeklyReport()` → `WeeklyReportModal`.
2. **هر آیتم ناوبری باید به `setPage()` متصل شود.** مثال: «خانه» → `Page.Dashboard`، «کارها» → `Page.Tasks`.
3. **هر checkbox باید به `toggleTaskCompletion()` متصل بماند.**
4. **هر input در QuickCapture باید به `addTask()` / `addNote()` متصل بماند.**
5. **رینگ پیشرفت هدر باید به `todayProgress` و `hasTasksToday` متصل بماند.**
6. **toggle تم (light/dark) باید به مکانیزم `localStorage('hexer-theme')` متصل شود.**
7. **هیچ داده‌ی استاتیک به عنوان hardcode در کامپوننت نماند؛ همه باید به داده‌های زنده از `useData()` متصل شود.**
8. **هیچ کدی از فایل ماکت استاتیک `dashboard_redisign/index.html` کپی نشود. تمام دستورالعمل‌های بصری در `tasks.md` به صورت دقیق کلاس‌به‌کلاس مشخص شده‌اند.**

---

## ۶. رجیستری فایل‌های مرده (Dead Files Registry) — ⚠️ حیاتی

> در حین کالبدشکافی، گراف importها کامل بررسی شد. فایل‌های زیر در پوشه‌ی `components/` وجود دارند ولی **هیچ‌جا import نمی‌شوند** (نسخه‌های قدیمی/تکراری). فایل‌های زنده در `features/` هستند. **مدل کدنویس به‌هیچ‌وجه نباید این فایل‌ها را ویرایش کند** — ویرایش آن‌ها هیچ اثری در اپ ندارد و باعث هدررفت و سردرگمی می‌شود (تله‌ی Duplicate Mounting در سطح فایل).

| فایل مرده (ویرایش نشود) | فایل زنده‌ی معادل (هدفِ واقعی) |
|------------------------|------------------------------|
| `components/Dashboard.tsx` | `features/dashboard/Dashboard.tsx` |
| `components/ChatView.tsx` | `features/chat/ChatView.tsx` |
| `components/NotesView.tsx` | `features/notes/NotesView.tsx` |
| `components/ProjectsView.tsx` | `features/projects/ProjectsView.tsx` |
| `components/TasksView.tsx` | `features/tasks/TasksView.tsx` |
| `components/TaskEditorModal.tsx` | `features/tasks/components/TaskEditorModal.tsx` |
| `components/NoteEditorModal.tsx` | `features/notes/components/NoteEditorModal.tsx` |
| `components/HabitEditorModal.tsx` | `features/habits/components/HabitEditorModal.tsx` |

**استثناء:** `components/Sidebar.tsx` در حال حاضر **خالی (۰ بایت)** است ولی پس از ساخت در L2-3 توسط `Dashboard.tsx` import می‌شود؛ این فایل **زنده** خواهد بود و هدفِ معتبرِ ویرایش است.

**کامپوننت‌های زنده و مشترکِ معتبر در `components/`:** `BottomNav.tsx`, `Modal.tsx`, `icons.tsx`, `NetworkBanner.tsx`, `ui/ToastNotifications.tsx`, `ProfileModal.tsx`, `PaywallModal.tsx`, `Auth.tsx`, `PersianDatePicker.tsx`, `TimePicker.tsx`, `SupportTicketModal.tsx`, `Onboarding.tsx`, `Sidebar.tsx` (بعد از ساخت).

> **قانون پاکسازی (اختیاری، خارج از دامنه‌ی L2):** حذفِ فیزیکیِ فایل‌های مرده امن است (unimported) ولی **در فاز بصری انجام نشود**؛ صرفاً مستند و ممنوع‌الویرایش‌اند تا بلاست‌رِیدیوس صفر بماند.

---

## ۷. سیستم تم (Theme System) — کلاس‌محور، با کمترین منطق

> اپ زنده در حال حاضر **هیچ مکانیزم تمی ندارد** (هاردکد دارک؛ دکمه‌ی «تم دارک» در `ProfileModal` صرفاً `disabled` است). معیار پذیرش #۶ در PROJECT تمِ کارا را الزام می‌کند و `DesignSystem.md` حول لایت/دارک ساخته شده. پیاده‌سازیِ زیر **حداقلی، خوداتکا و خارج از لایه‌ی داده (services/hooks/contexts)** است؛ بنابراین قانونِ «دست‌نزدن به منطق» را نقض نمی‌کند (این منطقِ نمایشی است، نه بیزینسی).

**سه جزء (همه view-layer):**
1. **اسکریپت pre-paint در `index.html` (قبل از React):** کلاس `.dark` را بر اساس `localStorage('hexer-theme')` یا `prefers-color-scheme` روی `<html>` می‌گذارد تا از FOUC جلوگیری شود. (تسک L2-2)
2. **پیکربندی Tailwind:** `tailwind.config = { darkMode: 'class' }` به‌صورت inline بعد از CDN — تا `dark:`های Tailwind با کلاس همگام شوند (نه سیستم‌عامل). (تسک L2-2)
3. **هندلر toggle (فقط کلاس + localStorage):**
```js
const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('hexer-theme', isDark ? 'dark' : 'light');
};
```
**مهم:** برای نمایش/پنهان آیکن خورشید/ماه، **از `querySelectorAll` استفاده نشود** (ضدِ ریکت و شکننده با re-render). نمایشِ آیکن‌ها **CSS-محور** است (کلاس‌های `.theme-icon-light`/`.theme-icon-dark` که در §۲.۴ تعریف شدند، خودکار بر اساس کلاس `.dark` روی `<html>` سوییچ می‌شوند). هندلر فقط کلاس و localStorage را عوض می‌کند — بدون state ریکت، مقاوم در برابر re-render.

**محل toggle:** در نسخه‌ی موبایل داخل `DashboardHeader`؛ در دسکتاپ داخل کارت پروفایلِ `Sidebar`. هر دو همان `toggleTheme` بالا را صدا می‌زنند.

---

## ۸. ایمنی لِی‌اوت دسکتاپ (Desktop Layout Safety) — ضدِ قیچی‌شدنِ محتوا

> ماکت از shellِ «بدون اسکرولِ مقیدشده» با ارتفاع‌های ثابت (`h-[92vh]`, `h-[145px]`, `h-[200px]`, `h-[320px]`, `overflow-hidden`) استفاده می‌کند. برای یک اپِ داده‌محور (تعداد متغیرِ کار/عادت/پروژه) این **محتوا را قیچی و دسترسی‌ناپذیر می‌کند**. قوانین الزامی:

1. **`overflow-hidden` روی هیچ کانتینری که لیست داده‌ی پویا دارد گذاشته نشود.** اگر ستون سرریز کرد، اسکرول داخلی (`overflow-y-auto soft-scroll`) بگذار، نه clip.
2. **ارتفاع پیکسلیِ ثابت روی کارت‌های داده‌محور ممنوع.** از `min-h-[...]` (+ در صورت نیاز `max-h-[...]` با اسکرول داخلی) استفاده شود.
3. **`h-screen` ممنوع؛ `100dvh` مجاز** (آنتی‌پترن #۱۱). کانتینر ریشه‌ی `MainApp` همان `h-[100dvh]` فعلی را نگه دارد.
4. **ساختار دوسطحی:** سایدبارِ گلوبال در `App.tsx` (`flex` + `hidden lg:flex`) + گریدِ داخلیِ داشبورد `grid-cols-1 lg:grid-cols-[1fr_320px]`. ستون‌ها `min-w-0` داشته باشند تا متن طولانی گرید را نشکند.
5. اسکرولِ سراسریِ صفحه در دسکتاپ مجاز است؛ هدفِ «بدون اسکرول» نباید به قیمتِ قیچی‌شدنِ محتوا تمام شود.

---

## ۹. نگاشت توکن‌ها (Token Mapping) — تک منبع حقیقت

> نام‌های کانونیِ پیاده‌سازی (ستون چپ) در `index.css` و همه‌ی کامپوننت‌ها استفاده می‌شوند. ستون راست صرفاً برای ردیابیِ مفهومی با `DesignSystem.md` است (مقادیر یکی‌اند).

| توکن کانونی (پیاده‌سازی) | معادل مفهومی در DesignSystem.md | مقدار (Light / Dark) |
|--------------------------|--------------------------------|----------------------|
| `--bg-base` | `--bg-base` | `#F4F5F7` / `#121212` |
| `--bg-card` | `--bg-surface` | `rgba(255,255,255,0.85)` / `rgba(30,41,59,0.55)` |
| `--text-main` | `--text-primary` | `#111827` / `#F9FAFB` |
| `--text-muted` | `--text-secondary` | `#6B7280` / `#9CA3AF` |
| `--border-subtle` | `--border-subtle` | `#E5E7EB` / `#334155` |
| `--border-neon` | `--border-neon` | `transparent` / `#D8F066` |
| `--color-primary` | `--color-primary` | `#D8F066` (هر دو) |
| `--text-on-primary` | `--text-on-primary` | `#000000` (هر دو، قانون سخت) |
| `--input-focus-ring` | `--input-focus-ring` | `#111827` / `#D8F066` |
| `--shadow-card`/`--shadow-glass` | `--shadow-surface` | سایه‌ی لایت / `none` در دارک |
| `--semantic-success` | `--semantic-success` | `#10B981` / `#22C55E` |
| `--semantic-error` | `--semantic-error` | `#EF4444` / `#FF6B6B` |
| `--autofill-bg` / `--autofill-text` | (جدید) | `#FFFFFF`/`#111827` / `#09090b`/`#FFFFFF` |