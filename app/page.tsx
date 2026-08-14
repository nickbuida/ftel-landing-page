"use client";

import React, { useRef, useState, useEffect } from "react";

// Types
type JobItem = {
  title: string;
  description: string;
  location: string;
  details: string[];
};

type JobCategory = {
  id: string;
  label: string;
  items: JobItem[];
};

type JourneyCard = {
  image: string;
  mobileImage: string;
  title: React.ReactNode;
  body: string;
};

function useSectionNavigation() {
  useEffect(() => {
    let animationFrame: number | null = null;
    let removeInterruptListeners = () => {};

    const stopAnimation = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      removeInterruptListeners();
    };

    const scrollTo = (top: number) => {
      stopAnimation();

      const start = window.scrollY;
      const distance = top - start;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion || Math.abs(distance) < 2) {
        window.scrollTo(0, top);
        return;
      }

      const duration = Math.min(650, Math.max(320, Math.abs(distance) * 0.18));
      const startedAt = performance.now();
      const interrupt = () => stopAnimation();
      const interruptEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

      interruptEvents.forEach((eventName) => {
        window.addEventListener(eventName, interrupt, { passive: true });
      });
      removeInterruptListeners = () => {
        interruptEvents.forEach((eventName) => {
          window.removeEventListener(eventName, interrupt);
        });
        removeInterruptListeners = () => {};
      };

      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, start + distance * eased);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
        } else {
          animationFrame = null;
          removeInterruptListeners();
        }
      };

      animationFrame = window.requestAnimationFrame(step);
    };

    const handleSectionClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const clickedElement = event.target instanceof Element ? event.target : null;
      const anchor = clickedElement?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (hash === null) return;

      const target = hash === "#" ? null : document.querySelector<HTMLElement>(hash);
      if (hash !== "#" && !target) return;

      event.preventDefault();

      const navigationOffset = window.matchMedia("(max-width: 767px)").matches ? 88 : 24;
      const targetTop = target
        ? Math.max(0, window.scrollY + target.getBoundingClientRect().top - navigationOffset)
        : 0;

      window.history.replaceState(null, "", hash || "#");
      scrollTo(targetTop);
    };

    document.addEventListener("click", handleSectionClick);
    return () => {
      document.removeEventListener("click", handleSectionClick);
      stopAnimation();
    };
  }, []);
}

function validateVietnamesePhone(value: string) {
  const normalized = value.replace(/[\s-]/g, "");
  if (!normalized) return "Vui lòng nhập số điện thoại.";
  if (!/^(?:0\d{9,10}|\+84\d{9,10})$/.test(normalized)) {
    return "Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10–11 chữ số.";
  }
  return "";
}

function validateEmail(value: string) {
  const normalized = value.trim();
  if (!normalized) return "Vui lòng nhập email.";
  if (!/^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]{2,}$/.test(normalized)) {
    return "Email phải có định dạng tên@domain.com.";
  }
  return "";
}

// Data
const journeyCards: JourneyCard[] = [
  {
    image: "/assets/card-internship.png",
    mobileImage: "/assets/mobile/internship-card-image.png",
    title: <>FPT Telecom<br />Internship</>,
    body: "Chương trình thực tập đa ngành đưa bạn vào các dự án thực tế cùng Mentor 1-1 để khởi đầu sự nghiệp vững chắc.",
  },
  {
    image: "/assets/card-tech.png",
    mobileImage: "/assets/mobile/technology-trainee-image.png",
    title: <>Sinh viên<br />công nghệ tập sự</>,
    body: "Chương trình tuyển dụng dành riêng cho sinh viên khối Công nghệ - Kỹ thuật với lộ trình phát triển thành nhân sự nòng cốt và thu nhập tới 150 triệu/năm",
  },
  {
    image: "/assets/card-leaders.png",
    mobileImage: "/assets/mobile/nextgen-leaders-image.png",
    title: <>Nextgen Leaders</>,
    body: "Chương trình tuyển dụng dành riêng cho sinh viên khối ngành Kinh tế với lộ trình đào tạo bứt phá thành thế hệ Quản lý kế cận tại FTEL.",
  },
  {
    image: "/assets/card-careerfair.png",
    mobileImage: "/assets/mobile/career-fair-image.png",
    title: <>Career talk<br />& Hội thảo định hướng</>,
    body: "Chuỗi hội thảo hướng nghiệp trực tiếp tại giảng đường giúp bạn nắm bắt xu hướng thị trường và bí kíp săn job chất.",
  },
  {
    image: "/assets/card-tour.png",
    mobileImage: "/assets/mobile/fpt-tour-image.png",
    title: <>FPT Tour</>,
    body: "Thăm quan văn phòng công nghệ xịn mịn, trải nghiệm thực tế văn hóa sáng tạo.",
  },
  {
    image: "/assets/card-university.png",
    mobileImage: "/assets/mobile/university-partnership-image.png",
    title: <>Hợp tác cùng<br />các trường đại học</>,
    body: "Ký kết MOU chiến lược cùng hàng loạt trường Đại học, Cao đẳng, đồng hành bền vững cùng sinh viên qua đa dạng các hoạt động.",
  },
];

const technologyJobs: JobItem[] = [
  {
    title: "Developer",
    description: "Tham gia phát triển và hoàn thiện các chức năng phần mềm theo phân công của đội ngũ.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Tham gia phát triển và hoàn thiện các chức năng phần mềm theo phân công của đội ngũ.",
      "Hỗ trợ xử lý logic nghiệp vụ, làm việc với giao diện, hệ thống backend hoặc cơ sở dữ liệu tùy theo dự án.",
      "Kiểm thử, phát hiện lỗi, sửa lỗi và tối ưu chất lượng sản phẩm.",
      "Làm quen với quy trình phát triển phần mềm, công cụ làm việc nhóm và công nghệ thực tế trong dự án.",
    ],
  },
  {
    title: "Data",
    description: "Xử lý, phân tích dữ liệu và xây dựng report/dashboard theo dõi KPI.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Xử lý, phân tích dữ liệu và xây dựng report/dashboard theo dõi KPI.",
      "Hỗ trợ xây dựng pipeline, ETL/ELT và làm việc với dữ liệu lớn.",
      "Kiểm tra chất lượng dữ liệu, phát hiện bất thường và đề xuất insight.",
      "Ứng dụng AI/LLM để hỗ trợ xử lý dữ liệu và tối ưu báo cáo.",
    ],
  },
  {
    title: "AI",
    description: "Tham gia nghiên cứu, xây dựng và tối ưu các mô hình, tính năng AI theo nhu cầu dự án.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Tham gia nghiên cứu, xây dựng và tối ưu các mô hình, tính năng AI theo nhu cầu dự án.",
      "Hỗ trợ xử lý dữ liệu, huấn luyện, đánh giá và cải thiện hiệu quả mô hình.",
      "Phối hợp cùng các đội ngũ liên quan để tích hợp giải pháp AI vào sản phẩm thực tế.",
      "Tìm hiểu và thử nghiệm các công nghệ AI mới để đề xuất hướng ứng dụng phù hợp.",
    ],
  },
  {
    title: "IC Design",
    description: "Tham gia thiết kế và phát triển các khối IP/phần cứng số theo yêu cầu dự án.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Tham gia thiết kế và phát triển các khối IP/phần cứng số theo yêu cầu dự án.",
      "Hỗ trợ viết, kiểm tra và hoàn thiện mã mô tả phần cứng.",
      "Tham gia kiểm tra chất lượng thiết kế, phát hiện lỗi và đề xuất điều chỉnh.",
      "Làm quen với quy trình thiết kế vi mạch từ mô tả logic đến các bước triển khai tiếp theo.",
    ],
  },
  {
    title: "Embedded",
    description: "Tham gia phát triển firmware/phần mềm nhúng cho chip, vi điều khiển hoặc thiết bị phần cứng.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Tham gia phát triển firmware/phần mềm nhúng cho chip, vi điều khiển hoặc thiết bị phần cứng.",
      "Hỗ trợ lập trình, cấu hình và kiểm thử các chức năng giao tiếp, bộ nhớ và ngoại vi.",
      "Phối hợp bring-up, kiểm tra và xử lý lỗi trên board mạch hoặc phần cứng thật.",
      "Tìm hiểu RTOS, Embedded Linux và quy trình phát triển hệ thống nhúng trong dự án thực tế.",
    ],
  },
];

const officeJobs: JobItem[] = [
  {
    title: "Truyền thông",
    description: "Tham gia xây dựng và triển khai nội dung trên các kênh truyền thông của công ty.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Tham gia xây dựng và triển khai nội dung trên các kênh truyền thông của công ty.",
      "Hỗ trợ viết bài, biên tập nội dung, chụp ảnh/quay dựng cơ bản cho các hoạt động và chiến dịch truyền thông.",
      "Phối hợp với các đơn vị liên quan để thu thập thông tin, phát triển ý tưởng và sản xuất nội dung.",
      "Theo dõi hiệu quả nội dung, cập nhật xu hướng và đề xuất cách làm truyền thông phù hợp.",
    ],
  },
  {
    title: "Nhân sự",
    description: "Tham gia hỗ trợ các nghiệp vụ nhân sự như tuyển dụng, đào tạo, chính sách, phúc lợi hoặc quan hệ lao động.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Tham gia hỗ trợ các nghiệp vụ nhân sự như tuyển dụng, đào tạo, chính sách, phúc lợi hoặc quan hệ lao động.",
      "Phối hợp triển khai các hoạt động thu hút, phát triển và gắn kết nhân sự theo kế hoạch của đơn vị.",
      "Hỗ trợ tổng hợp dữ liệu, chuẩn bị báo cáo và cập nhật thông tin nhân sự trên các hệ thống liên quan.",
      "Tham gia xây dựng, cải tiến quy trình và trải nghiệm nhân viên trong quá trình làm việc tại FPT Telecom.",
    ],
  },
  {
    title: "Thiết kế",
    description: "Tham gia thiết kế các ấn phẩm truyền thông, hình ảnh thương hiệu và tài liệu phục vụ hoạt động của FPT Telecom.",
    location: "Hà Nội - Hồ Chí Minh",
    details: [
      "Tham gia thiết kế các ấn phẩm truyền thông, hình ảnh thương hiệu và tài liệu phục vụ hoạt động của FPT Telecom.",
      "Hỗ trợ phát triển ý tưởng hình ảnh, bố cục, màu sắc và phong cách thiết kế theo từng chiến dịch.",
      "Phối hợp với các bộ phận liên quan để chỉnh sửa, hoàn thiện sản phẩm thiết kế đúng mục tiêu và tiến độ.",
      "Cập nhật xu hướng thiết kế, đề xuất ý tưởng sáng tạo nhằm nâng cao chất lượng hình ảnh truyền thông.",
    ],
  },
];

const businessJobs: JobItem[] = [
  {
    title: "Kỹ thuật viên",
    description: "Triển khai và bảo trì đường truyền Internet, Truyền hình FPT Play và Camera tại nhà khách hàng.",
    location: "Toàn quốc",
    details: [
      "Triển khai và bảo trì đường truyền Internet, Truyền hình FPT Play và Camera tại nhà khách hàng.",
      "Hỗ trợ xử lý sự cố kỹ thuật và bảo đảm chất lượng dịch vụ tại từng điểm chạm.",
      "Kiểm tra, sửa chữa hệ thống viễn thông và thu hồi thiết bị khi khách hàng ngừng sử dụng dịch vụ.",
      "Hỗ trợ thu cước, tư vấn phương thức thanh toán và chăm sóc khách hàng trên địa bàn phụ trách.",
      "Thực hiện các nhiệm vụ khác theo phân công của trưởng bộ phận.",
    ],
  },
  {
    title: "Nhân viên Kinh doanh",
    description: "Tìm kiếm, tiếp cận và xây dựng mối quan hệ với khách hàng tiềm năng.",
    location: "Toàn quốc",
    details: [
      "Tìm kiếm, tiếp cận và xây dựng mối quan hệ với khách hàng tiềm năng.",
      "Tư vấn các dịch vụ Internet, Truyền hình FPT Play và Camera phù hợp với nhu cầu khách hàng.",
      "Tạo trải nghiệm cá nhân hóa tại các điểm tiếp xúc online và offline.",
      "Đàm phán, thương lượng và thực hiện thủ tục ký kết hợp đồng với khách hàng.",
    ],
  },
  {
    title: "Dịch vụ khách hàng",
    description: "Quản lý dòng tiền, theo dõi thanh toán và phối hợp cùng đội nhóm để đạt chỉ tiêu thu hồi công nợ.",
    location: "Toàn quốc",
    details: [
      "Quản lý dòng tiền, theo dõi thanh toán và phối hợp cùng đội nhóm để đạt chỉ tiêu thu hồi công nợ.",
      "Tiếp nhận, giải đáp thắc mắc hoặc khiếu nại của khách hàng liên quan đến cước dịch vụ.",
      "Chủ động chăm sóc, tư vấn gói dịch vụ, dịch vụ cộng thêm và chương trình ưu đãi phù hợp.",
      "Kiểm tra hợp đồng, cập nhật chính xác thông tin khách hàng và xử lý các thủ tục chuyển đổi, đổi chủ hoặc thanh lý.",
      "Xác minh thực tế tại địa chỉ khách hàng khi có yêu cầu.",
    ],
  },
];

const jobCategories: JobCategory[] = [
  { id: "technology", label: "Công nghệ - Bán dẫn", items: technologyJobs },
  { id: "office", label: "Văn phòng", items: officeJobs },
  { id: "business", label: "Kinh doanh - Dịch vụ - Kỹ thuật", items: businessJobs },
];

const graduationYears = Array.from({ length: 10 }, (_, index) => 2026 + index);

// Helper UI Components
function PillButton({ children, blue = false, type = "button", onClick }: { children: React.ReactNode; blue?: boolean; type?: "button" | "submit"; onClick?: () => void }) {
  return (
    <button type={type} className={`pill-button ${blue ? "pill-blue" : "pill-orange"}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

// Interface and brand icons
function IconLocation() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z" fill="#353B40" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <span className="brand-icon brand-icon-facebook" aria-hidden="true">
      <img src="/assets/icons/facebook-f.svg" alt="" />
    </span>
  );
}

function IconTikTok() {
  return (
    <span className="brand-icon brand-icon-tiktok" aria-hidden="true">
      <img src="/assets/icons/tiktok.svg" alt="" />
    </span>
  );
}

function IconLinkedIn() {
  return (
    <span className="brand-icon brand-icon-linkedin" aria-hidden="true">
      <img src="/assets/icons/linkedin-in.svg" alt="" />
    </span>
  );
}

function IconPhone() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#0995FF"/>
      <path d="M7.5 4.5H16.5C17.3 4.5 18 5.2 18 6V18C18 18.8 17.3 19.5 16.5 19.5H7.5C6.7 19.5 6 18.8 6 18V6C6 5.2 6.7 4.5 7.5 4.5ZM12 18C12.4 18 12.8 17.6 12.8 17.2C12.8 16.8 12.4 16.4 12 16.4C11.6 16.4 11.2 16.8 11.2 17.2C11.2 17.6 11.6 18 12 18Z" fill="white"/>
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#39B5FF"/>
      <path d="M5.5 7.5H18.5C19.05 7.5 19.5 7.95 19.5 8.5V16.5C19.5 17.05 19.05 17.5 18.5 17.5H5.5C4.95 17.5 4.5 17.05 4.5 16.5V8.5C4.5 7.95 4.95 7.5 5.5 7.5ZM12 12.8L6.2 8.5H17.8L12 12.8ZM6 10.1V16H18V10.1L12.4 14.2C12.15 14.4 11.85 14.4 11.6 14.2L6 10.1Z" fill="white"/>
    </svg>
  );
}

// Components
function Navigation({ onOpenAuth }: { onOpenAuth: (mode: "login" | "register") => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navigation">
      <div className="nav-inner">
        <a href="#" aria-label="FPT Telecom Homepage">
          <picture>
            <source media="(max-width: 767px)" srcSet="/assets/mobile/fpt-logo.png" />
            <img className="logo" src="/assets/logo.png" alt="FPT Telecom" />
          </picture>
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <img src="/assets/mobile/menu-group.svg" alt="" />
        </button>

        <nav className={`nav-links ${menuOpen ? "mobile-open" : ""}`} aria-label="Điều hướng chính">
          <a href="#jobs" onClick={() => setMenuOpen(false)}>Việc làm</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            Về chúng tôi <img src="/assets/caret.svg" alt="" />
          </a>
          <a href="#journey" onClick={() => setMenuOpen(false)}>
            Life at FTEL <img src="/assets/caret.svg" alt="" />
          </a>
          <a href="#footer" onClick={() => setMenuOpen(false)}>
            Tin tức &amp; Sự kiện <img src="/assets/caret.svg" alt="" />
          </a>
        </nav>

        <div className="account-actions">
          <button type="button" className="register" onClick={() => onOpenAuth("register")}>
            Đăng ký
          </button>
          <button type="button" className="login" onClick={() => onOpenAuth("login")}>
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-back">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/hero-background.png" />
          <img src="/assets/hero-back.png" alt="" />
        </picture>
      </div>

      <div className="hero-title">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/hero-headline.png" />
          <img src="/assets/hero-headline.png" alt="FPT Telecom Career Booming" />
        </picture>
      </div>

      <div className="hero-subtitle">
        Khám phá vũ trụ cơ hội nghề nghiệp, chương trình thực tập thực chiến và hành trình phát triển dành riêng cho sinh viên tại FPT Telecom.
      </div>

      <div className="hero-cta">
        <a href="#connect" style={{ textDecoration: "none" }}>
          <PillButton>Để lại thông tin ngay</PillButton>
        </a>
      </div>

      <picture>
        <source media="(max-width: 767px)" srcSet="/assets/mobile/hero-person.png" />
        <img className="hero-people" src="/assets/hero-people.png" alt="Sinh viên FPT Telecom" />
      </picture>
    </section>
  );
}

function DecorativeBackground() {
  return (
    <div className="decorative-background" aria-hidden="true">
      <div className="background-gradient" />
      <picture>
        <source media="(max-width: 767px)" srcSet="/assets/mobile/building.png" />
        <img className="background-buildings" src="/assets/bg-buildings.png" alt="" />
      </picture>
      <div className="background-pattern">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/pattern-1.png" />
          <img src="/assets/bg-pattern.png" alt="" />
        </picture>
      </div>
      <img className="background-cloud-left" src="/assets/bg-clouds.png" alt="" />
      <img className="background-cloud-right" src="/assets/bg-clouds.png" alt="" />
      <img className="background-job-cloud-left" src="/assets/bg-clouds.png" alt="" />
      <img className="background-job-cloud-right" src="/assets/bg-cloud-right.png" alt="" />
      <img className="background-cloud-bottom" src="/assets/bg-bottom.png" alt="" />
      <div className="background-plane">
        <img src="/assets/paper-plane.png" alt="" />
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <picture>
        <source media="(max-width: 767px)" srcSet="/assets/mobile/brand-pattern-left.png" />
        <img className="about-pattern about-pattern-left" src="/assets/pattern3.png" alt="" />
      </picture>
      <picture>
        <source media="(max-width: 767px)" srcSet="/assets/mobile/brand-pattern-right.png" />
        <img className="about-pattern about-pattern-right" src="/assets/pattern4.png" alt="" />
      </picture>

      <div className="about-title">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/brand-headline.png" />
          <img src="/assets/section2-headline.png" alt="Về FPT Telecom" />
        </picture>
      </div>

      <div className="trust-bar">
        <div className="stat-cyan">
          <strong>34</strong>
          <span>Tỉnh thành</span>
        </div>
        <i />
        <div className="stat-orange">
          <strong>10K+</strong>
          <span>Nhân sự</span>
        </div>
        <i />
        <div className="stat-orange">
          <strong>19.5 TỶ</strong>
          <span>Doanh thu</span>
        </div>
      </div>

      <p>
        Bệ phóng công nghệ hàng đầu<br />
        Môi trường thực chiến lý tưởng dành cho Gen Z
      </p>

      <img className="mobile-about-ellipse" src="/assets/mobile/decorative-ellipse.svg" alt="" />
    </section>
  );
}

function Privileges() {
  const cards = [
    {
      desktopImage: "/assets/privilege-1.png",
      mobileImage: "/assets/mobile/benefit-image-1.png",
      title: "Học từ thực tế",
      body: "Đội ngũ đồng hành, được tham gia công việc và dự án thực tế.",
    },
    {
      desktopImage: "/assets/privilege-2.png",
      mobileImage: "/assets/mobile/benefit-image-2.png",
      title: "Lộ trình rõ ràng",
      body: "Cơ hội phát triển dài hạn và trở thành nhân viên chính thức theo năng lực.",
    },
    {
      desktopImage: "/assets/privilege-3.png",
      mobileImage: "/assets/mobile/benefit-image-3.png",
      title: "Trải nghiệm khác biệt",
      body: "Văn hóa không khoảng cách và chuỗi hoạt động gắn kết nội bộ giàu năng lượng.",
    },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>(".privilege-card");
    const cardStep = (firstCard?.offsetWidth ?? 310) + 16;
    setActive(Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / cardStep))));
  };

  useEffect(() => {
    const track = trackRef.current;
    if (
      autoPaused ||
      !track ||
      track.clientWidth >= 600 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      const firstCard = track.querySelector<HTMLElement>(".privilege-card");
      const cardStep = (firstCard?.offsetWidth ?? 310) + 16;
      const cardCount = track.querySelectorAll(".privilege-card").length;
      const nextIndex = active >= cardCount - 1 ? 0 : active + 1;

      setActive(nextIndex);
      track.scrollTo({ left: nextIndex * cardStep, behavior: "smooth" });
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [active, autoPaused]);

  return (
    <section
      className="privileges"
      onMouseEnter={() => setAutoPaused(true)}
      onMouseLeave={() => setAutoPaused(false)}
      onFocusCapture={() => setAutoPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setAutoPaused(false);
        }
      }}
    >
      <div className="privilege-title">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/benefits-headline.png" />
          <img src="/assets/privilege-headline.png" alt="Đặc quyền thực tế bạn nhận được" />
        </picture>
      </div>

      <div className="privilege-cards" ref={trackRef} onScroll={handleScroll}>
        {cards.map((card) => (
          <article className="privilege-card" key={card.title} style={{ backgroundImage: `url(${card.desktopImage})` }}>
            <picture className="mobile-privilege-photo">
              <img src={card.mobileImage} alt="" />
            </picture>
            <div className="privilege-shade" />
            <div className="privilege-copy">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mobile-pagination" aria-label={`Trang ${active + 1} trên ${cards.length}`}>
        {cards.map((_, idx) => (
          <span key={idx} className={idx === active ? "active" : ""} />
        ))}
      </div>

      <div className="mobile-swipe-hint">
        <span>Vuốt để khám phá thêm</span>
        <img src="/assets/mobile/arrow-right.svg" alt="" />
      </div>
    </section>
  );
}

function Journey() {
  const [start, setStart] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const desktopVisibleCards = 3;
  const desktopMaxStart = journeyCards.length - desktopVisibleCards;
  const desktopStart = Math.min(start, desktopMaxStart);
  const atDesktopStart = desktopStart === 0;
  const atDesktopEnd = desktopStart === desktopMaxStart;

  useEffect(() => {
    if (autoPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const isMobile = carousel.clientWidth < 600;
      const firstCard = carousel.querySelector<HTMLElement>(".journey-card");
      const itemWidth = isMobile ? (firstCard?.offsetWidth ?? 310) + 16 : 400;
      const maxStart = isMobile ? journeyCards.length - 1 : desktopMaxStart;
      const currentStart = Math.min(start, maxStart);
      const nextIndex = currentStart >= maxStart ? 0 : currentStart + 1;

      setStart(nextIndex);
      carousel.scrollTo({
        left: nextIndex * itemWidth,
        behavior: "smooth",
      });
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [autoPaused, desktopMaxStart, start]);

  const moveCarousel = (step: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const isMobile = carousel.clientWidth < 600;
    const firstCard = carousel.querySelector<HTMLElement>(".journey-card");
    const itemWidth = isMobile ? (firstCard?.offsetWidth ?? 310) + 16 : 400;
    const maxStart = isMobile ? journeyCards.length - 1 : desktopMaxStart;
    const nextIndex = Math.max(0, Math.min(maxStart, start + step));
    setStart(nextIndex);
    carousel.scrollTo({
      left: nextIndex * itemWidth,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="journey"
      id="journey"
      onMouseEnter={() => setAutoPaused(true)}
      onMouseLeave={() => setAutoPaused(false)}
      onFocusCapture={() => setAutoPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setAutoPaused(false);
        }
      }}
    >
      <div className="journey-heading">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/journey-headline.png" />
          <img src="/assets/journey-headline.png" alt="Hành trình đồng hành kiến tạo tương lai" />
        </picture>
      </div>

      <p className="journey-subtitle">
        Đa dạng hoạt động trải nghiệm dành cho sinh viên với các chương trình tài năng trẻ và lộ trình fast-track bứt phá sự nghiệp.
      </p>

      <button
        className="carousel-arrow carousel-left"
        type="button"
        aria-label="Chương trình trước"
        onClick={() => moveCarousel(-1)}
        disabled={atDesktopStart}
      >
        <img src="/assets/chevron-left.svg" alt="" />
      </button>

      <div
        className={`journey-cards ${atDesktopStart ? "fade-right" : atDesktopEnd ? "fade-left" : "fade-both"}`}
        ref={carouselRef}
        onScroll={(e) => {
          const isMobile = e.currentTarget.clientWidth < 600;
          const firstCard = e.currentTarget.querySelector<HTMLElement>(".journey-card");
          const step = isMobile ? (firstCard?.offsetWidth ?? 310) + 16 : 400;
          const maxStart = isMobile ? journeyCards.length - 1 : desktopMaxStart;
          setStart(Math.min(maxStart, Math.round(e.currentTarget.scrollLeft / step)));
        }}
      >
        {journeyCards.map((card, idx) => (
          <article
            className={card.image === "/assets/card-tour.png" ? "journey-card journey-card-tour" : "journey-card"}
            key={idx}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={card.mobileImage} />
              <img className="journey-photo" src={card.image} alt="" />
            </picture>
            <div className="journey-overlay" />
            <img className="journey-pattern" src="/assets/card-pattern.png" alt="" />
            <div className="journey-copy">
              <h3>{card.title}</h3>
              <hr />
              <p>{card.body}</p>
            </div>
          </article>
        ))}
      </div>

      <button
        className="carousel-arrow carousel-right"
        type="button"
        aria-label="Chương trình tiếp theo"
        onClick={() => moveCarousel(1)}
        disabled={atDesktopEnd}
      >
        <img src="/assets/chevron-right.svg" alt="" />
      </button>

      <div className="dots" role="group" aria-label="Vị trí băng chuyền chương trình">
        {Array.from({ length: desktopMaxStart + 1 }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index === desktopStart ? "active" : ""}
            aria-label={`Hiển thị chương trình ${index + 1} đến ${index + desktopVisibleCards}`}
            aria-current={index === desktopStart ? "true" : undefined}
            onClick={() => moveCarousel(index - desktopStart)}
          />
        ))}
      </div>

      <div className="mobile-journey-pagination" role="group" aria-label="Vị trí chương trình trên thiết bị di động">
        {journeyCards.map((_, index) => (
          <button
            type="button"
            key={index}
            className={index === start ? "active" : ""}
            aria-label={`Hiển thị chương trình ${index + 1} trên ${journeyCards.length}`}
            aria-current={index === start ? "true" : undefined}
            onClick={() => moveCarousel(index - start)}
          />
        ))}
      </div>

      <div className="mobile-swipe-hint">
        <span>Vuốt để khám phá thêm</span>
        <img src="/assets/mobile/arrow-right.svg" alt="" />
      </div>
    </section>
  );
}

function JobCard({ item, onSelectJob }: { item: JobItem; onSelectJob: (job: JobItem) => void }) {
  return (
    <article className="job-card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="job-meta">
        <span>
          <IconLocation /> {item.location || "Hà Nội - Hồ Chí Minh"}
        </span>
        <button type="button" onClick={() => onSelectJob(item)}>
          Xem JD ngay
        </button>
      </div>
    </article>
  );
}

function MobileJobCard({ item, onSelectJob }: { item: JobItem; onSelectJob: (job: JobItem) => void }) {
  return (
    <article className="mobile-job-card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="mobile-job-meta">
        <span>
          <IconLocation /> {item.location || "Hà Nội - Hồ Chí Minh"}
        </span>
        <button type="button" onClick={() => onSelectJob(item)}>
          Xem JD ngay
        </button>
      </div>
    </article>
  );
}

function Jobs({ onSelectJob }: { onSelectJob: (job: JobItem) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [openCategory, setOpenCategory] = useState(jobCategories[0].id);

  const activeCategory = jobCategories[activeTab] || jobCategories[0];

  return (
    <section className="jobs" id="jobs">
      <div className="jobs-heading">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/jobs-headline.png" />
          <img src="/assets/jobs-headline.png" alt="Vũ trụ nghề nghiệp tại FPT Telecom" />
        </picture>
      </div>

      <p className="jobs-subtitle">
        Mở ra đa dạng cơ hội việc làm và lộ trình phát triển sự nghiệp tại khắp các tỉnh thành trên toàn quốc.
      </p>

      {/* Desktop Tabs */}
      <div className="job-tabs" role="tablist" aria-label="Danh mục việc làm">
        {jobCategories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`job-panel-${category.id}`}
            id={`job-tab-${category.id}`}
            className={activeTab === index ? "active" : ""}
            onClick={() => setActiveTab(index)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Desktop Grid */}
      <div
        className="job-grid"
        role="tabpanel"
        id={`job-panel-${activeCategory.id}`}
        aria-labelledby={`job-tab-${activeCategory.id}`}
      >
        {activeCategory.items.map((item) => (
          <JobCard key={item.title} item={item} onSelectJob={onSelectJob} />
        ))}
      </div>

      {/* Mobile Accordion */}
      <div className="mobile-job-accordion">
        {jobCategories.map((category) => {
          const expanded = openCategory === category.id;
          return (
            <div className={`mobile-job-category ${expanded ? "expanded" : ""}`} key={category.id}>
              <button
                type="button"
                className="mobile-job-category-header"
                aria-expanded={expanded}
                aria-controls={`mobile-job-panel-${category.id}`}
                id={`mobile-job-header-${category.id}`}
                onClick={() => setOpenCategory((current) => (current === category.id ? "" : category.id))}
              >
                <span>{category.label}</span>
                <img
                  src={expanded ? "/assets/mobile/minus.svg" : "/assets/mobile/plus.svg"}
                  alt=""
                />
              </button>
              {expanded && (
                <div
                  className="mobile-job-list"
                  id={`mobile-job-panel-${category.id}`}
                  role="region"
                  aria-labelledby={`mobile-job-header-${category.id}`}
                >
                  {category.items.map((item) => (
                    <MobileJobCard key={item.title} item={item} onSelectJob={onSelectJob} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <a
        className="pill-button pill-blue"
        href="https://fptjobs.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Xem tất cả việc làm</span>
      </a>
    </section>
  );
}

function Connect({
  onShowToast,
  preferredPosition,
  onPreferredPositionChange,
}: {
  onShowToast: (msg: string) => void;
  preferredPosition: string;
  onPreferredPositionChange: (position: string) => void;
}) {
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ phone: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = {
      phone: validateVietnamesePhone(phone),
      email: validateEmail(email),
    };
    setFieldErrors(nextErrors);

    if (nextErrors.phone || nextErrors.email) {
      document.getElementById(nextErrors.phone ? "connect-phone" : "connect-email")?.focus();
      return;
    }

    setSubmitted(true);
    onShowToast("🎉 Cảm ơn bạn! Đã gửi thông tin đăng ký thành công.\nĐội ngũ Tuyển dụng FPT Telecom sẽ liên hệ bạn sớm nhất!");
  };

  const updatePhone = (value: string) => {
    setPhone(value);
    if (fieldErrors.phone) {
      setFieldErrors((current) => ({ ...current, phone: validateVietnamesePhone(value) }));
    }
  };

  const updateEmail = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((current) => ({ ...current, email: validateEmail(value) }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section className={`connect ${submitted ? "submitted" : ""}`} id="connect">
      <picture>
        <source media="(max-width: 767px)" srcSet="/assets/mobile/form-background.png" />
        <img className="connect-back" src="/assets/form-back.png" alt="" />
      </picture>

      <div className="connect-tint" />

      <div className="connect-heading">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/mobile/form-header.png" />
          <img src="/assets/form-headline.png" alt="10 giây kết nối Bật sáng tương lai" />
        </picture>
      </div>

      <p className="connect-subtitle">
        Để lại thông tin ngay, đội ngũ Tuyển dụng sẽ gửi đến<br className="mobile-connect-break" /> bạn những cơ hội đo ni đóng giày theo đúng ngành học!
      </p>

      <form className="connect-form" id="connect-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Họ và tên *</span>
          <input required placeholder="Nguyễn Văn A" />
        </label>

        <label className={`form-field ${fieldErrors.phone ? "has-error" : ""}`}>
          <span>Số điện thoại *</span>
          <input
            id="connect-phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            pattern="(?:0[0-9](?:[ -]?[0-9]){8,9}|\+84[0-9](?:[ -]?[0-9]){8,9})"
            placeholder="0987654321"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby="connect-phone-error"
            onChange={(event) => updatePhone(event.target.value)}
            onBlur={() => setFieldErrors((current) => ({ ...current, phone: validateVietnamesePhone(phone) }))}
            onInvalid={() => setFieldErrors((current) => ({ ...current, phone: validateVietnamesePhone(phone) }))}
          />
          {fieldErrors.phone && <small className="form-error" id="connect-phone-error">{fieldErrors.phone}</small>}
        </label>

        <label className={`form-field ${fieldErrors.email ? "has-error" : ""}`}>
          <span>Email *</span>
          <input
            id="connect-email"
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            placeholder="example@gmail.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby="connect-email-error"
            onChange={(event) => updateEmail(event.target.value)}
            onBlur={() => setFieldErrors((current) => ({ ...current, email: validateEmail(email) }))}
            onInvalid={() => setFieldErrors((current) => ({ ...current, email: validateEmail(email) }))}
          />
          {fieldErrors.email && <small className="form-error" id="connect-email-error">{fieldErrors.email}</small>}
        </label>

        <label className="form-field">
          <span>Trường đại học/ cao đẳng *</span>
          <input required placeholder="Đại học FPT, Bách Khoa..." />
        </label>

        <label className="form-field">
          <span>Thời gian dự kiến tốt nghiệp *</span>
          <div className="graduation-selects">
            <select required defaultValue="" aria-label="Ngày tốt nghiệp dự kiến">
              <option value="" disabled>Ngày</option>
              {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                <option value={day} key={day}>{day}</option>
              ))}
            </select>
            <select required defaultValue="" aria-label="Tháng tốt nghiệp dự kiến">
              <option value="" disabled>Tháng</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                <option value={month} key={month}>Tháng {month}</option>
              ))}
            </select>
            <select required defaultValue="" aria-label="Năm tốt nghiệp dự kiến">
              <option value="" disabled>Năm</option>
              {graduationYears.map((year) => <option value={year} key={year}>{year}</option>)}
            </select>
          </div>
        </label>

        <label className="form-field">
          <span>Khu vực mong muốn làm việc *</span>
          <select defaultValue="" required>
            <option value="" disabled>
              Lựa chọn...
            </option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="An Giang">An Giang</option>
            <option value="Bắc Ninh">Bắc Ninh</option>
            <option value="Cà Mau">Cà Mau</option>
            <option value="Cao Bằng">Cao Bằng</option>
            <option value="TP. Cần Thơ">TP. Cần Thơ</option>
            <option value="TP. Đà Nẵng">TP. Đà Nẵng</option>
            <option value="Đắk Lắk">Đắk Lắk</option>
            <option value="Điện Biên">Điện Biên</option>
            <option value="Đồng Nai">Đồng Nai</option>
            <option value="Đồng Tháp">Đồng Tháp</option>
            <option value="Gia Lai">Gia Lai</option>
            <option value="Hà Tĩnh">Hà Tĩnh</option>
            <option value="TP. Hải Phòng">TP. Hải Phòng</option>
            <option value="TP. Huế">TP. Huế</option>
            <option value="Hưng Yên">Hưng Yên</option>
            <option value="Khánh Hòa">Khánh Hòa</option>
            <option value="Lai Châu">Lai Châu</option>
            <option value="Lâm Đồng">Lâm Đồng</option>
            <option value="Lạng Sơn">Lạng Sơn</option>
            <option value="Lào Cai">Lào Cai</option>
            <option value="Nghệ An">Nghệ An</option>
            <option value="Ninh Bình">Ninh Bình</option>
            <option value="Phú Thọ">Phú Thọ</option>
            <option value="Quảng Ngãi">Quảng Ngãi</option>
            <option value="Quảng Ninh">Quảng Ninh</option>
            <option value="Quảng Trị">Quảng Trị</option>
            <option value="Sơn La">Sơn La</option>
            <option value="Tây Ninh">Tây Ninh</option>
            <option value="Thái Nguyên">Thái Nguyên</option>
            <option value="Thanh Hóa">Thanh Hóa</option>
            <option value="Tuyên Quang">Tuyên Quang</option>
            <option value="Vĩnh Long">Vĩnh Long</option>
          </select>
        </label>

        <label className="form-field">
          <span>Vị trí mong muốn ứng tuyển *</span>
          <select
            value={preferredPosition}
            onChange={(event) => onPreferredPositionChange(event.target.value)}
            required
          >
            <option value="" disabled>
              Lựa chọn...
            </option>
            <option value="Developer">Developer</option>
            <option value="Data">Data</option>
            <option value="AI">AI</option>
            <option value="IC Design">IC Design</option>
            <option value="Embedded">Embedded</option>
            <option value="Truyền thông">Truyền thông</option>
            <option value="Nhân sự">Nhân sự</option>
            <option value="Thiết kế">Thiết kế</option>
            <option value="Kỹ thuật viên">Kỹ thuật viên</option>
            <option value="Nhân viên Kinh doanh">Nhân viên Kinh doanh</option>
            <option value="Dịch vụ khách hàng">Dịch vụ khách hàng</option>
            <option value="Khác">Khác</option>
          </select>
        </label>

        <label className="form-field upload-field">
          <span>Upload CV</span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} aria-label="Upload CV" />
          <b>{fileName ? `✓ ${fileName}` : "Upload"}</b>
        </label>
      </form>

      <label className="consent">
        <input type="checkbox" defaultChecked required />
        <span>Tôi đồng ý nhận thông tin việc làm và các cơ hội sự nghiệp từ FPT Telecom.</span>
      </label>

      <div className="connect-submit">
        <PillButton type="submit" onClick={() => {
          const form = document.getElementById("connect-form") as HTMLFormElement;
          if (form) form.requestSubmit();
        }}>
          {submitted ? "Đã gửi thông tin" : "Để lại thông tin ngay"}
        </PillButton>
      </div>
    </section>
  );
}

function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (name: string) => {
    setOpenSection((curr) => (curr === name ? null : name));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-container" id="footer">
      {/* Contact Box ("Kết nối với chúng tôi") */}
      <section className="contact-section">
        <h2 className="contact-title">
          <span className="emoji" role="img" aria-label="party">🥳</span> Kết nối với chúng tôi
        </h2>
        <div className="contact-card">
          <div className="contact-grid">
            <a href="https://fpt.vn" target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="contact-icon"><IconLocation /></span>
              <div className="contact-info">
                <strong>Văn phòng giao dịch</strong>
                <span>FPT Telecom</span>
              </div>
            </a>

            <a href="https://www.facebook.com/fpttelecom" target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="contact-icon"><IconFacebook /></span>
              <div className="contact-info">
                <strong>Tuyển dụng FPT Telecom</strong>
                <span>Facebook</span>
              </div>
            </a>

            <a href="https://www.tiktok.com/@tuyendungfpttelecom" target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="contact-icon"><IconTikTok /></span>
              <div className="contact-info">
                <strong>Nhà Cáo</strong>
                <span>TikTok</span>
              </div>
            </a>

            <a href="https://www.linkedin.com/company/fpt-telecom" target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="contact-icon"><IconLinkedIn /></span>
              <div className="contact-info">
                <strong>FPT Telecom</strong>
                <span>LinkedIn</span>
              </div>
            </a>

            <a href="tel:02873002222" className="contact-item">
              <span className="contact-icon"><IconPhone /></span>
              <div className="contact-info">
                <strong>028 7300 2222</strong>
                <span>Phone</span>
              </div>
            </a>

            <a href="mailto:ftelhr.tuyendung@fpt.com" className="contact-item">
              <span className="contact-icon"><IconEmail /></span>
              <div className="contact-info">
                <strong>ftelhr.tuyendung@fpt.com</strong>
                <span>Email</span>
              </div>
            </a>
          </div>

          <div className="contact-mascot">
            <img src="/assets/footer-top.png" alt="Mascot FPT Telecom" className="mascot-img" />
          </div>
        </div>
      </section>

      {/* Main Corporate Footer */}
      <div className="footer-body">
        <div className="footer-left-bands" aria-hidden="true">
          <img src="/assets/footer-bottom.png" alt="" />
        </div>

        <div className="company-header-card">
          <img src="/assets/logo.png" alt="FPT Telecom" className="footer-logo" />
          <div className="company-titles">
            <h3>Công ty Cổ phần Viễn thông FPT</h3>
            <p>Ban Nhân sự</p>
          </div>
        </div>

        {/* Desktop Columns */}
        <div className="footer-columns-desktop">
          <div className="footer-col col-main">
            <h4>Trung tâm Thu hút Nguồn nhân lực</h4>
            <p>FPT Tower, số 10 Phạm Văn Bạch, phường Cầu Giấy, Hà Nội</p>
            <p>FPT Tân Thuận 2, KCX Tân Thuận, phường Tân Thuận, TP. Hồ Chí Minh</p>
            <p><a href="mailto:ftelhr.tuyendung@fpt.com">ftelhr.tuyendung@fpt.com</a></p>
            <p><a href="tel:02873002222">028 7300 2222</a></p>
          </div>

          <div className="footer-col">
            <h4>Về chúng tôi</h4>
            <ul>
              <li><a href="#about">Giới thiệu công ty</a></li>
              <li><a href="#journey">Tham quan văn phòng</a></li>
              <li><a href="#connect">Thông tin liên hệ</a></li>
              <li><a href="#connect">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Life at FTEL</h4>
            <ul>
              <li><a href="#journey">Hoạt động</a></li>
              <li><a href="#journey">Văn hoá đặc sắc</a></li>
              <li><a href="#journey">Phát triển sự nghiệp</a></li>
              <li><a href="#journey">Phúc lợi</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Tin tức &amp; Sự kiện</h4>
            <ul>
              <li><a href="#journey">Tin tức</a></li>
              <li><a href="#journey">Sự kiện</a></li>
            </ul>
          </div>
        </div>

        {/* Mobile Accordions */}
        <div className="footer-accordions-mobile">
          <div className="footer-accordion-item">
            <button type="button" className="accordion-toggle" onClick={() => toggleSection("hr")}>
              <span>Trung tâm Thu hút Nguồn nhân lực</span>
              <span>{openSection === "hr" ? "▲" : "▼"}</span>
            </button>
            {openSection === "hr" && (
              <div className="accordion-content">
                <p>FPT Tower, số 10 Phạm Văn Bạch, phường Cầu Giấy, Hà Nội</p>
                <p>FPT Tân Thuận 2, KCX Tân Thuận, phường Tân Thuận, TP. Hồ Chí Minh</p>
                <p>ftelhr.tuyendung@fpt.com</p>
                <p>028 7300 2222</p>
              </div>
            )}
          </div>

          <div className="footer-accordion-item">
            <button type="button" className="accordion-toggle" onClick={() => toggleSection("about")}>
              <span>Về chúng tôi</span>
              <span>{openSection === "about" ? "▲" : "▼"}</span>
            </button>
            {openSection === "about" && (
              <div className="accordion-content">
                <p>Giới thiệu công ty</p>
                <p>Tham quan văn phòng</p>
                <p>Thông tin liên hệ</p>
                <p>Câu hỏi thường gặp</p>
              </div>
            )}
          </div>

          <div className="footer-accordion-item">
            <button type="button" className="accordion-toggle" onClick={() => toggleSection("life")}>
              <span>Life at FTEL</span>
              <span>{openSection === "life" ? "▲" : "▼"}</span>
            </button>
            {openSection === "life" && (
              <div className="accordion-content">
                <p>Hoạt động</p>
                <p>Văn hoá đặc sắc</p>
                <p>Phát triển sự nghiệp</p>
                <p>Phúc lợi</p>
              </div>
            )}
          </div>

          <div className="footer-accordion-item">
            <button type="button" className="accordion-toggle" onClick={() => toggleSection("news")}>
              <span>Tin tức &amp; Sự kiện</span>
              <span>{openSection === "news" ? "▲" : "▼"}</span>
            </button>
            {openSection === "news" && (
              <div className="accordion-content">
                <p>Tin tức</p>
                <p>Sự kiện</p>
              </div>
            )}
          </div>

          <div className="footer-accordion-item">
            <button type="button" className="accordion-toggle" onClick={() => toggleSection("students")}>
              <span>Dành cho sinh viên</span>
              <span>{openSection === "students" ? "▲" : "▼"}</span>
            </button>
            {openSection === "students" && (
              <div className="accordion-content">
                <p>Chương trình thực tập</p>
                <p>FPT Tour</p>
                <p>Career Talk &amp; Hội thảo định hướng</p>
                <p>Hợp tác cùng các trường đại học</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Social & Meta Bar */}
        <div className="footer-meta-bar">
          <div className="meta-left">
            <span>Theo dõi các kênh chính thức<br className="mobile-meta-break" /> của FPT Telecom</span>
            <div className="social-icons">
              <a href="https://www.facebook.com/fpttelecom" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook /></a>
              <a href="https://www.tiktok.com/@tuyendungfpttelecom" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><IconTikTok /></a>
              <a href="https://www.linkedin.com/company/fpt-telecom" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedIn /></a>
              <a href="tel:02873002222" aria-label="028 7300 2222"><IconPhone /></a>
            </div>
          </div>

          <div className="meta-middle">
            <p>Hỗ trợ Khách hàng: <a href="mailto:hotrokhachhang@fpt.com">hotrokhachhang@fpt.com</a></p>
            <p>Hotline: <strong>1900 6600</strong></p>
          </div>
        </div>

        <div className="footer-bottom-copy">
          <p>Copyright © 2015. Official Website Tuyển dụng của Công ty Cổ phần Viễn thông FPT (FPT Telecom).</p>
        </div>
      </div>

      {/* Floating Back to Top */}
      <button className="back-to-top" type="button" aria-label="Về đầu trang" onClick={scrollToTop}>
        ↑
      </button>
    </footer>
  );
}

// Modals
function JobModal({
  job,
  onClose,
  onApply,
}: {
  job: JobItem | null;
  onClose: () => void;
  onApply: (position: string) => void;
}) {
  if (!job) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{job.title}</h2>
        <p className="modal-location"><IconLocation /> {job.location || "Hà Nội - Hồ Chí Minh"}</p>
        <hr className="modal-divider" />

        <h3>Mô tả công việc</h3>
        <ul>
          {job.details.map((detail, i) => <li key={i}>{detail}</li>)}
        </ul>

        <div className="modal-actions">
          <a href="#connect" onClick={() => onApply(job.title)} style={{ textDecoration: "none" }}>
            <PillButton>Ứng tuyển ngay</PillButton>
          </a>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ mode, onClose, onShowToast }: { mode: "login" | "register"; onClose: () => void; onShowToast: (msg: string) => void }) {
  const [activeMode, setActiveMode] = useState<"login" | "register">(mode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    onShowToast(activeMode === "login" ? "👋 Đăng nhập thành công!" : "🎉 Đăng ký tài khoản thành công!");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="auth-tabs">
          <button className={activeMode === "login" ? "active" : ""} onClick={() => setActiveMode("login")}>Đăng nhập</button>
          <button className={activeMode === "register" ? "active" : ""} onClick={() => setActiveMode("register")}>Đăng ký</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {activeMode === "register" && (
            <label className="auth-field">
              <span>Họ và tên</span>
              <input required placeholder="Nguyễn Văn A" />
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <input required type="email" placeholder="example@gmail.com" />
          </label>
          <label className="auth-field">
            <span>Mật khẩu</span>
            <input required type="password" placeholder="••••••••" />
          </label>

          <div style={{ marginTop: "20px" }}>
            <PillButton type="submit">
              {activeMode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
            </PillButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;

  return (
    <div className="toast-notification" role="status" aria-live="polite" aria-atomic="true">
      <div className="toast-copy">
        {message.split("\n").map((line) => <span key={line}>{line}</span>)}
      </div>
      <button type="button" aria-label="Đóng thông báo" onClick={onClose}>✕</button>
    </div>
  );
}

// Main Page Shell
export default function Home() {
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [preferredPosition, setPreferredPosition] = useState("");

  useSectionNavigation();

  return (
    <main className="page-shell">
      <div className="desktop-canvas">
        <Navigation onOpenAuth={(mode) => setAuthMode(mode)} />
        <Hero />
        <DecorativeBackground />
        <About />
        <Privileges />
        <Journey />
        <Jobs onSelectJob={(job) => setSelectedJob(job)} />
        <Connect
          onShowToast={(msg) => setToastMsg(msg)}
          preferredPosition={preferredPosition}
          onPreferredPositionChange={setPreferredPosition}
        />
        <Footer />
      </div>

      {/* Modals & Overlays */}
      <JobModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={(position) => {
          setPreferredPosition(position);
          setSelectedJob(null);
        }}
      />
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onShowToast={(msg) => setToastMsg(msg)}
        />
      )}
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
    </main>
  );
}
