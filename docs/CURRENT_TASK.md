
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

### تسک L2-25: ریدیزاین استایل صفحات اشتراک، آنبوردینگ و Auth [انجام شد]

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

---

## وضعیت تکمیل تسک‌ها (Batch 17: Final UI Components)
- [x] **NetworkBanner.tsx**: بازطراحی کامل با استفاده از توکن‌های سمانتیک اخطار/خطا (`bg-[var(--semantic-error)] text-white`) و آیکن و پالس سفید بدون هرگونه رنگ استاتیک زرد/قرمز.
- [x] **ToastNotifications.tsx**: بازطراحی کامل کارت‌های اعلان به صورت شیشه‌ای و پریمیوم (`bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl`) به همراه آیکن‌های موفقیت/خطا با رنگ‌های سمانتیک (`text-[var(--semantic-success)]` و `text-[var(--semantic-error)]`) و دکمه‌ها و متون منطبق با تم.
- [x] **تایپ‌سیفتی و کارایی**: کدهای هر دو کامپوننت کامپایل و تایید نهایی شدند.
