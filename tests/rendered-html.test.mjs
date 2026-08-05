import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the FPT Telecom Career Booming page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="vi">/i);
  assert.match(html, /<title>FPT Telecom Career Booming<\/title>/i);
  assert.match(html, /Khám phá vũ trụ cơ hội nghề nghiệp/);
  assert.match(html, /Đặc quyền thực tế bạn nhận được/);
  assert.match(html, /Hành trình đồng hành kiến tạo tương lai/);
  assert.match(html, /Vũ trụ nghề nghiệp tại FPT Telecom/);
  assert.match(html, /Tôi đồng ý nhận thông tin việc làm và các cơ hội sự nghiệp từ FPT Telecom\./);
  for (const label of [
    "Họ và tên *",
    "Số điện thoại *",
    "Email *",
    "Trường đại học/ cao đẳng *",
    "Thời gian dự kiến tốt nghiệp *",
    "Khu vực mong muốn làm việc *",
    "Vị trí mong muốn ứng tuyển *",
  ]) {
    assert.match(html, new RegExp(label.replace("*", "\\*")));
  }
  assert.match(html, /type="month"/);
  assert.match(html, /TP\. Hồ Chí Minh/);
  assert.match(html, /Vĩnh Long/);
  assert.match(html, /Dịch vụ khách hàng/);
  assert.match(html, />Khác<\/option>/);
  assert.doesNotMatch(html, /Upload CV \(không bắt buộc\)/);
  assert.match(html, /class="footer-container"/);
  assert.match(html, /Kết nối với chúng tôi/);
  assert.doesNotMatch(html, /Building your site|Your site is taking shape/);
});

test("keeps the audited Figma frame and original assets in place", async () => {
  const [css, page] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(css, /\.desktop-canvas\s*\{[^}]*width:\s*1440px;[^}]*min-height:\s*5048px;/s);
  assert.match(css, /\.hero\s*\{[^}]*top:\s*80px;[^}]*width:\s*1440px;[^}]*height:\s*624px;/s);
  assert.match(css, /\.about\s*\{[^}]*left:\s*135px;[^}]*top:\s*630px;[^}]*width:\s*1169px;[^}]*height:\s*300px;/s);
  assert.match(css, /\.connect\s*\{[^}]*left:\s*0;[^}]*top:\s*3383px;[^}]*width:\s*1440px;[^}]*height:\s*829px;/s);
  assert.match(css, /\.footer-container\s*\{[^}]*left:\s*0;[^}]*top:\s*4212px;[^}]*width:\s*1440px;/s);
  assert.match(css, /font-family:\s*"FTEL Sans";[\s\S]*?src:\s*url\('\/assets\/inter-vietnamese\.woff2'\)[\s\S]*?unicode-range:[^;}]*U\+1EA0-1EF9/);
  assert.match(css, /src:\s*url\('\/assets\/inter-latin-ext\.woff2'\)/);
  assert.match(css, /src:\s*url\('\/assets\/inter-latin\.woff2'\)/);
  assert.match(css, /body\s*\{[^}]*font-family:\s*"FTEL Sans",\s*"Segoe UI",\s*Arial,\s*sans-serif;/s);
  assert.match(css, /\.trust-bar strong\s*\{[^}]*font-family:\s*inherit;/s);
  assert.match(css, /\.register\s*\{[^}]*white-space:\s*nowrap;/s);
  assert.match(css, /\.contact-mascot\s*\{[^}]*overflow:\s*hidden;/s);
  assert.match(css, /\.contact-card\s*\{[^}]*height:\s*220px;/s);
  assert.match(css, /\.contact-mascot\s*\{[^}]*top:\s*0;[^}]*bottom:\s*0;/s);
  assert.match(css, /\.company-titles\s*\{[^}]*margin-left:\s*auto;[^}]*text-align:\s*right;/s);
  assert.match(css, /\.footer-columns-desktop\s*>\s*\.footer-col:not\(\.col-main\)\s*\{[^}]*text-align:\s*right;/s);
  assert.match(page, /className="footer-left-bands"/);
  for (const icon of ["ContactLocationIcon", "ContactFacebookIcon", "ContactTikTokIcon", "ContactLinkedInIcon", "ContactPhoneIcon", "ContactEmailIcon"]) {
    assert.match(page, new RegExp(`<${icon} \\/>`));
  }
  assert.match(css, /\.contact-svg\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s);
  assert.match(css, /\.about\s*>\s*p\s*\{[^}]*top:\s*174px;/s);
  for (const color of ["blue", "orange", "green"]) {
    assert.match(page, new RegExp(`footer-band footer-band-${color}`));
  }
  assert.doesNotMatch(page, /footer-left-bands[\s\S]*?footer-bottom\.png/);
  assert.match(css, /\.footer-band\s*\{[^}]*border-radius:\s*999px;/s);
  assert.match(page, /aria-label="Facebook"><ContactFacebookIcon \/>/);
  assert.match(page, /aria-label="TikTok"><ContactTikTokIcon \/>/);
  assert.match(page, /aria-label="LinkedIn"><ContactLinkedInIcon \/>/);
  assert.match(page, /aria-label="Hotline"><ContactPhoneIcon \/>/);
  assert.doesNotMatch(css, /src:\s*local\(/);
  assert.match(page, /desktopVisibleCards = 3/);
  assert.match(page, /Array\.from\(\{ length: desktopMaxStart \+ 1 \}/);
  assert.match(page, /disabled=\{atDesktopStart\}/);
  assert.match(page, /disabled=\{atDesktopEnd\}/);
  assert.match(page, /fade-right[\s\S]*fade-left[\s\S]*fade-both/);
  assert.match(css, /\.carousel-arrow:disabled[^}]*background:\s*#cbd5e1;/s);
  assert.match(page, /window\.setTimeout[\s\S]*4500/);
  assert.match(css, /@media \(min-width:\s*768px\)[\s\S]*?\.journey-card:nth-child\(5\) \.journey-photo\s*\{[^}]*top:\s*-50px;[^}]*width:\s*430px;[^}]*height:\s*430px;[^}]*\}[\s\S]*?\.journey-card:nth-child\(5\) \.journey-overlay\s*\{[^}]*45%[^}]*64%[^}]*79%/s);
  assert.match(page, /prefers-reduced-motion:\s*reduce/);
  assert.match(page, /onMouseEnter=\{\(\) => setAutoPaused\(true\)\}/);
  assert.match(css, /@media \(min-width:\s*1440px\)[\s\S]*?\.page-shell\s*\{[^}]*width:\s*100%;[^}]*height:\s*350\.5555556vw;[^}]*overflow:\s*clip;[^}]*\}[\s\S]*?\.desktop-canvas\s*\{[^}]*margin:\s*0;[^}]*transform:\s*scale\(calc\(100vw \/ 1440px\)\);[^}]*transform-origin:\s*top left;/s);

  for (const font of [
    "inter-vietnamese.woff2",
    "inter-latin-ext.woff2",
    "inter-latin.woff2",
  ]) {
    await access(new URL(`../public/assets/${font}`, import.meta.url));
  }

  for (const asset of [
    "hero-back.png",
    "hero-headline.png",
    "hero-people.png",
    "section2-headline.png",
    "privilege-headline.png",
    "journey-headline.png",
    "jobs-headline.png",
    "form-headline.png",
    "footer-top.png",
  ]) {
    assert.match(page, new RegExp(`/assets/${asset.replace(".", "\\.")}`));
    await access(new URL(`../public/assets/${asset}`, import.meta.url));
  }
});

test("adapts the same page tree to the mobile handoff", async () => {
  const [css, page] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.desktop-canvas\s*\{[^}]*width:\s*100%;[^}]*min-height:\s*auto;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero\s*\{[^}]*top:\s*72px;[^}]*width:\s*100%;[^}]*height:\s*670px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero-back\s*\{[^}]*top:\s*-40px;[^}]*width:\s*1073\.693px;[^}]*height:\s*787px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero-title img\s*\{[^}]*left:\s*-11\.61%;[^}]*top:\s*-24\.24%;[^}]*width:\s*174\.91%;[^}]*height:\s*219\.96%;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero-people\s*\{[^}]*top:\s*371px;[^}]*width:\s*334\.8px;[^}]*height:\s*324px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.decorative-background\s*\{[^}]*top:\s*661px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.background-buildings\s*\{[^}]*left:\s*0;[^}]*top:\s*394px;[^}]*width:\s*100%;[^}]*height:\s*auto;[^}]*aspect-ratio:\s*390 \/ 179;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.background-pattern\s*\{[^}]*top:\s*0;[^}]*height:\s*198px;[^}]*\}[\s\S]*?\.background-pattern img\s*\{[^}]*left:\s*-5\.61px;[^}]*top:\s*-121\.67px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.about\s*\{[^}]*top:\s*-9px;[^}]*height:\s*clamp\(325px,92\.3vw,360px\);[^}]*linear-gradient\(180deg,#fff 0%,#fff 43%,#f6fdff 60%,#def7ff 79%,#bdeeff 100%\);/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.about-title\s*\{[^}]*left:\s*20px;[^}]*top:\s*20px;[^}]*aspect-ratio:\s*302 \/ 119;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.trust-bar\s*\{[^}]*grid-template-columns:\s*minmax\(0,1fr\) 1px minmax\(0,1fr\) 1px minmax\(0,1fr\);[^}]*border-radius:\s*8px;[^}]*background:\s*#fff;[^}]*box-shadow:/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.trust-bar div\s*\{[^}]*padding:\s*25px 6px 0;[^}]*align-items:\s*flex-start;[^}]*text-align:\s*left;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.trust-bar \.stat-cyan strong\s*\{[^}]*color:\s*#ff5a01;/s);
  assert.match(css, /\.stat-cyan strong\s*\{[^}]*color:\s*#ff5a01;/s);
  assert.match(page, /Bệ phóng công nghệ hàng đầu<br \/>[\s\S]*?Môi trường thực chiến lý tưởng dành cho Gen Z/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.mobile-about-ellipse\s*\{\s*display:\s*none;\s*\}/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.about > p\s*\{[^}]*left:\s*10px;[^}]*width:\s*calc\(100% - 20px\);[^}]*font-size:\s*clamp\(10px,3\.333vw,13px\);/s);
  assert.match(css, /@media \(max-width:\s*359px\)[\s\S]*?\.trust-bar\s*\{[^}]*left:\s*12px;[^}]*width:\s*calc\(100% - 24px\);/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.connect\s*\{[^}]*top:\s*0;[^}]*width:\s*100%;[^}]*height:\s*auto;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.footer-container\s*\{[^}]*top:\s*0;[^}]*width:\s*100%;/s);
  assert.doesNotMatch(page, /function MobilePage|<MobilePage/);
  assert.equal((page.match(/className="desktop-canvas"/g) ?? []).length, 1);
  assert.match(page, /Vuốt để khám phá thêm/);
  assert.match(page, /const jobCategories: JobCategory\[\] = \[/);
  assert.match(page, /openCategory, setOpenCategory\] = useState\(jobCategories\[0\]\.id\)/);
  assert.match(page, /href="https:\/\/fptjobs\.com\/"[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"[\s\S]*?<span>Xem tất cả việc làm<\/span>/);
  const locationOptions = page.match(/const workLocations = \[([\s\S]*?)\];/)?.[1].match(/"[^"]+"/g) ?? [];
  const preferenceOptions = page.match(/const jobPreferenceOptions = \[([\s\S]*?)\];/)?.[1].match(/"[^"]+"/g) ?? [];
  assert.equal(locationOptions.length, 34);
  assert.equal(preferenceOptions.length, 12);
  assert.match(page, /title: "Kỹ thuật viên"/);
  assert.match(page, /title: "Nhân viên Kinh doanh"/);
  assert.match(page, /title: "Dịch vụ khách hàng"/);
  assert.match(page, /Hỗ trợ xử lý logic nghiệp vụ, làm việc với giao diện, hệ thống backend hoặc cơ sở dữ liệu tùy theo dự án\./);
  assert.match(page, /Cập nhật xu hướng thiết kế, đề xuất ý tưởng sáng tạo nhằm nâng cao chất lượng hình ảnh truyền thông\./);
  assert.match(page, /Xác minh thực tế tại địa chỉ khách hàng khi có yêu cầu\./);
  assert.match(page, /<h3>Nội dung công việc<\/h3>/);
  assert.doesNotMatch(page, /Tài chính - Kế toán|Yêu cầu ứng viên|requirements:/);
  assert.match(page, /toggleSection\("students"\)[\s\S]*?Dành cho sinh viên/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.company-header-card\s*\{[^}]*align-items:\s*flex-start;[^}]*text-align:\s*left;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.company-titles h3\s*\{[^}]*font-size:\s*clamp\(12px,3\.9vw,16px\);[^}]*white-space:\s*nowrap;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.footer-meta-bar\s*\{[^}]*align-items:\s*flex-start;[^}]*text-align:\s*left;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.footer-meta-bar\s*\{[^}]*gap:\s*24px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.meta-left\s*\{[^}]*gap:\s*14px;[\s\S]*?\.meta-middle\s*\{[^}]*gap:\s*12px;/s);
  assert.match(page, /Theo dõi các kênh chính thức<br className="mobile-meta-break" \/> của FPT Telecom/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.footer-bottom-copy\s*\{[^}]*text-align:\s*left;/s);
  assert.match(page, /const \[autoPaused, setAutoPaused\] = useState\(false\);[\s\S]*?track\.clientWidth >= 600[\s\S]*?window\.setTimeout[\s\S]*?4500/);
  assert.match(css, /\.privilege-cards\s*\{[^}]*--privilege-card-width:\s*min\(310px,calc\(100vw - 48px\)\);[^}]*padding-inline:\s*calc\(\(100vw - var\(--privilege-card-width\)\) \/ 2\);/s);
  assert.match(css, /\.privilege-card:nth-child\(1\) \.privilege-shade\s*\{[^}]*#0995ff 100%/s);
  assert.match(css, /\.privilege-card:nth-child\(2\) \.privilege-shade\s*\{[^}]*#10c24d 100%/s);
  assert.match(css, /\.privilege-card:nth-child\(3\) \.privilege-shade\s*\{[^}]*#ff5f00 100%/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.privilege-title img\s*\{[^}]*left:\s*-73px;[^}]*top:\s*-37px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.journey\s*\{[^}]*padding-top:\s*16px;[^}]*padding-bottom:\s*56px;[^}]*overflow:\s*hidden;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.journey::before\s*\{[^}]*top:\s*8px;[^}]*cloud-2\.png[^}]*opacity:\s*\.18;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.journey::after\s*\{[^}]*top:\s*58px;[^}]*cloud-2\.png[^}]*opacity:\s*\.14;/s);
  assert.match(css, /\.journey-cards\s*\{[^}]*--journey-card-width:\s*min\(310px,calc\(100vw - 48px\)\);[^}]*padding-inline:\s*calc\(\(100vw - var\(--journey-card-width\)\) \/ 2\);/s);
  assert.match(css, /\.journey-pattern\s*\{[^}]*top:\s*215px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.journey-heading img\s*\{[^}]*left:\s*-68px;[^}]*top:\s*-17px;/s);
  assert.match(page, /className="mobile-journey-pagination"[\s\S]*?journeyCards\.map/);
  assert.match(page, /const firstCard = carousel\.querySelector<HTMLElement>\("\.journey-card"\);[\s\S]*?firstCard\?\.offsetWidth/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.jobs\s*\{[^}]*padding-top:\s*12px;[^}]*isolation:\s*isolate;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.jobs::before\s*\{[^}]*cloud-2\.png[^}]*opacity:\s*\.18;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.jobs::after\s*\{[^}]*cloud-2\.png[^}]*opacity:\s*\.14;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.jobs-heading img\s*\{[^}]*left:\s*-60px;[^}]*top:\s*-40px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.connect-heading img\s*\{[^}]*left:\s*-54px;[^}]*top:\s*-39px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.connect-subtitle\s*\{[^}]*width:\s*calc\(100% \+ 24px\);[^}]*font-size:\s*clamp\(10px,calc\(4vw - 2\.6px\),13px\);/s);
  assert.match(page, /sẽ gửi đến<br className="mobile-connect-break" \/> bạn những cơ hội/);

  for (const asset of [
    "hero-headline.png",
    "brand-headline.png",
    "benefits-headline.png",
    "journey-headline.png",
    "jobs-headline.png",
    "form-header.png",
    "fpt-logo.png",
  ]) {
    assert.match(page, new RegExp(`/assets/mobile/${asset.replace(".", "\\.")}`));
    await access(new URL(`../public/assets/mobile/${asset}`, import.meta.url));
  }
});
