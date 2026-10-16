# آموزیار — اپ اندروید، iOS و دسکتاپ

همان `src/index.html` شما، بسته‌بندی‌شده با **Capacitor** (اندروید/iOS) و **Electron** (ویندوز/مک/لینوکس).
ساخت نسخه‌ها روی سرورهای GitHub انجام می‌شود؛ نیازی به نصب Android Studio یا Xcode ندارید.

## روش کار
1. این پوشه را در یک ریپوی جدید GitHub آپلود (push) کنید.
2. به تب **Actions** بروید؛ workflow با نام «Build Apps» خودکار اجرا می‌شود (حدود ۱۰–۱۵ دقیقه).
   اگر اجرا نشد: Actions ← Build Apps ← Run workflow.
3. پس از اتمام، فایل‌ها پایین صفحه‌ی همان اجرا در بخش **Artifacts** هستند:
   - `Amoozyar-Android-APK` ← فایل APK (قابل نصب مستقیم روی اندروید)
   - `Amoozyar-iOS-unsigned-IPA` ← IPA **امضانشده** (توضیح پایین)
   - `Amoozyar-Desktop-*` ← ویندوز (exe)، مک (dmg)، لینوکس (AppImage / deb)

برای ساخت Release عمومی با لینک دانلود: یک تگ بزنید، مثلاً `git tag v1.0.0 && git push --tags`.

## نکته‌های مهم
- **iOS:** برای نصب روی آیفون باید با Apple Developer Account (۹۹ دلار در سال) امضا شود. خروجی فعلی امضانشده است
  و فقط برای نشان‌دادن موفق‌بودن بیلد یا امضای بعدی (مثلاً با Sideloadly/AltStore یا Xcode) به کار می‌رود.
  برای انتشار در App Store باید certificate و provisioning profile به workflow اضافه شود.
- **اندروید:** APK فعلی از نوع debug است. برای انتشار در Google Play باید keystore بسازید و Release امضاشده بگیرید.
- **دسکتاپ:** مک و ویندوز امضا نشده‌اند؛ هنگام اولین اجرا ممکن است هشدار امنیتی بدهند.
- فونت وزیرمتن و Chart.js هنگام بیلد دانلود و داخل اپ گذاشته می‌شوند تا آفلاین هم کار کنند.
- شناسه‌ی اپ `ir.amoozyar.app` است؛ برای تغییر، آن را در `capacitor.config.json` و `package.json` (بخش build) عوض کنید.
- آیکن: `resources/icon.png` (۱۰۲۴×۱۰۲۴) و `resources/splash.png` را با طرح خودتان جایگزین کنید.

## تغییر در اپ
فقط `src/index.html` را ویرایش و push کنید؛ بقیه خودکار ساخته می‌شود.

## اجرای محلی (اختیاری)
```bash
npm install
npm run desktop        # اجرای نسخه دسکتاپ
```
