# فاز L2 — نقشه‌ی راهِ ریدیزاین بصری (Visual Overhaul)

> **مرجع کامل:** `docs/ARCHITECTURE.md` و `docs/PROJECT.md` فاز L2.
> **هدف:** بازطراحی بصری کامل اپلیکیشن HEXER با تم Soft Cyber-Lime.
> **مدل کدنویس:** Gemini 3.5 Flash — تسک‌ها طوری چیده شده‌اند که ادیت‌های نقطه‌ای روی کلاس‌های Tailwind و JSX انجام شود و به کدهای منطقی دست زده نشود.
> **قانون حیاتی:** هیچ prop، استیت، هندلر یا مودالی حذف یا شکسته نشود. فقط چیدمان و استایل تغییر کند.
> **قانون ممنوعیت کپی:** هیچ کدی از فایل `dashboard_redisign/index.html` کپی نشود. تمام دستورالعمل‌های بصری در این فایل به صورت دقیق «کلاس X را حذف کن، کلاس Y را اضافه کن» مشخص شده‌اند.
> **مرجع جایگزینی رنگ:** جدول جامع در `ARCHITECTURE.md` §۲.۵ و نگاشت توکن در §۹.

> ### ⚠️ هشدارهای حیاتیِ بازنگری (قبل از شروع هر تسک بخوان)
> 1. **فایل‌های مرده:** هرگز فایل‌های مرده‌ی `components/` را ویرایش نکن (`Dashboard`, `ChatView`, `NotesView`, `ProjectsView`, `TasksView`, `TaskEditorModal`, `NoteEditorModal`, `HabitEditorModal`). فایل‌های زنده در `features/` هستند. رجوع به `ARCHITECTURE.md` §۶.
> 2. **پس‌زمینه فقط یک‌بار:** لایه‌ی پس‌زمینه (`div.bg-nature`) فقط در ریشه‌ی `App.tsx` (L2-18) اعمال می‌شود؛ در `Dashboard.tsx` یا هیچ صفحه‌ی دیگری تکرار نشود. تصویر خارجی unsplash حذف شده؛ پایه = `--bg-base`.
> 3. **دارک‌مود + رنگ‌های کانالی:** `tailwind.config` در L2-2 باید شاملِ `darkMode:'class'` **و** مَپِ رنگ‌های کانالی (`rgb(var(--*-rgb)/<alpha-value>)`) باشد؛ بدون آن هم `dark:`ها کار نمی‌کنند و هم مودیفایرِ شفافیت `/10` می‌شکند.
> 4. **شفافیت — ممنوعیتِ Hex-var + /opacity:** هرگز `bg-[var(--color-primary)]/10` ننویس (نامعتبر در Tailwind v3). به‌جایش کلاس‌های سمانتیک: `bg-primary/10`, `text-primary`, `border-primary/30`, `ring-primary/50`, `text-main`, `text-muted`, `border-subtle`, `bg-error/10`, `text-error`.
> 5. **سایدبارِ دسکتاپ گلوبال:** `Sidebar` در `App.tsx` (کنار `<main>`) رندر شود، نه در `Dashboard.tsx` (وگرنه با تعویض صفحه ناپدید و کاربرِ دسکتاپ حبس می‌شود). `BottomNav` فقط موبایل.
> 6. **فیچرهای ماکت ساخته شوند؛ فیچرهای غیرماکت از رندر حذف:** `FocusTimer` و `ProductivityChart` (در ماکت هستند) با منطقِ کلاینتیِ کامل ساخته می‌شوند (L2-14/L2-15). `TodaysNotes` و `HabitTracker` (در ماکت نیستند) فقط از **درختِ رندرِ داشبورد حذف** می‌شوند — **فایل‌هایشان Delete نمی‌شود** (L2-12/L2-13 منسوخ، حذفِ رندر در L2-4).
> 7. **toggle تم:** نمایش آیکن CSS-محور است؛ **هرگز کلاسِ `hidden`ی Tailwind روی آیکن‌های تم نگذار** (display:none که قوانینِ CSS را خنثی می‌کند). هندلر فقط `classList.toggle('dark')` + `localStorage`.

---

## فاز اول: ریدیزاین ساختاری و بصری داشبورد

---

### تسک L2-1: تزریق توکن‌های CSS Variable و کلاس‌های گلس به `index.css`

**عنوان:** اضافه کردن توکن‌های رنگی Soft Cyber-Lime و کلاس‌های گلس‌مورفیسم به استایل سراسری

**راهنمای پیاده‌سازی فنی:**
1. در بلوک `:root` موجود در `index.css`، **دو دسته توکن** را اضافه کن (طبق ARCHITECTURE.md §۲.۳):
   - **(الف) توکن‌های کانالیِ RGB** (فقط اعداد، فاصله‌دار — برای `tailwind.config` و شفافیت): `--color-primary-rgb: 216 240 102`, `--color-primary-hover-rgb: 193 219 60`, `--on-primary-rgb: 0 0 0`, `--text-main-rgb: 17 24 39`, `--text-muted-rgb: 107 114 128`, `--border-subtle-rgb: 229 231 235`, `--success-rgb: 16 185 129`, `--error-rgb: 239 68 68`, `--warning-rgb: 245 158 11`.
   - **(ب) توکن‌های مقدارِ کاملِ Hex/rgba** (برای CSS/SVG/گلس): `--color-primary: #D8F066`, `--color-primary-hover: #C1DB3C`, `--text-on-primary: #000000`, **`--bg-base: #F4F5F7`** (**به‌جای `--bg-image`؛ هیچ URL تصویر خارجی اضافه نشود**), `--bg-app-glass`, `--bg-panel-glass`, `--bg-card`, `--text-main`, `--text-muted`, `--border-subtle`, `--border-neon: transparent`, `--input-focus-ring`, `--nav-active-bg`, `--nav-active-text`, `--nav-hover-bg`, `--ink-bg`, `--ink-text`, `--semantic-error`, `--semantic-error-soft`, `--semantic-success`, `--shadow-glass`, `--shadow-card`, `--shadow-btn`, **`--autofill-bg: #FFFFFF`**, **`--autofill-text: #111827`**, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`.
   > **چرا هر دو؟** اگر `--color-primary` فقط کانال باشد، `.bg-lime { background: var(--color-primary) }` و `stroke="var(--color-primary)"` می‌شکنند. اگر فقط Hex باشد، `bg-primary/10`ی Tailwind نامعتبر می‌شود. پس هر دو لازم‌اند.
2. یک بلوک جدید `.dark` ایجاد کن و override توکن‌های Dark را اضافه کن (طبق §۲.۳): کانالی‌ها (`--text-main-rgb: 249 250 251`, `--text-muted-rgb: 156 163 175`, `--border-subtle-rgb: 51 65 85`, `--success-rgb: 34 197 94`, `--error-rgb: 255 107 107`, `--warning-rgb: 251 191 36`) و مقدار-کامل‌ها (**`--bg-base: #121212`**, `--border-neon: #D8F066`, `--input-focus-ring: #D8F066`, **`--autofill-bg: #09090b`**, **`--autofill-text: #FFFFFF`** و بقیه‌ی glass/shadow طبق §۲.۳). **بدون `--bg-image`.**
3. کلاس‌های `.glass-app`, `.glass-panel`, `.glass-card`, `.tile-ink`, `.tile-lime`, `.nav-active`, `.bg-lime`, `.text-lime`, **`.bg-nature` (با `background: var(--bg-base)` — نه `background-image`)**, `.bg-nature::after` (هاله‌ی گرادیانِ ملایم، طبق §۲.۴)، `.soft-scroll`, `.no-scrollbar`, `.task-check.is-done`, **و کلاس‌های نمایش آیکن تم (`.theme-icon-light`/`.theme-icon-dark` با سوییچ `.dark`)** را اضافه کن (طبق ARCHITECTURE.md §۲.۴).
4. قانون `* { -webkit-tap-highlight-color: transparent; }` را به ابتدای فایل اضافه کن (قبل از `box-sizing`).
5. **بلوک autofill توکن‌محور** را طبق §۲.۴ اضافه/جایگزین کن (این کارِ L2-27 است؛ اگر در همین تسک انجام دادی، L2-27 را رد کن). از `var(--autofill-bg)`/`var(--autofill-text)` استفاده شود.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** هیچ‌یک از متغیرهای `safe-area-inset` یا کلاس‌های `.pt-safe`, `.pb-safe` و... را حذف یا تغییر بدهی.
- **نباید:** هیچ قانون CSS موجود را (به‌جز هک autofillِ قدیمیِ هاردکد که با نسخه‌ی توکن‌محور جایگزین می‌شود) حذف کنی. فقط اضافه/جایگزینیِ هدفمند.
- **نباید:** هیچ `url(...)` خارجی برای پس‌زمینه اضافه کنی (آنتی‌پترن #۱۶).
- **نباید:** از رنگ‌های هاردکد شده استفاده کنی. فقط CSS Variables.
- **باید:** در `.dark` مقدار `--shadow-glass` و `--shadow-card` حتماً `none` باشد.
- **باید:** `--text-on-primary` در هر دو مود حتماً `#000000` باشد.
- **باید:** توکن‌های `*-rgb` حتماً به فرمتِ **کانالِ خام و فاصله‌دار** باشند (`216 240 102`)، **نه** `#D8F066` و **نه** `rgb(...)` — چون در `tailwind.config` داخل `rgb(var(--x) / <alpha-value>)` قرار می‌گیرند.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["index.css"]
```

---

### تسک L2-2: اضافه کردن اسکریپت تشخیص تم به `index.html`

**عنوان:** تزریق اسکریپت early-theme-detection قبل از بارگذاری React

**راهنمای پیاده‌سازی فنی:**
1. **پیکربندی Tailwind (حیاتی — رفع باگ `dark:` و باگ شفافیت):** بلافاصله **بعد از** `<script src="https://cdn.tailwindcss.com"></script>` این بلوک را اضافه کن:
```html
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: { extend: { colors: {
      primary:        'rgb(var(--color-primary-rgb) / <alpha-value>)',
      'primary-hover':'rgb(var(--color-primary-hover-rgb) / <alpha-value>)',
      'on-primary':   'rgb(var(--on-primary-rgb) / <alpha-value>)',
      main:           'rgb(var(--text-main-rgb) / <alpha-value>)',
      muted:          'rgb(var(--text-muted-rgb) / <alpha-value>)',
      subtle:         'rgb(var(--border-subtle-rgb) / <alpha-value>)',
      success:        'rgb(var(--success-rgb) / <alpha-value>)',
      error:          'rgb(var(--error-rgb) / <alpha-value>)',
      warning:        'rgb(var(--warning-rgb) / <alpha-value>)',
    } } }
  };
</script>
```
بدون `darkMode:'class'`، `dark:`ها به سیستم‌عامل گوش می‌دهند (تمِ split-brain). بدون مَپِ رنگ‌های کانالی، کلاس‌هایی مثل `bg-primary/10` کار نمی‌کنند و Badgeها ناپدید می‌شوند. رجوع به `ARCHITECTURE.md` §۲.۳/§۲.۴.
2. **اسکریپت pre-paint:** بعد از `<link rel="stylesheet" href="/index.css">` و قبل از `<script type="importmap">`، این بلوک را اضافه کن (فقط کلاس `.dark`؛ `data-theme` لازم نیست — برای کاهش سطح حذف شد):
```html
<script>
  (function () {
    var t = localStorage.getItem('hexer-theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```
3. `<meta name="theme-color">` را از `#09090b` به `#F4F5F7` تغییر بده (لایت‌مود پایه).
4. در `<style>` موجود، `body { font-family: 'Vazirmatn', sans-serif; }` را حفظ کن و `background-color: var(--bg-base);` را اضافه کن (پایه‌ی توکن‌محور — نه transparent، تا حتی قبل از mount ریکت پس‌زمینه دیده شود و باگ «پس‌زمینه‌ی نامرئی» رخ ندهد).

**محدودیت‌های اختصاصی تسک:**
- **نباید:** meta tag viewport را تغییر بدهی (`viewport-fit=cover, maximum-scale=1.0, user-scalable=no` باید بماند).
- **نباید:** importmap را تغییر بدهی.
- **نباید:** `<script src="https://cdn.tailwindcss.com">` را حذف کنی.
- **باید:** `tailwind.config = { darkMode: 'class' }` حتماً بعد از CDN و قبل از رندر باشد.
- **باید:** اسکریپت pre-paint قبل از بارگذاری React اجرا شود تا از فلش تم جلوگیری شود (FOUC prevention).

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["index.html"]
```

---

### تسک L2-3: ساخت نوار کناری دسکتاپ (`Sidebar.tsx`)

**عنوان:** ساخت کامپوننت نوار کناری دسکتاپ با ناوبری و کارت پروفایل

**راهنمای پیاده‌سازی فنی:**
1. فایل `components/Sidebar.tsx` فعلی خالی است (۰ بایت). کامپوننت جدیدی بساز.
2. **ناوبری via props (هم‌الگوی `BottomNav`):** `Sidebar` همان قراردادِ `BottomNav` را می‌گیرد — `currentPage: Page` و `setPage: (p: Page) => void` به‌عنوان **prop از `App.tsx`** (که این مقادیر را از `useData()` دارد). **`Sidebar` خودش `useData()` را برای ناوبری صدا نزند** (سازگار با BottomNav و بدون توهمِ منبعِ دوگانه). propها: `currentPage`, `setPage`, `onOpenProfile: () => void`, `className?: string`.
   > **⛔️ تغییر معماری حیاتی:** این کامپوننت **گلوبال در `App.tsx`** رندر می‌شود (کنار `<main>`)، نه در `Dashboard.tsx`. چون App والدِ مستقیمِ Sidebar است، پاس‌دادنِ `currentPage`/`setPage`/`onOpenProfile` از App **یک‌سطحی و تمیز** است (نه prop drilling). رجوع به L2-18 و ARCHITECTURE §۲.۲.
3. **پروفایل کاربر:** `user` را از `useAuth()` و `profile` را از `useData()` استخراج کن.
4. ساختار JSX:
   - کانتینر: `<aside className={`w-[240px] flex flex-col h-full shrink-0 overflow-hidden ${className || ''}`}>` — **توجه:** کلاس `hidden lg:flex` توسط **والد در `App.tsx`** از طریق prop `className` پاس داده می‌شود، نه داخل خود `Sidebar`.
   - لوگو: `<div className="w-10 h-10 rounded-[var(--radius-md)] tile-ink flex items-center justify-center font-black text-xl">H</div>` + `<span className="font-black text-2xl tracking-tight text-[var(--text-main)]">HEXER</span>`
   - ناوبری (`<nav className="flex-1 space-y-1 px-2">`): ۴ دکمه — خانه (`Page.Dashboard`)، کارها (`Page.Tasks`)، یادداشت‌ها (`Page.Notes`)، پروژه‌ها (`Page.Projects`).
   - آیتم فعال: `className="nav-active flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]"` — با `currentPage === Page.Dashboard` مقایسه شود و `onClick={() => setPage(Page.Dashboard)}` متصل شود.
   - آیتم غیرفعال: `className="flex items-center gap-3 px-4 py-3 text-[var(--text-muted)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text-main)] rounded-[var(--radius-md)] font-medium transition"`
   - کارت پروفایل (`<div className="mt-auto px-2 pb-2">`): `<div className="glass-card p-3.5 rounded-[var(--radius-md)] flex items-center justify-between">`
   - آواتار: `<div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center font-bold text-sm" style={{ color: 'var(--text-on-primary)' }}>{avatarLetter}</div>`
   - نام: `<div className="text-sm font-semibold text-[var(--text-main)]">{firstName}</div>`
   - دکمه toggle تم: `<button onClick={toggleTheme} className="w-8 h-8 rounded-full hover:bg-[var(--nav-hover-bg)] text-muted flex items-center justify-center transition">` با دو SVG (خورشید/ماه) — آیکن روشن کلاس `theme-icon-light` و آیکن ماه کلاس `theme-icon-dark`. **⛔️ هرگز کلاس `hidden`ی Tailwind روی این آیکن‌ها نگذار** (display:none که CSSِ سوییچ را خنثی می‌کند). فقط همان کلاس‌های `theme-icon-*` کافی است؛ مدیریتِ نمایش کاملاً با CSSِ L2-1 است.
5. آیکن‌ها: از `components/icons.tsx` import کن (`HomeIcon`, `ListChecksIcon`, `NotebookIcon`, `BriefcaseIcon`).
6. toggle تم: تابع `toggleTheme` که **فقط** این کار را می‌کند:
```js
const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('hexer-theme', isDark ? 'dark' : 'light');
};
```
   - **نمایش/پنهان آیکن خورشید/ماه CSS-محور است** (کلاس‌های `theme-icon-light`/`theme-icon-dark` که در L2-1 تعریف شدند). **از `document.querySelectorAll` برای toggle آیکن استفاده نکن** (ضدِ ریکت و شکننده با re-render). هر دو SVG را با کلاس مناسب رندر کن؛ CSS بقیه را مدیریت می‌کند.
   - **هیچ `useState` برای تم اضافه نکن** — این منطقِ نمایشی است و خارج از state ریکت می‌ماند (رجوع به `ARCHITECTURE.md` §۷).
7. import از `../types` برای `Page`، `../contexts/AuthContext` برای `useAuth` (جهت `user`)، و `../contexts/DataContext` برای `useData` (فقط جهت `profile`). برای ناوبری از props استفاده کن، نه useData.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** از رنگ‌های sky/indigo/purple استفاده کنی.
- **نباید:** ساختار `BottomNav.tsx` را دست بزنی.
- **باید:** `currentPage`, `setPage`, `onOpenProfile`, `className` به‌عنوان prop از `App.tsx` دریافت شوند (هم‌الگوی `BottomNav`).
- **نباید:** برای ناوبری `useData()` را صدا بزنی — `currentPage`/`setPage` از props می‌آیند. (`useData()` فقط برای `profile` و `useAuth()` برای `user` مجاز است.)
- **نباید:** کلاس `hidden`ی Tailwind روی آیکن‌های `theme-icon-*` بگذاری.
- **نباید:** `Sidebar` را داخل `Dashboard.tsx` رندر کنی — رندرِ آن گلوبال و در `App.tsx` است (L2-18).
- **باید:** آیتم فعال با `currentPage === Page.Dashboard` (و سایر صفحات) مقایسه و `onClick={() => setPage(Page.X)}` متصل شود.
- **باید:** آواتار از حرف اول `profile?.full_name || user?.user_metadata?.full_name` ساخته شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["components/Sidebar.tsx", "components/BottomNav.tsx", "types.ts", "contexts/AuthContext.tsx", "contexts/DataContext.tsx"]
```

---

### تسک L2-4: بازطراحی `Dashboard.tsx` — گرید دوستونه‌ی دسکتاپ + موبایل تک‌ستونه

**عنوان:** بازنویسی چیدمان Dashboard به گرید دوستونه (سایدبار از App می‌آید) با رندرِ همه‌ی ویجت‌ها

**راهنمای پیاده‌سازی فنی:**
1. در `Dashboard.tsx`، ساختار JSX را به یک **گرید واحد responsive** تغییر بده. **سایدبار اینجا نیست** (گلوبال در App.tsx). الگوی دقیق:

```jsx
return (
  <div className="pb-2">
    {/* ⚠️ هیچ <div className="bg-nature" /> اینجا نیست — پس‌زمینه فقط در App.tsx (L2-18). */}

    {/* هدر موبایل — فقط موبایل. پروفایل از طریق CustomEvent باز می‌شود (ProfileModal گلوبال در App است) */}
    <div className="lg:hidden">
      <DashboardHeader
        onOpenProfile={() => window.dispatchEvent(new CustomEvent('hexer:open-profile'))}
        todayProgress={selectedDayProgressStats.progress}
        hasTasksToday={selectedDayProgressStats.hasTasks}
      />
    </div>

    <div className="px-4 sm:px-6 max-w-[1280px] mx-auto pt-5 space-y-6">
      {/* گریدِ داشبورد: موبایل ۱ ستون، دسکتاپ ۲ ستون (سایدبار از App می‌آید، نه اینجا) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-6">

        {/* ستون مرکز فرمان */}
        <div className="space-y-6 min-w-0">
          <QuickCapture />
          <ProductivityChart />     {/* L2-14: Presentational با useMemo روی tasks */}
          <TodaysPlan />
          {/* TodaysNotes طبق قانون پروداکت از رندر حذف شد (فایلش می‌ماند) */}
        </div>

        {/* ستون بافتار داده */}
        <div className="space-y-6 min-w-0">
          <StatsOverview onOpenWeeklyReport={() => setIsReportOpen(true)} />
          <WeekCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
          <KeyProjects />
          {/* HabitTracker طبق قانون پروداکت از رندر حذف شد (فایلش می‌ماند) */}
          <FocusTimer />            {/* L2-15: پومودوروی کلاینت با state محلی + setInterval */}
        </div>
      </div>
    </div>

    {/* WeeklyReportModal اینجا می‌ماند (مخصوص داشبورد). ProfileModal به App منتقل شد. */}
    <WeeklyReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
  </div>
);
```

> **✅ تصمیمِ نهاییِ پروداکت (تناقض حل شد):** `TodaysNotes` و `HabitTracker` در طرحِ جدید **لازم نیستند** و از درختِ رندرِ `Dashboard.tsx` حذف می‌شوند. **فایل‌هایشان Delete نمی‌شوند** (احتمال بازگشت در فازهای بعد) — فقط import/رندرشان از داشبورد برداشته می‌شود. این با ماکتِ `index.html` و بریفِ اولیه منطبق است.

2. **استیتِ `isProfileOpen` از Dashboard حذف و به `App.tsx` منتقل می‌شود** (L2-18)؛ `ProfileModal` نیز به App منتقل می‌شود. `isReportOpen` و `selectedDayProgressStats` و `WeeklyReportModal` دست‌نخورده در Dashboard می‌مانند.
3. **قانون حیاتی — ممنوعیت Duplicate Mounting:** هر کامپوننت دقیقاً یک بار نوشته شود؛ ساختِ دو کانتینرِ مجزای موبایل/دسکتاپ ممنوع. چیدمان فقط با `grid-cols-1 lg:grid-cols-[1fr_320px]` و wrapperِ `lg:hidden` روی هدر کنترل شود.
4. importها: `ProductivityChart` و `FocusTimer` اضافه شوند. **import و رندرِ `TodaysNotes` و `HabitTracker` از `Dashboard.tsx` حذف شوند** (فایل‌ها نگه داشته می‌شوند). `Sidebar` و `ProfileModal` نیز از Dashboard حذف شوند (به App منتقل شده‌اند — L2-18).
5. در نسخه‌ی موبایل، دکمه‌ی پروفایلِ هدر به‌جای `setIsProfileOpen` از `window.dispatchEvent(new CustomEvent('hexer:open-profile'))` استفاده می‌کند (چون state پروفایل اکنون در App است).

**محدودیت‌های اختصاصی تسک:**
- **حیاتی:** هیچ کامپوننتی دو بار Mount نشود (یک درخت JSX واحد).
- **نباید:** هیچ state/هندلر/مودالِ زنده‌ای حذف یا شکسته شود. (استثناهای مجاز و صریح: انتقالِ `isProfileOpen`+`ProfileModal` به App؛ و حذفِ **رندرِ** `TodaysNotes`/`HabitTracker` از داشبورد طبق قانون پروداکت — فایل‌هایشان و هیچ منطقِ دیگری حذف نمی‌شود.)
- **نباید:** `Sidebar` را اینجا رندر کنی — گلوبال در App است.
- **نباید:** از `h-screen` یا `overflow-hidden` روی ستون‌های دارای لیست پویا استفاده کنی (آنتی‌پترن #۲۱).
- **باید:** `DashboardHeader` فقط در `lg:hidden`.
- **باید:** ستون‌ها `min-w-0` داشته باشند.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/Dashboard.tsx", "App.tsx", "features/dashboard/components/DashboardHeader.tsx", "features/dashboard/components/StatsOverview.tsx", "features/dashboard/components/WeekCalendar.tsx", "features/dashboard/components/TodaysPlan.tsx", "features/dashboard/components/QuickCapture.tsx", "features/dashboard/components/KeyProjects.tsx", "features/dashboard/components/ProductivityChart.tsx", "features/dashboard/components/FocusTimer.tsx", "features/dashboard/components/WeeklyReportModal.tsx", "contexts/DataContext.tsx", "types.ts"]
```

---


### تسک L2-5: بازطراحی `DashboardHeader.tsx` — فقط استایل (قانون طلایی)

**عنوان:** آپدیت رنگ‌های هدر موبایل بدون تغییر ساختار

**راهنمای پیاده‌سازی فنی:**
1. در `DashboardHeader.tsx` فعلی، فقط کلاس‌های Tailwind را تغییر بده:
   - `<header>`: حذف `bg-gray-950/80` → اضافه کن `style={{ background: 'var(--bg-app-glass)' }}`. حذف `border-white/10` → `border-[var(--border-subtle)]`. `backdrop-blur-xl` و `pt-safe` باقی بمانند.
   - متن «سلام {firstName}»: حذف `text-white` → `text-[var(--text-main)]`.
   - متن پیشرفت: حذف `text-gray-400` → `text-[var(--text-muted)]`.
   - برند «HEXER»: حذف `text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-fuchsia-500` → `text-[var(--text-main)]`.
   - آواتار: حذف `bg-gray-900` → `bg-[var(--text-main)]`. حذف `text-white` → `text-[var(--bg-app-glass)]`. حذف `border-gray-800` → `border-[var(--border-subtle)]`.
   - رینگ SVG: حذف `stroke="url(#neonGradient)"` → `stroke="var(--color-primary)"`. حذف `<defs>` و `<linearGradient>`. حذف `filter: drop-shadow(0 0 4px rgba(168,85,247,0.6))` → `filter: drop-shadow(0 0 4px rgba(216,240,102,0.4))`.
   - track circle: حذف `stroke="rgba(255,255,255,0.1)"` → `stroke="var(--border-subtle)"`.
   - وقتی `isComplete`: `drop-shadow(0 0 4px rgba(34,197,94,0.6))` → `drop-shadow(0 0 4px rgba(16,185,129,0.4))` (باقی بماند ولی با توکن success).

**محدودیت‌های اختصاصی تسک:**
- **حیاتی:** ساختار JSX کاملاً حفظ شود. هیچ المانی حذف یا اضافه نشود. فقط کلاس‌های Tailwind و style inline تغییر کنند.
- **نباید:** props (`onOpenProfile`, `todayProgress`, `hasTasksToday`) را تغییر بدهی.
- **نباید:** منطق محاسبه `offset`, `circumference`, `isComplete` را دست بزنی.
- **نباید:** `pt-safe` کلاس را حذف کنی.
- **باید:** رنگ رینگ از `purple/blue gradient` به `var(--color-primary)` تغییر کند.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/DashboardHeader.tsx"]
```

---

### تسک L2-6: بازطراحی `WidgetContainer.tsx` — پایه‌ی همه‌ی کارت‌ها

**عنوان:** جایگزینی کلاس‌های هاردکد WidgetContainer با توکن‌های گلس

**راهنمای پیاده‌سازی فنی:**
1. در `WidgetContainer.tsx` فعلی، کلاس زیر را:
   `bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/30 transition-all duration-300`
   با این جایگزین کن:
   `glass-card rounded-[var(--radius-lg)] p-4 sm:p-5`
2. `${className || ''}` باید باقی بماند.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** props (`children`, `className`, `id`) را تغییر بدهی.
- **باید:** `className` prop همچنان قابل override باشد.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/WidgetContainer.tsx"]
```

---

### تسک L2-7: بازطراحی `QuickCapture.tsx` — فرم کپسولی

**عنوان:** جایگزینی رنگ‌های QuickCapture با توکن‌های جدید

**راهنمای پیاده‌سازی فنی:**
1. در `QuickCapture.tsx` فعلی:
   - `<h2>`: حذف `text-white` → `text-[var(--text-main)]`.
   - `<textarea>`: حذف `bg-gray-800/70` → `bg-[var(--bg-card)]`. حذف `text-white` → `text-[var(--text-main)]`. حذف `placeholder-gray-500` → `placeholder-[var(--text-muted)]`. حذف `focus:ring-purple-500` → `focus:ring-[var(--color-primary)]`. حذف `border-white/5` → `border-[var(--border-subtle)]`. حذف `focus:border-purple-500` → `focus:border-[var(--input-focus-ring)]`.
   - دکمه «ثبت کار»: حذف `bg-sky-600/80` → `bg-lime`. حذف `text-white` → `text-[var(--text-on-primary)]`. حذف `hover:bg-sky-600` → `hover:bg-[var(--color-primary-hover)]`. حذف `disabled:bg-gray-600` → `disabled:opacity-40`.
   - دکمه «ثبت یادداشت»: حذف `bg-purple-600/80` → `glass-card text-[var(--text-main)] border-[var(--border-subtle)]`. حذف `text-white` → `text-[var(--text-main)]`. حذف `hover:bg-purple-600` → `hover:bg-[var(--nav-hover-bg)]`. حذف `disabled:bg-gray-600` → `disabled:opacity-40`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** منطق `handleAction` را تغییر بدهی.
- **نباید:** `addTask`, `addNote`, `selectedDate` را تغییر بدهی.
- **نباید:** placeholder متن را تغییر بدهی.
- **باید:** دکمه «ثبت کار» Primary (لیمویی) و دکمه «ثبت یادداشت» Secondary (گلس) باشد.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/QuickCapture.tsx", "features/dashboard/components/WidgetContainer.tsx"]
```

---

### تسک L2-8: بازطراحی `StatsOverview.tsx` — Dual-Brief Box با رینگ

**عنوان:** بازطراحی StatsOverview به باکس وضعیت هفته (رینگ) + باکس لیمویی «در یک نگاه»

**راهنمای پیاده‌سازی فنی:**
1. در `StatsOverview.tsx` فعلی، ساختار JSX را به دو باکس کنار هم تغییر بده:
   - کانتینر: `<div className="flex gap-3">`
   - **باکس ۱ (وضعیت هفته):** `<div className="w-[110px] shrink-0 rounded-[var(--radius-lg)] p-3 flex flex-col items-center justify-between tile-ink">`
     - عنوان: `<h4 className="text-[11px] font-bold text-center">وضعیت هفته</h4>`
     - رینگ SVG: `<svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">` با track `stroke="var(--border-subtle)"` و progress `stroke="var(--color-primary)"`. `stroke-dasharray="219.9"` و `stroke-dashoffset` را از `selectedDayProgressStats.progress` محاسبه کن (در Dashboard.tsx موجود است — باید به StatsOverview پاس داده شود یا از useData استفاده شود).
     - درصد در مرکز: `<div className="absolute inset-0 flex items-center justify-center text-[13px] font-black">{progress}%</div>`
     - دکمه «مشاهده»: `<button onClick={onOpenWeeklyReport} className="bg-lime text-[var(--text-on-primary)] text-[10px] font-bold py-1.5 rounded-full">مشاهده</button>`
   - **باکس ۲ (در یک نگاه):** `<div className="tile-lime flex-1 rounded-[var(--radius-lg)] p-3 flex flex-col justify-between">`
     - عنوان: `<h3 className="font-black text-[13px] text-[var(--text-on-primary)]">کارهای امروز در یک نگاه</h3>`
     - آمار: سه ردیف با کپسول‌های `bg-[#16161A] text-white rounded-full h-[24px]`:
       - ردیف ۱: `تعداد: {stats.completedToday}/{total}` + نوار `border-dashed border-black/40`
       - ردیف ۲: `مهم: {stats.highPriorityProjects}/{projects.length}` + نوار
       - ردیف ۳: `عقب‌افتاده: {stats.overdue}` + آیکن چشم
     - Legend: دو آیتم با `border-dashed border-black` و `bg-black`.
2. `stats` useMemo باید دست‌نخورده بماند.
3. `onOpenWeeklyReport` باید روی دکمه «مشاهده» متصل بماند.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** prop `onOpenWeeklyReport` را حذف کنی.
- **نباید:** منطق محاسبه `stats` را تغییر بدهی.
- **باید:** دکمه «مشاهده» حتماً `onClick={onOpenWeeklyReport}` داشته باشد.
- **باید:** در باکس لیمویی، متن‌ها با `text-[var(--text-on-primary)]` (مشکی) باشند.
- **باید:** کپسول‌های آمار با `bg-[#16161A] text-white` باشند.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/StatsOverview.tsx", "features/dashboard/components/WidgetContainer.tsx", "types.ts"]
```

---

### تسک L2-9: بازطراحی `WeekCalendar.tsx` — کپسول‌های لیمویی

**عنوان:** جایگزینی رنگ‌های WeekCalendar با توکن‌های جدید

**راهنمای پیاده‌سازی فنی:**
1. در `WeekCalendar.tsx` فعلی:
   - کانتینر هدر: حذف `bg-gray-800/40` → `bg-[var(--bg-card)]`. حذف `text-gray-400` → `text-[var(--text-muted)]`. حذف `border-white/5` → `border-[var(--border-subtle)]`.
   - روز فعال: حذف `bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30 scale-105 z-10` → `bg-[var(--color-primary)] border-transparent shadow-[0_4px_10px_rgba(0,0,0,0.1)] scale-105 z-10`.
   - روز غیرفعال: حذف `bg-gray-800/40 border border-white/5 hover:bg-gray-800` → `bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5`.
   - نام روز فعال: حذف `text-white/90` → `text-black` (روی لیمویی).
   - نام روز غیرفعال: حذف `text-gray-500 group-hover:text-gray-400` → `text-[var(--text-muted)] group-hover:text-[var(--text-main)]`.
   - شماره روز فعال: حذف `text-white` → `text-black`.
   - شماره روز غیرفعال: حذف `text-gray-300` → `text-[var(--text-main)] opacity-70 group-hover:opacity-100`.
   - کانتینر داخلی روز فعال: حذف `bg-black/10 backdrop-blur-sm` → `bg-black/10` (باقی بماند).
   - کانتینر داخلی روز غیرفعال: حذف `bg-gray-900/30` → `bg-transparent`.
   - نقطه امروز: حذف `bg-sky-500` → `bg-[var(--color-primary)]`. در روز فعال: `bg-black` (باقی بماند).

**محدودیت‌های اختصاصی تسک:**
- **نباید:** props (`selectedDate`, `onDateChange`) را تغییر بدهی.
- **نباید:** منطق `useMemo` برای `weekDays` و `headerInfo` را تغییر بدهی.
- **نباید:** import `toJalaali`, `persianMonths`, `isSameTehranDay` را حذف کنی.
- **باید:** رنگ روز فعال از `indigo/purple gradient` به `var(--color-primary)` تغییر کند.
- **باید:** متن روی روز فعال مشکی باشد.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/WeekCalendar.tsx"]
```

---

### تسک L2-10: بازطراحی `TodaysPlan.tsx` — تایم‌لاین عمودی

**عنوان:** بازطراحی TodaysPlan به تایم‌لاین با محور زمان و کارت‌های گلس

**راهنمای پیاده‌سازی فنی:**
1. در `TodaysPlan.tsx` فعلی، چیدمان `todaysTasks.map` را به تایم‌لاین تغییر بده:
   - هر ردیف: `<div className="relative flex gap-3 items-stretch pb-3">`
   - ستون زمان (راست): `<div className="w-12 flex items-start justify-end pt-3 shrink-0"><span className="font-mono font-bold text-xs text-[var(--text-muted)]">{task.due_date ? formatTime(task.due_date) : '—'}</span></div>` — **توجه:** اگر `due_date` زمان دارد، ساعت را نمایش بده؛ در غیر این صورت `—`.
   - ستون محور (وسط): `<div className="relative flex flex-col items-center w-6 shrink-0"><div className="absolute top-3 bottom-0 w-[1.5px] bg-[var(--border-subtle)]"></div><div className="absolute top-3 z-10 w-4 h-4 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center border-2 border-[var(--border-subtle)]"><div className="w-1.5 h-1.5 rounded-full bg-black"></div></div></div>`
   - ستون کارت (چپ): `<div className="flex-1 glass-card p-3 rounded-[var(--radius-md)] flex items-center gap-3">`
   - checkbox: `<button onClick={() => toggleTaskCompletion(task.id)} className="task-check w-5 h-5 shrink-0 rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--text-main)] transition">`
   - تسک انجام‌شده: checkbox با کلاس `is-done` + کارت با `opacity-60` + متن با `line-through text-[var(--text-muted)]`.
   - نقطه انجام‌شده: `bg-[var(--semantic-success)] text-white` با آیکن تیک.
2. `<h2>`: حذف `text-white` → `text-[var(--text-main)]`.
3. empty state: حذف `text-gray-500` → `text-[var(--text-muted)]`. حذف `text-gray-600` → `text-[var(--text-muted)] opacity-60`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** `toggleTaskCompletion` یا `useData()` را تغییر بدهی.
- **نباید:** منطق `useMemo` برای `todaysTasks` را تغییر بدهی.
- **باید:** خط محور با `bg-[var(--border-subtle)]` و عرض `1.5px` باشد.
- **باید:** نقطه تسک انجام‌شده با `bg-[var(--semantic-success)]` و آیکن تیک سفید باشد.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/TodaysPlan.tsx", "features/dashboard/components/WidgetContainer.tsx"]
```

---

### تسک L2-11: بازطراحی `KeyProjects.tsx` — تایل لیمویی با progress bar

**عنوان:** بازطراحی KeyProjects به تایل لیمویی با نوار پیشرفت

**راهنمای پیاده‌سازی فنی:**
1. در `KeyProjects.tsx` فعلی:
   - کانتینر: به جای `<WidgetContainer>`، از `<div className="tile-lime p-4 rounded-[var(--radius-lg)]">` استفاده کن.
   - `<h2>`: حذف `text-white` → `text-[var(--text-on-primary)]`. متن: «وضعیت پروژه‌ها».
   - دکمه «همه ↗»: `<button className="text-[10px] font-bold text-[var(--text-on-primary)] bg-black/10 px-3 py-1 rounded-full hover:bg-black/20 transition">همه ↗</button>`
   - هر پروژه: نام + درصد با `text-[var(--text-on-primary)]`.
   - progress bar: `<div className="h-1.5 rounded-full bg-black/10 overflow-hidden"><div className="h-full bg-[var(--text-on-primary)] rounded-full" style={{ width: `${p.progress}%` }}></div></div>`
   - حذف `getColorClass()` — دیگر نیازی نیست. رنگ progress bar با `var(--text-on-primary)` (مشکی) ثابت است.
2. `highPriorityProjects` و محاسبه `progress` باید دست‌نخورده بمانند.
3. اگر `highPriorityProjects.length === 0` باشد، `null` برگردد (همانند قبل).

**محدودیت‌های اختصاصی تسک:**
- **نباید:** منطق `useMemo` برای `highPriorityProjects` را تغییر بدهی.
- **باید:** تمام متن‌ها روی تایل لیمویی با `text-[var(--text-on-primary)]` (مشکی) باشند.
- **باید:** progress bar fill با `bg-[var(--text-on-primary)]` (مشکی) باشد.
- **باید:** تابع `getColorClass` حذف شود (دیگر استفاده نمی‌شود).

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/KeyProjects.tsx", "features/dashboard/components/WidgetContainer.tsx", "types.ts"]
```

---

### ~~تسک L2-12: بازطراحی `HabitTracker.tsx`~~ — ⏸️ از L2 خارج شد (فایل می‌ماند)

> طبق قانونِ نهاییِ پروداکت، `HabitTracker` از درختِ رندرِ داشبورد **حذف** شده است (و در ماکت هم نیست). پس ری‌استایلِ آن در L2 بی‌اثر است و انجام نمی‌شود. **فایل `HabitTracker.tsx` حذف نشود** (احتمال بازگشت در فاز بعد). حذفِ import/رندرِ آن در L2-4 انجام می‌شود. این تسک رد شود.


### ~~تسک L2-13: بازطراحی `TodaysNotes.tsx`~~ — ⏸️ از L2 خارج شد (فایل می‌ماند)

> طبق قانونِ نهاییِ پروداکت، `TodaysNotes` از درختِ رندرِ داشبورد **حذف** شده است (منطبق با ماکت و بریفِ اولیه). ری‌استایل نمی‌شود. **فایل `TodaysNotes.tsx` حذف نشود.** حذفِ import/رندرِ آن در L2-4 انجام می‌شود. این تسک رد شود.


### تسک L2-14: ساخت `ProductivityChart.tsx` — چارت SVG بهره‌وری

**عنوان:** ساخت کامپوننت چارت بهره‌وری هفته با SVG

> **✅ ساخته می‌شود (بازنگری).** این کامپوننت در ماکتِ نهایی هست و باید ساخته شود — اما **کاملاً Presentational و تغذیه‌شده از دادهٔ واقعیِ `tasks`** (با `useMemo`). **نمایش دادهٔ ساختگی/هاردکد (`[60,80,...]`) ممنوع است** (آنتی‌پترن #۷). بدون state/mutation/fetch جدید؛ صرفاً مشتقِ خوانشی از دادهٔ زنده. داخلِ `tile-ink` (تایل تیره)، رنگ‌های سفیدِ نیمه‌شفافِ نمودار در هر دو مود درست‌اند.

**راهنمای پیاده‌سازی فنی:**
1. فایل جدید `features/dashboard/components/ProductivityChart.tsx` بساز.
2. **داده از `useData()` (خوانشی، بدون mutation):** آرایه‌ی ۷روزه را با یک `useMemo`ِ خالص از `tasks` موجود محاسبه کن (مثلاً درصد تکمیلِ کارهای هر روزِ هفته‌ی جاری از طریق `due_date`/`completed_at` و توابع `utils/dateUtils`). **هیچ state/مقدار هاردکد یا fetch جدید اضافه نشود** — فقط مشتقِ خوانشی از دادهٔ زنده.
3. کانتینر: `<div className="tile-ink rounded-[var(--radius-lg)] p-5 relative overflow-hidden flex gap-4 min-h-[200px]">` (به‌جای `h-[200px]` ثابت — آنتی‌پترن #۲۱).
4. بخش چپ (کپسول درصد): `<div className="w-[38%] bg-white/[0.05] border border-white/10 rounded-[20px] p-3 flex flex-col justify-center gap-3.5 shrink-0 z-10">`
   - ردیف هفته: آیکن فلش پایین + «بهره‌وری» + «هفته جاری» + badge درصد.
   - خط جداکننده: `<div className="border-t border-white/[0.08]"></div>`
   - ردیف ماه: آیکن فلش بالا + «بهره‌وری» + «ماه جاری» + badge درصد.
5. بخش راست (چارت SVG): `<svg viewBox="0 0 280 120" preserveAspectRatio="none" className="w-full h-full overflow-visible">`
   - ۷ ستون (`<rect>`) با `fill="rgba(255,255,255,0.9)"` و `rx="8"`.
   - روز جاری: ستون با `stroke-dasharray="4 3"` و `fill="none"`.
   - مسیر موج: `<path>` با `stroke="url(#waveGrad)"` و gradient از `#38bdf8` به `#D8F066`.
   - برچسب روزها: فر،ار،خر،تی،مر،شه،مه با `fill="rgba(255,255,255,0.4)"`.
6. داده: از `useData()` (خوانشی) گرفته شود و با `useMemo` به آرایه‌ی نرمال‌شده‌ی ۷روزه تبدیل شود. هیچ نوشتن/متد جدیدی صدا زده نشود.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** هیچ پکیج چارت خارجی نصب کنی. فقط SVG دستی.
- **نباید:** داده‌ی استاتیک/ساختگی نمایش بدهی (فقط مشتقِ واقعی از `tasks`).
- **نباید:** ارتفاع پیکسلیِ ثابت بگذاری (از `min-h` استفاده کن).
- **باید:** gradient id یکتا باشد (`waveGrad`).
- **باید:** کامپوننت responsive باشد (در دسکتاپ و موبایل رندر شود).

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["components/icons.tsx", "types.ts", "contexts/DataContext.tsx", "utils/dateUtils.ts", "features/dashboard/components/WidgetContainer.tsx"]
```

---

### تسک L2-15: ساخت `FocusTimer.tsx` — پومودوروی تمرکز عمیق (منطق کلاینتی)

> **✅ ساخته می‌شود (بازنگری).** این ویجت در ماکتِ نهایی هست (خط ۵۷۰+ «تمرکز عمیق»). منطقِ آن **کاملاً کلاینتی و خوداتکا**ست (بدون بک‌اند/سرویس/هوک داده). ساختِ منطقِ view-layer مجاز است و قانونِ «دست‌نزدن به State/Logic/Contextِ داده» را نقض نمی‌کند.

**عنوان:** ساخت کامپوننت Pomodoro با استیت محلی و شمارش معکوس

**راهنمای پیاده‌سازی فنی:**
1. فایل جدید `features/dashboard/components/FocusTimer.tsx` بساز.
2. **استیت محلی (همه local، نه context):**
   ```ts
   const FOCUS_SECONDS = 25 * 60;
   const [timeLeft, setTimeLeft] = useState(FOCUS_SECONDS);
   const [isRunning, setIsRunning] = useState(false);
   const [selectedTask, setSelectedTask] = useState<string>('انتخاب تسک');
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   ```
3. **شمارش معکوس با `useEffect` + `setInterval` (تمیز، با cleanup):**
   ```ts
   useEffect(() => {
     if (!isRunning) return;
     const id = setInterval(() => {
       setTimeLeft(t => {
         if (t <= 1) { clearInterval(id); setIsRunning(false); return FOCUS_SECONDS; }
         return t - 1;
       });
     }, 1000);
     return () => clearInterval(id);   // جلوگیری از نشتِ interval / double-run در StrictMode
   }, [isRunning]);
   ```
   - فرمت نمایش: `const mm = String(Math.floor(timeLeft/60)).padStart(2,'0'); const ss = String(timeLeft%60).padStart(2,'0');` → `{mm}:{ss}` با `font-mono`.
   - دکمه play/pause: `onClick={() => setIsRunning(r => !r)}` (آیکن بین play/pause سوییچ شود).
   - دکمه reset (آیکن settings در ماکت): `onClick={() => { setIsRunning(false); setTimeLeft(FOCUS_SECONDS); }}`.
4. **انتخابِ تسک (dropdown):** لیستِ تسک‌ها می‌تواند از `useData().tasks` (خوانشی، فقط عنوان‌ها برای انتخاب) پر شود یا ساده با چند گزینه. `onClick` هر آیتم → `setSelectedTask(title); setIsDropdownOpen(false)`. **dropdown با React state کنترل شود، نه `classList`/`querySelector`.**
5. **استایل (طبق ماکت، توکن‌محور):** کانتینر `bg-[#16161a] border border-white/10 text-white rounded-[var(--radius-lg)] p-4 relative overflow-hidden min-h-[160px] flex flex-col justify-between dark:border-[var(--border-neon)] dark:shadow-[0_0_20px_rgb(var(--color-primary-rgb)/0.15)]`. دکمه‌های اصلی `bg-lime text-[var(--text-on-primary)]`. (تایلِ تیره در هر دو مود تیره می‌ماند — مطابق ماکت.)

**محدودیت‌های اختصاصی تسک:**
- **نباید:** به `useDataManager`/سرویس/بک‌اند وصل شوی یا چیزی persist کنی (تمرکزِ این فاز فقط تایمرِ کلاینتی است).
- **نباید:** `setInterval` را بدون `clearInterval`/cleanup رها کنی (نشتِ حافظه + باگ StrictMode).
- **نباید:** ارتفاع پیکسلیِ ثابت بگذاری (`min-h-[160px]`).
- **باید:** dropdown با React state، نه دستکاری مستقیم DOM.
- **باید:** در گریدِ Dashboard (L2-4) در ستون داده، زیر `HabitTracker` رندر شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["components/icons.tsx", "types.ts", "contexts/DataContext.tsx", "features/dashboard/components/WidgetContainer.tsx"]
```

---

### تسک L2-16: بازطراحی `BottomNav.tsx` — فقط رنگ‌ها

**عنوان:** آپدیت رنگ‌های BottomNav از sky/purple/fuchsia به Cyber-Lime tokens

**راهنمای پیاده‌سازی فنی:**
1. در `BottomNav.tsx` فعلی:
   - کانتینر نوار: حذف `bg-gray-900/70 backdrop-blur-xl border border-white/10` → `glass-app border border-[var(--border-subtle)]` + `style={{ background: 'var(--bg-app-glass)' }}`.
   - آیتم فعال: حذف `text-sky-400` → `text-[var(--text-main)]`.
   - آیتم غیرفعال: حذف `text-gray-500 hover:text-white` → `text-[var(--text-muted)] hover:text-[var(--text-main)]`.
   - دکمه مرکزی چت: حذف `bg-gradient-to-br from-sky-500 to-fuchsia-500` → `bg-lime`. حذف `text-white` → `text-[var(--text-on-primary)]`. حذف `shadow-sky-500/30` → `shadow-[0_0_15px_rgba(216,240,102,0.3)]`. حذف `ring-gray-950` → `ring-[var(--bg-card)]`.

**محدودیت‌های اختصاصی تسک:**
- **حیاتی:** ساختار JSX کاملاً حفظ شود. هیچ المانی حذف یا اضافه نشود.
- **نباید:** props (`currentPage`, `setPage`) را تغییر بدهی.
- **نباید:** import آیکن‌ها را تغییر بدهی.
- **نباید:** ساختار `NavItem` را تغییر بدهی.
- **باید:** `pb-[max(1.5rem,env(safe-area-inset-bottom))]` حفظ شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["components/BottomNav.tsx", "types.ts"]
```

---

### تسک L2-17: بازطراحی `WeeklyReportModal.tsx` — استایل Cyber-Lime

**عنوان:** آپدیت رنگ‌های مودال گزارش هفتگی به تم جدید

**راهنمای پیاده‌سازی فنی:**
1. در `WeeklyReportModal.tsx` فعلی:
   - backdrop: `bg-black/60` → `bg-black/40 dark:bg-black/70`. `backdrop-blur-md` باقی بماند.
   - بدنه مودال: حذف `bg-zinc-950/90 border-t sm:border border-white/10` → `bg-[var(--bg-card)] border-t sm:border border-[var(--border-subtle)]`.
   - هدر: حذف `border-white/5` → `border-[var(--border-subtle)]`.
   - عنوان: حذف `text-white` → `text-[var(--text-main)]`. آیکن: حذف `text-sky-400` → `text-[var(--color-primary)]`.
   - متن فرعی: حذف `text-zinc-400` → `text-[var(--text-muted)]`.
   - دکمه close: حذف `bg-white/5 text-zinc-400 hover:text-white` → `bg-[var(--nav-hover-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)]`.
   - بلوک آمار: حذف `bg-zinc-900/60 border-white/5` → `glass-card border-[var(--border-subtle)]`.
   - donut chart track: حذف `stroke-zinc-800` → `stroke="var(--border-subtle)"`.
   - donut chart progress: حذف `stroke-sky-400` → `stroke="var(--color-primary)"`.
   - متن درصد: حذف `text-white` → `text-[var(--text-main)]`.
   - امتیاز: حذف `text-white` → `text-[var(--text-main)]`. حذف `text-zinc-500` → `text-[var(--text-muted)]`.
   - badge وضعیت: `text-emerald-400 bg-emerald-500/10` → `text-[var(--semantic-success)] bg-[var(--color-primary)]/10`. `text-sky-400 bg-sky-500/10` → `text-[var(--color-primary)] bg-[var(--color-primary)]/10`. `text-yellow-400 bg-yellow-500/10` → `text-[var(--color-primary)] bg-[var(--color-primary)]/10`. `text-red-400 bg-red-500/10` → `text-[var(--semantic-error)] bg-[var(--semantic-error-soft)]`.
   - کارت‌های آمار: حذف `bg-zinc-900/30 border-white/5` → `glass-card border-[var(--border-subtle)]`.
   - اعداد: حذف `text-white` → `text-[var(--text-main)]`. `text-emerald-400` → `text-[var(--semantic-success)]`. `text-amber-500` → `text-[var(--color-primary)]`.
   - تب‌ها: حذف `bg-zinc-900/80 border-white/5` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`. تب فعال: حذف `bg-zinc-800 text-sky-400` → `bg-lime text-[var(--text-on-primary)]`. تب غیرفعال: حذف `text-zinc-500 hover:text-zinc-300` → `text-[var(--text-muted)] hover:text-[var(--text-main)]`.
   - آیتم‌های تسک: حذف `bg-zinc-900/40 border-white/5` → `glass-card border-[var(--border-subtle)]`. متن: حذف `text-white` → `text-[var(--text-main)]`.
   - badge «عقب‌افتاده»: حذف `bg-rose-500/10 text-rose-400 border-rose-500/20` → `bg-[var(--semantic-error-soft)] text-[var(--semantic-error)] border-[var(--semantic-error)]/20`.
   - badge «در جریان»: حذف `bg-sky-500/10 text-sky-400 border-sky-500/20` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--border-neon)]`.
   - badge «به‌موقع»: حذف `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--border-neon)]`.
   - badge «انجام با تاخیر»: حذف `bg-amber-500/10 text-amber-400 border-amber-500/20` → `bg-[var(--semantic-error-soft)] text-[var(--semantic-error)] border-[var(--semantic-error)]/20`.
   - empty state: حذف `text-zinc-500` → `text-[var(--text-muted)]`. آیکن: حذف `text-zinc-650` → `text-[var(--text-muted)] opacity-40`. `text-emerald-600/40` → `text-[var(--semantic-success)] opacity-40`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** استیت `activeTab` یا منطق `weekBoundaries` را تغییر بدهی.
- **نباید:** props (`isOpen`, `onClose`) را تغییر بدهی.
- **باید:** انیمیشن `motion/react` (AnimatePresence) حفظ شود.
- **باید:** `pb-bottom-nav` spacer در پایین مودال حفظ شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/dashboard/components/WeeklyReportModal.tsx"]
```

---

### تسک L2-18: بازطراحی `App.tsx` — سایدبارِ گلوبال + Shell ریشه + ProfileModal گلوبال

**عنوان:** بازساختاردهیِ لِی‌اوتِ ریشه برای سایدبارِ دائمیِ دسکتاپ، پس‌زمینه‌ی توکن‌محور و انتقال ProfileModal

> ### ⛔️ اصلاحِ بحرانیِ ناوبری دسکتاپ
> `Sidebar` باید **در `App.tsx`** (کنار `<main>`) رندر شود، نه در `Dashboard`؛ وگرنه با تعویض صفحه ناپدید و کاربرِ دسکتاپ حبس می‌شود. این تسک `App.tsx` و `Dashboard.tsx` را برای این ساختار بازنویسی می‌کند.

**راهنمای پیاده‌سازی فنی:**
1. **کانتینر ریشه `App`** (تابع بیرونی): حذف `bg-gray-950 min-h-screen text-white` ← `min-h-screen text-main`. اولین فرزند: `<div className="bg-nature" />` — **تنها محلِ مجازِ لایه‌ی پس‌زمینه در کل اپ** (`.bg-nature` به `--bg-base` نگاشت می‌شود، بدون تصویر خارجی). چون `body` هم در L2-2 رنگ `--bg-base` می‌گیرد، پس‌زمینه حتی قبل از mount ریکت دیده می‌شود (رفع «پس‌زمینه‌ی نامرئی»).
2. **`MainApp` — لِی‌اوتِ flex با سایدبارِ گلوبال:** کانتینرِ `MainApp` از `flex flex-col h-[100dvh]` به این ساختار تغییر کند:
   ```jsx
   const [isProfileOpen, setIsProfileOpen] = useState(false);   // state جدیدِ گلوبالِ پروفایل
   ...
   return (
     <div className="relative flex h-[100dvh]" id="main-app-container">
       <Sidebar currentPage={currentPage} setPage={setCurrentPage} onOpenProfile={() => setIsProfileOpen(true)} className="hidden lg:flex shrink-0" />
       <div className="flex-1 flex flex-col min-w-0">
         <NetworkBanner />
         <main className="flex-1 overflow-y-auto overflow-x-hidden pb-bottom-nav lg:pb-6" id="view-viewport">
           {renderContent()}
         </main>
       </div>
       <ToastNotifications notifications={notifications} onRemove={removeNotification} />
       <div className="lg:hidden"><BottomNav currentPage={currentPage} setPage={setCurrentPage} /></div>

       {/* مودال‌های گلوبال (موجود) + ProfileModalِ منتقل‌شده از Dashboard */}
       <ProfileModal
         isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}
         user={user} signOut={signOut} subscription={subscription} profile={profile} onTriggerUpgrade={onTriggerUpgrade}
       />
       {/* ...بقیه‌ی مودال‌های گلوبالِ فعلی (TaskEditorModal, NoteEditorModal, ...) دست‌نخورده... */}
     </div>
   );
   ```
3. **لیسنرِ رویدادِ بازکردنِ پروفایل از موبایل** (هم‌الگوی `navigate_to_subscription` موجود در App):
   ```jsx
   useEffect(() => {
     const open = () => setIsProfileOpen(true);
     window.addEventListener('hexer:open-profile', open);
     return () => window.removeEventListener('hexer:open-profile', open);
   }, []);
   ```
4. import `Sidebar` از `./components/Sidebar` و `ProfileModal` از `./components/ProfileModal` به `App.tsx` اضافه شود. `currentPage`/`setCurrentPage` (که App از `useData()` دارد) به‌عنوان `currentPage`/`setPage` به Sidebar پاس داده شوند — دقیقاً مثل `BottomNav`. (`ProfileModal` + state `isProfileOpen` از `Dashboard.tsx` حذف می‌شوند — L2-4.)
5. اسپینرها (`LoadingSpinner`/`inner-loader`/`main-loader`): `border-sky-500` ← `border-primary`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** استیتِ داده‌ای (session, loading, editingTask/Note/Habit, showPaywall) یا hookها (`useRealtimeSync`, `useReminderScheduler`, `useData`) را تغییر بدهی. افزودنِ `isProfileOpen` (state نمایشیِ مودال) و لیسنرِ رویداد مجاز است.
- **نباید:** lazy imports یا wrapperهای `AuthProvider`/`DataProvider` را تغییر بدهی.
- **نباید:** `Sidebar` را داخل `Dashboard` بگذاری.
- **باید:** `h-[100dvh]` حفظ شود؛ `Sidebar` با `hidden lg:flex` و `BottomNav` با `lg:hidden`.
- **باید:** `ProfileModal` فقط یک‌بار (گلوبال در App) رندر شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["App.tsx", "components/BottomNav.tsx", "components/Sidebar.tsx", "components/ProfileModal.tsx", "features/dashboard/Dashboard.tsx", "contexts/DataContext.tsx", "contexts/AuthContext.tsx", "types.ts"]
```

## فاز دوم: اعمال توکن‌های رنگی روی سایر صفحات

> در تمام تسک‌های فاز دوم، **فقط کلاس‌های Tailwind رنگی را جایگزین کن**. هیچ منطق (state, useMemo, useEffect, handlers) را تغییر نده. مرجع جایگزینی: ARCHITECTURE.md §۲.۵.

---

### تسک L2-19: ریدیزاین استایل `TasksView.tsx`

**عنوان:** اعمال توکن‌های Cyber-Lime روی صفحه تسک‌ها

**راهنمای پیاده‌سازی فنی:**
1. در `TasksView.tsx` فعلی، تمام کلاس‌های رنگی را جایگزین کن:
   - `CollapsibleSection`: حذف `border-zinc-800/80` → `border-[var(--border-subtle)]`. حذف `text-zinc-500 hover:text-zinc-300` → `text-[var(--text-muted)] hover:text-[var(--text-main)]`.
   - `ViewModeButton` فعال: حذف `bg-sky-500/10 border-sky-500/20 text-sky-400` → `bg-[var(--color-primary)]/10 border-[var(--border-neon)] text-[var(--color-primary)]`.
   - `ViewModeButton` غیرفعال: حذف `text-zinc-500 border-transparent hover:bg-zinc-900 hover:text-zinc-300` → `text-[var(--text-muted)] border-transparent hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text-main)]`.
   - input جستجو: حذف `bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-sky-500` → `bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--input-focus-ring)]`.
   - دکمه Add شناور: حذف `bg-gradient-to-tr from-purple-600 to-fuchsia-600 shadow-purple-500/20` → `bg-lime shadow-[0_0_15px_rgba(216,240,102,0.3)]`. حذف `text-white` → `text-[var(--text-on-primary)]`.
   - empty state: حذف `text-zinc-400` → `text-[var(--text-muted)]`. حذف `text-zinc-650` → `text-[var(--text-muted)] opacity-60`.
   - آیکن‌های view mode: حذف `text-sky-400` → `text-[var(--color-primary)]`.
   - متن‌های گروه: حذف `text-white` → `text-[var(--text-main)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** هیچ منطق (state, useMemo, useEffect, handlers) را تغییر بدهی.
- **نباید:** `CollapsibleSection` component ساختار را تغییر بدهی.
- **باید:** `pb-bottom-nav` کلاس حفظ شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/tasks/TasksView.tsx"]
```

---

### تسک L2-20: ریدیزاین استایل `TaskCard.tsx`

**عنوان:** اعمال توکن‌های Cyber-Lime روی کارت تسک

**راهنمای پیاده‌سازی فنی:**
1. در `TaskCard.tsx` فعلی:
   - checkbox done: حذف `bg-sky-500 border-sky-500 text-white` → `bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--text-on-primary)]`.
   - checkbox not-done: حذف `border-zinc-700 hover:border-sky-500 bg-zinc-900/40` → `border-[var(--text-muted)] hover:border-[var(--color-primary)] bg-[var(--bg-card)]`.
   - کارت: حذف `bg-zinc-900/60 border-white/5 hover:bg-zinc-900/95 hover:border-zinc-800` → `glass-card hover:bg-[var(--nav-hover-bg)]`.
   - متن عنوان: حذف `text-zinc-200` → `text-[var(--text-main)]`. `text-zinc-500` → `text-[var(--text-muted)]`.
   - badge پروژه: حذف `bg-zinc-800/40 border-white/5` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`.
   - badge تاریخ: حذف `bg-zinc-800/30 border-white/5` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`.
   - badge checklist: حذف `bg-zinc-800/30 border-white/5 text-zinc-500` → `bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]`. `text-green-400` → `text-[var(--color-primary)]`.
   - badge یادداشت متصل: حذف `bg-purple-500/10 text-purple-300 border-purple-500/15` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--border-neon)]`.
   - `priorityConfig`: حذف `bg-red-500/10 text-red-300 border-red-500/30` → `bg-[var(--semantic-error-soft)] text-[var(--semantic-error)] border-[var(--semantic-error)]/30`. حذف `bg-yellow-500/10 text-yellow-300 border-yellow-500/30` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--border-neon)]`. حذف `bg-sky-500/10 text-sky-300 border-sky-500/30` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--border-neon)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** props یا event handlers را تغییر بدهی.
- **نباید:** ساختار JSX را تغییر بدهی.
- **نباید:** `motion/react` import را تغییر بدهی.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/tasks/components/TaskCard.tsx"]
```

---

### تسک L2-21: ریدیزاین استایل `NotesView.tsx` و `NoteCard.tsx`

**عنوان:** اعمال توکن‌های Cyber-Lime روی صفحه یادداشت‌ها و کارت یادداشت

**راهنمای پیاده‌سازی فنی:**
1. در `NotesView.tsx`:
   - کانتینر: حذف `bg-zinc-950 text-white` → `text-[var(--text-main)]`.
   - هدر: حذف `bg-zinc-950/90 backdrop-blur-xl border-white/5` → `backdrop-blur-xl border-[var(--border-subtle)]` + `style={{ background: 'var(--bg-app-glass)' }}`.
   - عنوان: حذف `text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400` → `text-[var(--text-main)]`.
   - متن فرعی: حذف `text-zinc-500` → `text-[var(--text-muted)]`.
   - input جستجو: حذف `bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-purple-500/50` → `bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--input-focus-ring)]`.
   - دکته Add شناور: حذف `bg-gradient-to-tr from-purple-600 to-fuchsia-600 shadow-purple-500/20` → `bg-lime shadow-[0_0_15px_rgba(216,240,102,0.3)] text-[var(--text-on-primary)]`.
   - empty state: حذف `text-zinc-400` → `text-[var(--text-muted)]`. حذف `text-zinc-600` → `text-[var(--text-muted)] opacity-60`. آیکن: حذف `text-zinc-800` → `text-[var(--text-muted)] opacity-30`.

2. در `NoteCard.tsx`:
   - glow: حذف `from-purple-500/20 to-fuchsia-600/20` → `from-[var(--color-primary)]/20 to-[var(--color-primary)]/10`.
   - کارت: حذف `bg-zinc-900 border-white/5 hover:border-purple-500/30` → `glass-card hover:border-[var(--color-primary)]/30`.
   - عنوان: حذف `text-white hover:text-purple-100` → `text-[var(--text-main)] hover:text-[var(--text-main)]`.
   - متن: حذف `text-zinc-400` → `text-[var(--text-muted)]`.
   - footer: حذف `border-white/5` → `border-[var(--border-subtle)]`.
   - تاریخ: حذف `text-zinc-600` → `text-[var(--text-muted)]`.
   - badge کارت متصل: حذف `bg-sky-500/10 text-sky-300 border-sky-500/15` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--border-neon)]`.
   - تگ‌ها: حذف `bg-zinc-800/80 text-zinc-400 hover:bg-purple-500/10 hover:text-purple-300` → `bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]`.
   - badge پروژه: حذف `bg-zinc-800/60 border-white/5` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** منطق search، filter، masonry را تغییر بدهی.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/notes/NotesView.tsx", "features/notes/components/NoteCard.tsx"]
```

---

### تسک L2-22: ریدیزاین استایل `ProjectsView.tsx` و `ProjectCard.tsx`

**عنوان:** اعمال توکن‌های Cyber-Lime روی صفحه پروژه‌ها و کارت پروژه

**راهنمای پیاده‌سازی فنی:**
1. در `ProjectsView.tsx`:
   - کانتینر: حذف `bg-slate-950 text-white` → `text-[var(--text-main)]`.
   - هدر: حذف `bg-slate-950/80 backdrop-blur-xl border-white/5` → `backdrop-blur-xl border-[var(--border-subtle)]` + `style={{ background: 'var(--bg-app-glass)' }}`.
   - عنوان: حذف `text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-sky-300` → `text-[var(--text-main)]`.
   - متن فرعی: حذف `text-zinc-500` → `text-[var(--text-muted)]`.
   - دکمه «پروژه جدید»: حذف `bg-sky-600 hover:bg-sky-500 shadow-sky-950/20` → `bg-lime hover:bg-[var(--color-primary-hover)] shadow-[0_0_15px_rgba(216,240,102,0.3)] text-[var(--text-on-primary)]`.
   - empty state: حذف `text-zinc-400` → `text-[var(--text-muted)]`. حذف `text-zinc-650` → `text-[var(--text-muted)] opacity-60`. آیکن: حذف `text-zinc-800` → `text-[var(--text-muted)] opacity-30`.
   - مودال inline edit: حذف `bg-slate-900 border-t sm:border border-slate-700/85` → `bg-[var(--bg-card)] border-t sm:border border-[var(--border-subtle)]`.
   - input عنوان: حذف `bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600 focus:ring-sky-500` → `bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:ring-[var(--color-primary)]`.

2. در `ProjectCard.tsx`:
   - `colorClasses`: تمام مقادیر `bg-{color}-500/10`, `border-{color}-500/55`, `text-{color}-300` را با توکن‌های لیمویی جایگزین کن: `bg: 'bg-[var(--color-primary)]/10'`, `border: 'border-[var(--border-neon)]'`, `text: 'text-[var(--color-primary)]'`, `gradient: 'from-[var(--color-primary)]/20'`, `solidBg: 'bg-[var(--color-primary)]'`.
   - `priorityClasses`: `text-red-300` → `text-[var(--semantic-error)]`, `bg-red-500/10` → `bg-[var(--semantic-error-soft)]`. `text-yellow-300` → `text-[var(--color-primary)]`, `bg-yellow-500/10` → `bg-[var(--color-primary)]/10`. `text-sky-300` → `text-[var(--text-muted)]`, `bg-sky-500/10` → `bg-[var(--bg-card)]`.
   - کارت: حذف `bg-zinc-900/60 border-white/5 hover:border-zinc-800 hover:shadow-black/40` → `glass-card hover:border-[var(--border-neon)]`.
   - عنوان: حذف `text-zinc-100` → `text-[var(--text-main)]`.
   - متن: حذف `text-zinc-400` → `text-[var(--text-muted)]`.
   - progress bar track: حذف `bg-zinc-950/60` → `bg-[var(--bg-card)]`.
   - متن پیشرفت: حذف `text-zinc-500` → `text-[var(--text-muted)]`. حذف `text-zinc-300` → `text-[var(--text-main)]`.
   - دکمه edit: حذف `text-zinc-500 hover:text-sky-450` → `text-[var(--text-muted)] hover:text-[var(--color-primary)]`.
   - دکمه delete: حذف `text-zinc-500 hover:text-red-400` → `text-[var(--text-muted)] hover:text-[var(--semantic-error)]`.
   - آیکن تعداد: حذف `text-zinc-600` → `text-[var(--text-muted)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** منطق accordion، stats، CRUD را تغییر بدهی.
- **باید:** `colorClasses` و `priorityClasses` export شده با رنگ‌های جدید آپدیت شوند.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/projects/ProjectsView.tsx", "features/projects/components/ProjectCard.tsx"]
```

---

### تسک L2-23: ریدیزاین استایل `ChatView.tsx` و زیرکامپوننت‌ها

**عنوان:** اعمال توکن‌های Cyber-Lime روی صفحه چت و کامپوننت‌های فرعی

> ⚠️ **مسیر زنده:** فایلِ زنده `features/chat/ChatView.tsx` است (طبق CONTEXT_FILES). فایلِ `components/ChatView.tsx` **مرده** است و نباید ویرایش شود (ARCHITECTURE §۶).

**راهنمای پیاده‌سازی فنی:**
1. در `features/chat/ChatView.tsx`:
   - پس‌زمینه: حذف `bg-gray-950` → `text-[var(--text-main)]`.
   - هدر چت: حذف `bg-gray-950/80 backdrop-blur-xl border-white/10` → `backdrop-blur-xl border-[var(--border-subtle)]` + `style={{ background: 'var(--bg-app-glass)' }}`.
   - پیام کاربر: حذف `bg-sky-600 text-white` → `bg-lime text-[var(--text-on-primary)]`.
   - پیام AI: حذف `bg-gray-800/50` → `glass-card`.
   - input چت: حذف `bg-gray-800/70 border-white/10` → `glass-card border-[var(--border-subtle)]`.
   - دکمه ارسال: حذف `bg-sky-600 text-white hover:bg-sky-500 shadow-sky-900/20` → `bg-lime text-[var(--text-on-primary)] hover:bg-[var(--color-primary-hover)] shadow-[0_0_15px_rgba(216,240,102,0.3)]`.
   - آیکن‌های attachment/mic: حذف `text-gray-400` → `text-[var(--text-muted)]`.
   - empty-state: حذف `text-gray-500` → `text-[var(--text-muted)]`.

2. در `ModeChip.tsx`:
   - فعال: حذف `bg-sky-500 text-white shadow-sky-500/25 ring-sky-400/50` → `bg-lime text-[var(--text-on-primary)] shadow-[0_0_15px_rgba(216,240,102,0.3)] ring-[var(--color-primary)]/50`.
   - غیرفعال: حذف `bg-neutral-900 border-neutral-800 text-zinc-400 hover:bg-neutral-800 hover:text-white` → `glass-card border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text-main)]`.

3. در `ChatHistoryDrawer.tsx`:
   - کانتینر: حذف `bg-gray-950 border-white/10` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`.
   - هدر: حذف `text-white` → `text-[var(--text-main)]`. آیکن: حذف `text-sky-400` → `text-[var(--color-primary)]`.
   - آیتم فعال: حذف `bg-sky-500/10 border-sky-500/30 text-white` → `bg-[var(--color-primary)]/10 border-[var(--border-neon)] text-[var(--text-main)]`.
   - آیتم غیرفعال: حذف `bg-gray-900/60 border-white/5 hover:bg-gray-800 text-gray-350` → `glass-card border-[var(--border-subtle)] hover:bg-[var(--nav-hover-bg)] text-[var(--text-muted)]`.
   - spinner: حذف `border-sky-400` → `border-[var(--color-primary)]`.

4. در `CitationCard.tsx`:
   - کارت: حذف `bg-gray-800/50 hover:bg-gray-700/80 border-white/5 hover:border-sky-500/30` → `glass-card hover:bg-[var(--nav-hover-bg)] border-[var(--border-subtle)] hover:border-[var(--color-primary)]/30`.
   - متن: حذف `text-gray-300` → `text-[var(--text-main)]`. حذف `text-gray-500` → `text-[var(--text-muted)]`.
   - آیکن link: حذف `text-gray-600 group-hover:text-sky-400` → `text-[var(--text-muted)] group-hover:text-[var(--color-primary)]`.
   - icon backgrounds: `bg-purple-500/10 text-purple-400` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)]`. `bg-green-500/10 text-green-400` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)]`. `bg-sky-500/10 text-sky-400` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)]`.

5. در `ProposalCard.tsx`:
   - کانتینر: حذف `bg-gray-900/60 border-white/10` → `glass-card border-[var(--border-subtle)]`.
   - عنوان: حذف `text-sky-400` → `text-[var(--color-primary)]`.
   - دکمه «تأیید همه»: حذف `bg-sky-500 hover:bg-sky-600 shadow-sky-500/15` → `bg-lime hover:bg-[var(--color-primary-hover)] shadow-[0_0_15px_rgba(216,240,102,0.3)] text-[var(--text-on-primary)]`.
   - آیتم pending: حذف `bg-gray-800/80 border-white/5` → `glass-card border-[var(--border-subtle)]`.
   - آیتم approved: حذف `bg-green-500/5 border-green-500/20` → `bg-[var(--color-primary)]/5 border-[var(--border-neon)]`.
   - آیتم rejected: حذف `bg-red-500/5 border-red-500/20` → `bg-[var(--semantic-error-soft)] border-[var(--semantic-error)]/20`.
   - badge تأیید شده: حذف `bg-green-500/10 text-green-400` → `bg-[var(--color-primary)]/10 text-[var(--color-primary)]`.
   - badge رد شده: حذف `bg-red-500/10 text-red-500` → `bg-[var(--semantic-error-soft)] text-[var(--semantic-error)]`.
   - inputهای edit: حذف `bg-gray-900 border-white/10 focus:border-sky-500` → `bg-[var(--bg-card)] border-[var(--border-subtle)] focus:border-[var(--input-focus-ring)]`.
   - دکمه ذخیره: حذف `bg-green-600 hover:bg-green-700` → `bg-lime hover:bg-[var(--color-primary-hover)] text-[var(--text-on-primary)]`.
   - دکمه انصراف: حذف `bg-gray-700 hover:bg-gray-600 text-gray-300` → `glass-card hover:bg-[var(--nav-hover-bg)] text-[var(--text-main)]`.

6. در `ActionResultCard.tsx`:
   - کارت: حذف `bg-gray-800/80 border-white/10 hover:bg-gray-700` → `glass-card hover:bg-[var(--nav-hover-bg)]`.
   - متن: حذف `text-gray-400` → `text-[var(--text-muted)]`. حذف `text-white group-hover:text-sky-300` → `text-[var(--text-main)] group-hover:text-[var(--color-primary)]`.
   - آیکن link: حذف `text-gray-400 group-hover:text-white` → `text-[var(--text-muted)] group-hover:text-[var(--text-main)]`.
   - رنگ‌های آیکن: `bg-green-500` → `bg-[var(--color-primary)]`. `bg-purple-500` → `bg-[var(--color-primary)]`. `bg-sky-500` → `bg-[var(--color-primary)]`. `bg-orange-500` → `bg-[var(--color-primary)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** هیچ منطق (state, useEffect, useRef, handlers, sanitizeHistoryMessage) را تغییر بدهی.
- **نباید:** `useMediaRecorder` hook را دست بزنی.
- **باید:** متن روی دکمه ارسال و حباب کاربر همیشه مشکی (`var(--text-on-primary)`) باشد.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/chat/ChatView.tsx", "features/chat/components/ModeChip.tsx", "features/chat/components/ChatHistoryDrawer.tsx", "features/chat/components/CitationCard.tsx", "features/chat/components/ProposalCard.tsx", "features/chat/components/ActionResultCard.tsx"]
```

---

### تسک L2-24: ریدیزاین استایل مودال‌های سراسری

**عنوان:** اعمال توکن‌های Cyber-Lime روی مودال‌های ویرایش تسک، یادداشت، عادت و ProfileModal و PaywallModal

**راهنمای پیاده‌سازی فنی:**
1. در `TaskEditorModal.tsx` (۲۸KB):
   - backdrop: حذف `bg-black/75` → `bg-black/40 dark:bg-black/70`.
   - بدنه: حذف `bg-slate-900 border-slate-700/80` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`.
   - input/textarea: حذف `bg-gray-900 border-white/10 text-white focus:border-sky-500` → `bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--input-focus-ring)]`.
   - دکمه primary: حذف `bg-sky-600 text-white` → `bg-lime text-[var(--text-on-primary)]`.
   - دکمه secondary: حذف `bg-gray-700 text-gray-300` → `glass-card text-[var(--text-main)]`.
   - دکمه destructive: حذف `bg-red-500/10 text-red-400` → `bg-[var(--semantic-error-soft)] text-[var(--semantic-error)]`.
   - `priorityConfig`: همان جایگزینی‌های TaskCard.tsx (تسک L2-20).
   - متن‌ها: `text-white` → `text-[var(--text-main)]`. `text-gray-400` → `text-[var(--text-muted)]`.

2. در `NoteEditorModal.tsx`: همان الگو — backdrop, بدنه, input, دکمه‌ها.

3. در `HabitManagerModal.tsx` و `HabitEditorModal.tsx` و `HabitForm.tsx`: همان الگو. `bg-zinc-950` → `bg-[var(--bg-card)]`. `text-orange-500` → `text-[var(--color-primary)]`. `focus:ring-orange-500` → `focus:ring-[var(--color-primary)]`.

4. در `ProfileModal.tsx` (۲۰KB): همان الگو. `bg-gray-900 border-white/10` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`.

5. در `PaywallModal.tsx`: همان الگو. `bg-sky-600` → `bg-lime text-[var(--text-on-primary)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** هیچ prop، استیت یا handler را تغییر بدهی.
- **نباید:** منطق checklist، date picker، time picker را دست بزنی.
- **باید:** در موبایل، مودال به صورت bottom-sheet (`rounded-t-3xl h-[100dvh]`) باشد.
- **باید:** `pb-safe` یا `pb-safe-content` در پایین مودال حفظ شود.
- **باید:** انیمیشن `motion/react` (slide-up) حفظ شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/tasks/components/TaskEditorModal.tsx", "features/notes/components/NoteEditorModal.tsx", "features/habits/components/HabitManagerModal.tsx", "features/habits/components/HabitEditorModal.tsx", "features/habits/components/HabitForm.tsx", "components/ProfileModal.tsx", "components/PaywallModal.tsx", "components/Modal.tsx"]
```

---

### تسک L2-25: ریدیزاین استایل صفحات اشتراک، آنبوردینگ و Auth

**عنوان:** اعمال توکن‌های Cyber-Lime روی صفحات اشتراک، آنبوردینگ و Auth

**راهنمای پیاده‌سازی فنی:**
1. در `SubscriptionPage.tsx` و `SubscriptionModal.tsx` و `UsageMeter.tsx`: همان الگوی جایگزینی رنگ. `bg-sky-600` → `bg-lime`. `text-sky-400` → `text-[var(--color-primary)]`. `bg-zinc-900` → `glass-card`.
2. در `Onboarding.tsx` و `NameStep.tsx` و `SlideCard.tsx` و `SlideViewer.tsx`: `bg-gray-950` → `text-[var(--text-main)]`. `bg-sky-600` → `bg-lime`. `text-sky-400` → `text-[var(--color-primary)]`.
3. در `Auth.tsx` (۲۲KB): `bg-gray-950` → `text-[var(--text-main)]`. `bg-sky-600` → `bg-lime text-[var(--text-on-primary)]`. `text-sky-400` → `text-[var(--color-primary)]`. `focus:ring-sky-500` → `focus:ring-[var(--color-primary)]`.
4. در `NetworkBanner.tsx`: `bg-red-500/10 text-red-300 border-red-500/20` → `bg-[var(--semantic-error-soft)] text-[var(--semantic-error)] border-[var(--semantic-error)]/20`.
5. در `ToastNotifications.tsx`: `bg-gray-800 border-white/10` → `glass-card border-[var(--border-subtle)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** منطق onboarding (slides, step management) را تغییر بدهی.
- **نباید:** منطق احراز هویت (Supabase OTP) را تغییر بدهی.
- **باید:** `pb-safe` و `pt-safe` حفظ شوند.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/billing/pages/SubscriptionPage.tsx", "features/billing/components/SubscriptionModal.tsx", "features/billing/components/UsageMeter.tsx", "features/onboarding/Onboarding.tsx", "features/onboarding/components/NameStep.tsx", "features/onboarding/components/SlideCard.tsx", "features/onboarding/components/SlideViewer.tsx", "components/Auth.tsx", "components/NetworkBanner.tsx", "components/ui/ToastNotifications.tsx"]
```

---

### تسک L2-26: ریدیزاین استایل `HabitStatsView.tsx` و `ProjectDetailsModal.tsx`

**عنوان:** اعمال توکن‌های Cyber-Lime روی آمار عادت و مودال جزئیات پروژه

**راهنمای پیاده‌سازی فنی:**
1. در `HabitStatsView.tsx`:
   - زنجیره فعلی: حذف `from-orange-500/10 to-amber-500/5 border-orange-500/15` → `from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 border-[var(--border-neon)]`. آیکن: حذف `text-orange-500` → `text-[var(--color-primary)]`. عدد: حذف `text-orange-400` → `text-[var(--color-primary)]`.
   - زنجیره طولانی‌ترین: حذف `from-sky-500/10 to-blue-500/5 border-sky-500/15` → `from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 border-[var(--border-neon)]`. آیکن: حذف `text-sky-400` → `text-[var(--color-primary)]`. عدد: حذف `text-sky-400` → `text-[var(--color-primary)]`.
   - heatmap: حذف `bg-zinc-900 border-white/5` → `glass-card border-[var(--border-subtle)]`.
   - متن‌ها: `text-white` → `text-[var(--text-main)]`. `text-zinc-400` → `text-[var(--text-muted)]`. `text-zinc-500` → `text-[var(--text-muted)]`.

2. در `ProjectDetailsModal.tsx`:
   - backdrop: حذف `bg-black/75` → `bg-black/40 dark:bg-black/70`.
   - بدنه: حذف `bg-slate-900 border-slate-700/80` → `bg-[var(--bg-card)] border-[var(--border-subtle)]`.
   - تب‌ها: `colors.text` و `colors.bg` از `colorClasses` آپدیت شده (تسک L2-22) استفاده می‌کنند.
   - آیتم‌ها: حذف `bg-zinc-900/45 hover:bg-zinc-900 border-white/5 hover:border-zinc-800` → `glass-card hover:bg-[var(--nav-hover-bg)] border-[var(--border-subtle)]`.
   - متن: حذف `text-zinc-200` → `text-[var(--text-main)]`. حذف `text-zinc-500` → `text-[var(--text-muted)]`.
   - آیکن edit: حذف `text-zinc-600 group-hover:text-sky-450` → `text-[var(--text-muted)] group-hover:text-[var(--color-primary)]`.

**محدودیت‌های اختصاصی تسک:**
- **نباید:** منطق stats، tabs، filtering را تغییر بدهی.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["features/habits/components/HabitStatsView.tsx", "features/projects/components/ProjectDetailsModal.tsx"]
```

---

### تسک L2-27: اصلاح هک autofill در `index.css` برای لایت‌مود

**عنوان:** اصلاح رنگ پس‌زمینه autofill در لایت‌مود

> **اصلاح بازنگری:** نسخه‌ی قبلیِ این تسک از نظر CSS نادرست بود (گفته بود قانونِ `input:-webkit-autofill` را «داخل `:root`» بگذار؛ اما `:root` خودِ المنتِ html است، نه wrapper — نمی‌توان یک سلکتورِ دیگر را داخلش گذاشت). رویکرد صحیح: **توکن‌محور با یک قانونِ واحد**.

**راهنمای پیاده‌سازی فنی:**
1. اگر در L2-1 بلوک autofillِ توکن‌محور را اضافه کرده‌ای، این تسک قبلاً انجام شده — رد شو.
2. در `index.css`، بلوکِ فعلیِ autofill (که `#09090b` را هاردکد می‌کند) را با **یک قانونِ واحدِ توکن‌محور** جایگزین کن:
```css
input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus,
textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus,
select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px var(--autofill-bg) inset !important;
  -webkit-text-fill-color: var(--autofill-text) !important;
  caret-color: var(--autofill-text);
  transition: background-color 5000s ease-in-out 0s;
}
```
3. مقادیرِ `--autofill-bg`/`--autofill-text` در `:root` (سفید/مشکی) و `.dark` (`#09090b`/سفید) از L2-1 می‌آیند. **هیچ مقدار رنگیِ هاردکدی در خودِ قانونِ autofill نماند.**

**محدودیت‌های اختصاصی تسک:**
- **نباید:** `transition: background-color 5000s ease-in-out 0s` را حذف کنی.
- **نباید:** سلکتورِ دیگری داخلِ `:root` یا `.dark` لانه کنی — فقط مقادیرِ توکن در آن‌ها تعریف می‌شوند و قانونِ autofill در سطحِ بالا با `var()` نوشته می‌شود.
- **باید:** در لایت‌مود پس‌زمینه autofill سفید و متن مشکی، و در دارک‌مود پس‌زمینه `#09090b` و متن سفید شود.

**آرایه کانتکست ماشین‌خوان:**
```json
CONTEXT_FILES: ["index.css"]
```

---

## ترتیب اجرای توصیه‌شده

1. **L2-1** (توکن‌های CSS: کانالی `*-rgb` + مقدار-کامل + autofill توکن‌محور + کلاس‌های آیکن تم) + **L2-2** (`tailwind.config`: `darkMode:'class'` + مَپِ رنگ‌های کانالی + اسکریپت pre-paint) — پایه‌ی همه‌چیز. **این دو اول و حتماً با هم.**
2. **L2-3** (Sidebar) + **L2-5** (Header) + **L2-6** (WidgetContainer) + **L2-16** (BottomNav) — موازی
3. **L2-14** (ProductivityChart — Presentational با داده‌ی واقعی) + **L2-15** (FocusTimer — پومودوروی کلاینتی) — موازی (کامپوننت‌های جدید)
4. **L2-7** (QuickCapture) + **L2-8** (StatsOverview) + **L2-9** (WeekCalendar) + **L2-10** (TodaysPlan) + **L2-11** (KeyProjects) — موازی. ~~L2-12 (HabitTracker)~~ و ~~L2-13 (TodaysNotes)~~ **منسوخ** (از رندر حذف، فایل می‌ماند).
5. **L2-18** (App.tsx — سایدبارِ گلوبال + ProfileModalِ گلوبال + پس‌زمینه) — **قبل یا هم‌زمان با L2-4** (چون ساختارِ سایدبار/پروفایل به هم وابسته‌اند).
6. **L2-4** (Dashboard orchestration — گرید دوستونه، بدون سایدبار) — بعد از ۲، ۳، ۴، ۵.
7. **L2-17** (WeeklyReportModal) — مستقل.
8. **فاز دوم:** L2-19 تا L2-27 — همه موازی (فقط رنگ و استایل). L2-27 (autofill) اگر در L2-1 انجام شده، رد شود.

> **هشدارِ تداخلِ Read/Write:** L2-4 و L2-18 هر دو `App.tsx`/`Dashboard.tsx` را لمس می‌کنند (انتقال Sidebar و ProfileModal)؛ این دو را **موازی اجرا نکن** — اول L2-18 سپس L2-4.

---

## معیار پذیرش نهایی

1. ظاهر داشبورد دسکتاپ دوستونه (سایدبارِ گلوبال + ۲ ستونِ محتوا) و گلس باشد؛ **بدون قیچی‌شدنِ محتوا** (آنتی‌پترن #۲۱).
2. **سایدبارِ دسکتاپ روی همه‌ی صفحات (کارها/یادداشت‌ها/پروژه‌ها/...) باقی بماند و هرگز با تعویض صفحه ناپدید نشود** (رفع تله‌ی ناوبری).
3. ظاهر موبایل روان و بومی، با هدر فعلی حفظ‌شده (فقط رنگ‌ها تغییر کرده) و BottomNav فقط در موبایل.
4. هیچ استیت/مودال/هندلرِ زنده‌ای حذف یا شکسته نشده باشد. (تنها جابجاییِ مجاز: انتقالِ `ProfileModal`+`isProfileOpen` از Dashboard به App.)
5. **همه‌ی ویجت‌های ماکت ساخته و رندر شده باشند:** ProductivityChart (با داده‌ی واقعی) و FocusTimer (پومودوروی کلاینتیِ کارا با شمارش معکوس). **`TodaysNotes` و `HabitTracker` از رندرِ داشبورد حذف شده باشند، ولی فایل‌هایشان موجود بمانند** (Delete نشده).
6. **شفافیت درست کار کند:** هیچ `bg-[var(--color-primary)]/NN` در کد نباشد؛ Badgeها/پس‌زمینه‌های شفاف با کلاس‌های کانالی (`bg-primary/10` و...) نمایش داده شوند و ناپدید نشوند.
7. **تم light/dark با toggle + localStorage کار کند و `dark:`های Tailwind نیز با کلاس همگام باشند** (`darkMode:'class'`) — بدون split-brain. دکمه‌ی toggle بشکند ممنوع؛ روی آیکن‌های تم هیچ کلاس `hidden`ی نباشد.
8. هک‌های iOS/Safari کاملاً سالم باشند.
9. **پس‌زمینه دقیقاً یک‌بار در `App.tsx` و توکن‌محور (`--bg-base`، بدون تصویر خارجی)** باشد؛ در آفلاین هم کنتراستِ کارت‌های گلس سالم بماند.
10. هیچ فایل مرده‌ای در `components/` ویرایش نشده باشد؛ هیچ داده‌ی ساختگی به کاربر نمایش داده نشود؛ هیچ کامپوننتی دو بار Mount نشود.
11. autofill در هر دو مود توکن‌محور و خوانا (لایت: سفید/مشکی، دارک: `#09090b`/سفید).
12. هیچ پکیج npm جدیدی نصب نشده و `npm run build` بدون خطا عبور کند.
13. هیچ کدی از `dashboard_redisign/index.html` کپی نشده باشد.
