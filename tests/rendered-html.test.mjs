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
  assert.match(html, /class="footer-container"/);
  assert.match(html, /Kết nối với chúng tôi/);
  assert.doesNotMatch(html, /Building your site|Your site is taking shape/);
});

test("keeps the audited Figma frame and original assets in place", async () => {
  const [css, page] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(css, /\.desktop-canvas\s*\{[^}]*width:\s*1440px;[^}]*min-height:\s*5200px;/s);
  assert.match(css, /\.hero\s*\{[^}]*top:\s*80px;[^}]*width:\s*1440px;[^}]*height:\s*624px;/s);
  assert.match(css, /\.about\s*\{[^}]*left:\s*135px;[^}]*top:\s*630px;[^}]*width:\s*1169px;[^}]*height:\s*300px;/s);
  assert.match(css, /\.connect\s*\{[^}]*left:\s*1px;[^}]*top:\s*3385px;[^}]*width:\s*1440px;[^}]*height:\s*827px;/s);
  assert.match(css, /\.footer-container\s*\{[^}]*left:\s*0;[^}]*top:\s*4212px;[^}]*width:\s*1440px;/s);
  assert.match(css, /font-family:\s*"SVN-Gilroy"/);

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
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.about\s*\{[^}]*top:\s*20px;[^}]*height:\s*354px;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.connect\s*\{[^}]*top:\s*0;[^}]*width:\s*100%;[^}]*height:\s*auto;/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.footer-container\s*\{[^}]*top:\s*0;[^}]*width:\s*100%;/s);
  assert.doesNotMatch(page, /function MobilePage|<MobilePage/);
  assert.equal((page.match(/className="desktop-canvas"/g) ?? []).length, 1);
  assert.match(page, /Vuốt để khám phá thêm/);
  assert.match(page, /const jobCategories: JobCategory\[\] = \[/);
  assert.match(page, /openCategory, setOpenCategory\] = useState\(jobCategories\[0\]\.id\)/);

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
