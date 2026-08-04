"use client";

import React, { useRef, useState, useEffect } from "react";

// Types
type JobItem = {
  title: string;
  description: string;
  location?: string;
  type?: string;
  requirements?: string[];
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
  tag?: string;
  fullDetails?: string;
};

// Data
const journeyCards: JourneyCard[] = [
  {
    image: "/assets/card-internship.png",
    mobileImage: "/assets/mobile/internship-card-image.png",
    title: <>FPT Telecom<br />Internship</>,
    body: "Chương trình thực tập đa ngành đưa bạn vào các dự án thực tế cùng Mentor 1-1 để khởi đầu sự nghiệp vững chắc.",
    tag: "Thực tập 2026",
    fullDetails: "FPT Telecom Internship mang đến cơ hội trải nghiệm môi trường làm việc thực tế dành cho sinh viên năm 3, 4. Bạn sẽ được phân công Mentor 1-1 hướng dẫn trực tiếp, tham gia phát triển sản phẩm thật và có cơ hội nhận offer chính thức ngay sau khi kết thúc kỳ thực tập.",
  },
  {
    image: "/assets/card-tech.png",
    mobileImage: "/assets/mobile/technology-trainee-image.png",
    title: <>Sinh viên<br />công nghệ tập sự</>,
    body: "Chương trình tuyển dụng dành riêng cho sinh viên khối Công nghệ - Kỹ thuật với lộ trình phát triển thành nhân sự nòng cốt và thu nhập tới 150 triệu/năm",
    tag: "Khối Công Nghệ",
    fullDetails: "Dành riêng cho sinh viên ngành CNTT, Điện tử Viễn thông, Khoa học Máy tính. Tham gia các dự án trọng điểm về Cloud, Big Data, AI, Network Infrastructure với mức thu nhập hấp dẫn lên đến 150 triệu/năm.",
  },
  {
    image: "/assets/card-leaders.png",
    mobileImage: "/assets/mobile/nextgen-leaders-image.png",
    title: <>Nextgen Leaders</>,
    body: "Chương trình tuyển dụng dành riêng cho sinh viên khối ngành Kinh tế với lộ trình đào tạo bứt phá thành thế hệ Quản lý kế cận tại FTEL.",
    tag: "Khối Kinh Tế",
    fullDetails: "Chương trình đào tạo Fast-track phát triển thế hệ lãnh đạo trẻ kế cận cho FPT Telecom. Bạn sẽ trải qua các vòng luân chuyển phòng ban, làm việc trực tiếp với Ban Giám đốc và nhận lộ trình thăng tiến siêu tốc.",
  },
  {
    image: "/assets/card-careerfair.png",
    mobileImage: "/assets/mobile/career-fair-image.png",
    title: <>Career talk<br />& Hội thảo định hướng</>,
    body: "Chuỗi hội thảo hướng nghiệp trực tiếp tại giảng đường giúp bạn nắm bắt xu hướng thị trường và bí kíp săn job chất.",
    tag: "Sự kiện",
    fullDetails: "Gặp gỡ trực tiếp các diễn giả, chuyên gia hàng đầu từ FPT Telecom. Nhận tư vấn sửa CV, phỏng vấn thử 1-1 và cập nhật các xu hướng tuyển dụng hot nhất.",
  },
  {
    image: "/assets/card-tour.png",
    mobileImage: "/assets/mobile/fpt-tour-image.png",
    title: <>FPT Tour</>,
    body: "Thăm quan văn phòng công nghệ xịn mịn, trải nghiệm thực tế văn hóa sáng tạo.",
    tag: "Trải nghiệm",
    fullDetails: "Chuyến tham quan trực tiếp đại bản doanh FPT Tower và FPT Tan Thuan. Khám phá không gian làm việc hiện đại, các khu tiện ích giải trí và giao lưu cùng cán bộ nhân viên.",
  },
  {
    image: "/assets/card-university.png",
    mobileImage: "/assets/mobile/university-partnership-image.png",
    title: <>Hợp tác cùng<br />các trường đại học</>,
    body: "Ký kết MOU chiến lược cùng hàng loạt trường Đại học, Cao đẳng, đồng hành bền vững cùng sinh viên qua đa dạng các hoạt động.",
    tag: "Hợp tác",
    fullDetails: "FPT Telecom hợp tác chiến lược với hơn 50+ trường Đại học toàn quốc, tài trợ học bổng, tổ chức các cuộc thi công nghệ và tạo điều kiện đầu ra việc làm uy tín.",
  },
];

const technologyJobs: JobItem[] = [
  {
    title: "Developer",
    description: "Tham gia phát triển và hoàn thiện các chức năng phần mềm theo phân công của đội ngũ.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time / Internship",
    requirements: ["Nắm vững kiến thức căn bản về JavaScript/TypeScript, React hoặc Node.js", "Có tư duy logic tốt, chủ động trong công việc", "Ưu tiên sinh viên năm cuối hoặc mới tốt nghiệp khối ngành CNTT"],
  },
  {
    title: "Data",
    description: "Xử lý, phân tích dữ liệu và xây dựng report/dashboard theo dõi KPI.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time",
    requirements: ["Sử dụng thành thạo SQL, Python (Pandas, NumPy)", "Có kinh nghiệm làm việc với PowerBI / Tableau là một lợi thế", "Khả năng phân tích chỉ số kinh doanh tốt"],
  },
  {
    title: "AI",
    description: "Tham gia nghiên cứu, xây dựng và tối ưu các mô hình, tính năng AI theo nhu cầu dự án.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time / Research",
    requirements: ["Kiến thức chắc về Machine Learning / Deep Learning", "Sử dụng tốt PyTorch hoặc TensorFlow", "Có tinh thần nghiên cứu và áp dụng công nghệ mới"],
  },
  {
    title: "IC Design",
    description: "Tham gia thiết kế và phát triển các khối IP/phần cứng số theo yêu cầu dự án.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time",
    requirements: ["Hiểu biết về ngôn ngữ Verilog/SystemVerilog", "Kiến thức căn bản về thiết kế vi mạch số và FPGA", "Đam mê theo đuổi ngành bán dẫn số"],
  },
  {
    title: "Embedded",
    description: "Tham gia phát triển firmware/phần mềm nhúng cho chip, vi điều khiển hoặc thiết bị phần cứng.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time",
    requirements: ["Lập trình thành thạo C/C++ cho hệ thống nhúng", "Hiểu biết về RTOS, giao tiếp SPI, I2C, UART", "Có kinh nghiệm triển khai trên phần cứng thực tế"],
  },
];

const officeJobs: JobItem[] = [
  {
    title: "Truyền thông",
    description: "Tham gia xây dựng và triển khai nội dung trên các kênh truyền thông của công ty.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time / Internship",
    requirements: ["Khả năng viết lách tốt, sáng tạo nội dung mạng xã hội", "Kỹ năng quản lý fanpage, làm việc nhóm tốt", "Ưu tiên ngành Truyền thông, Báo chí, Marketing"],
  },
  {
    title: "Nhân sự",
    description: "Tham gia hỗ trợ các nghiệp vụ nhân sự như tuyển dụng, đào tạo, chính sách, phúc lợi hoặc quan hệ lao động.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time",
    requirements: ["Yêu thích công việc làm việc với con người", "Kỹ năng giao tiếp và sắp xếp công việc chỉn chu", "Ưu tiên tốt nghiệp Quản trị Nhân sự, Luật, Kinh tế"],
  },
  {
    title: "Thiết kế",
    description: "Tham gia thiết kế các ấn phẩm truyền thông, hình ảnh thương hiệu và tài liệu phục vụ hoạt động của FPT Telecom.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time",
    requirements: ["Sử dụng thành thạo Photoshop, Illustrator, Figma", "Tư duy thẩm mỹ hiện đại, cập nhật xu hướng UI/UX", "Có portfolio sản phẩm ấn tượng"],
  },
  {
    title: "Tài chính - Kế toán",
    description: "Tham gia xử lý chứng từ, kiểm soát chi phí và hỗ trợ công tác lập báo cáo tài chính.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time",
    requirements: ["Cẩn thận, trung thực, nắm chắc nguyên lý kế toán", "Thành thạo Excel và các công cụ văn phòng"],
  },
];

const businessJobs: JobItem[] = [
  {
    title: "Chuyên viên Kinh doanh",
    description: "Tìm kiếm, tư vấn và phát triển hệ thống khách hàng cho các sản phẩm dịch vụ viễn thông.",
    location: "Toàn quốc",
    type: "Full-time",
    requirements: ["Năng động, giao tiếp linh hoạt, thích thử thách chỉ tiêu", "Có phương tiện đi lại chủ động", "Ưu tiên ứng viên có đam mê kinh doanh"],
  },
  {
    title: "Chăm sóc Khách hàng",
    description: "Tiếp nhận, xử lý giải đáp thắc mắc và hỗ trợ khách hàng qua các kênh dịch vụ chính thức.",
    location: "Hà Nội - Hồ Chí Minh",
    type: "Full-time / Ca linh hoạt",
    requirements: ["Giọng nói rõ ràng, kiên nhẫn, lắng nghe tốt", "Kỹ năng gõ máy tính và xử lý thông tin nhanh"],
  },
  {
    title: "Kỹ thuật Viên Onsite",
    description: "Triển khai lắp đặt, bảo trì hạ tầng viễn thông và thiết bị cho khách hàng.",
    location: "Toàn quốc",
    type: "Full-time",
    requirements: ["Tốt nghiệp ngành Điện, Điện tử, Viễn thông, CNTT", "Sức khỏe tốt, ham học hỏi"],
  },
];

const jobCategories: JobCategory[] = [
  { id: "technology", label: "Công nghệ - Bán dẫn", items: technologyJobs },
  { id: "office", label: "Văn phòng", items: officeJobs },
  { id: "business", label: "Kinh doanh - Dịch vụ - Kỹ thuật", items: businessJobs },
];

// Helper UI Components
function PillButton({ children, blue = false, type = "button", onClick }: { children: React.ReactNode; blue?: boolean; type?: "button" | "submit"; onClick?: () => void }) {
  return (
    <button type={type} className={`pill-button ${blue ? "pill-blue" : "pill-orange"}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

// Custom SVG Icons
function IconLocation() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z" fill="#353B40" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#1877F2"/>
      <path d="M16 12.5H13.5V21H10V12.5H8.5V9.5H10V7.75C10 6.1 11.1 4.75 13.25 4.75H15.75V7.75H14.25C13.6 7.75 13.5 8 13.5 8.5V9.5H16L16 12.5Z" fill="white"/>
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#010101"/>
      <path d="M16.5 8.2C15.4 8.2 14.4 7.7 13.7 6.9V14.5C13.7 17.5 11.2 20 8.2 20C5.2 20 2.7 17.5 2.7 14.5C2.7 11.5 5.2 9 8.2 9C8.6 9 9 9.05 9.4 9.15V11.8C9 11.65 8.6 11.6 8.2 11.6C6.6 11.6 5.3 12.9 5.3 14.5C5.3 16.1 6.6 17.4 8.2 17.4C9.8 17.4 11.1 16.1 11.1 14.5V4H13.7C13.7 5.3 14.7 6.3 16 6.5V8.2H16.5Z" fill="white"/>
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#0A66C2"/>
      <path d="M7 9H4.5V19.5H7V9ZM5.75 4.5C4.9 4.5 4.25 5.15 4.25 6C4.25 6.85 4.9 7.5 5.75 7.5C6.6 7.5 7.25 6.85 7.25 6C7.25 5.15 6.6 4.5 5.75 4.5ZM19.5 19.5H17V14C17 12.2 15.5 12 15 12.8V19.5H12.5V9H15V10.4C15.6 9.4 17 9 18.2 9C19.8 9 20.5 10.2 20.5 12.5V19.5H19.5Z" fill="white"/>
    </svg>
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
          <strong>15K TỶ</strong>
          <span>Doanh thu</span>
        </div>
      </div>

      <p>
        Bệ phóng công nghệ hàng đầu, nơi Gen Z được học hỏi từ những dự án thực tế, phát triển năng lực mỗi ngày và bứt phá sự nghiệp trong môi trường đổi mới, sáng tạo
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

function Journey({ onSelectCard }: { onSelectCard: (card: JourneyCard) => void }) {
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
            className="journey-card"
            key={idx}
            onClick={() => onSelectCard(card)}
            style={{ cursor: "pointer" }}
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

      <PillButton blue onClick={() => onSelectJob(technologyJobs[0])}>
        Xem tất cả việc làm
      </PillButton>
    </section>
  );
}

function Connect({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onShowToast("🎉 Cảm ơn bạn! Đã gửi thông tin đăng ký thành công. Đội ngũ Tuyển dụng FPT Telecom sẽ liên hệ bạn sớm nhất!");
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
          <span>Họ và tên</span>
          <input required placeholder="Nguyễn Văn A" />
        </label>

        <label className="form-field">
          <span>Số điện thoại</span>
          <input required type="tel" placeholder="0987654321" />
        </label>

        <label className="form-field">
          <span>Email</span>
          <input required type="email" placeholder="example@gmail.com" />
        </label>

        <label className="form-field">
          <span>Trường đại học/ cao đẳng</span>
          <input required placeholder="Đại học FPT, Bách Khoa..." />
        </label>

        <label className="form-field">
          <span>Thời gian dự kiến tốt nghiệp</span>
          <select defaultValue="" required>
            <option value="" disabled>
              Lựa chọn...
            </option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
          </select>
        </label>

        <label className="form-field">
          <span>Khu vực mong muốn làm việc</span>
          <select defaultValue="" required>
            <option value="" disabled>
              Lựa chọn...
            </option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Khác">Tỉnh thành khác</option>
          </select>
        </label>

        <label className="form-field">
          <span>Vị trí mong muốn ứng tuyển</span>
          <select defaultValue="" required>
            <option value="" disabled>
              Lựa chọn...
            </option>
            <option value="Công nghệ - Bán dẫn">Công nghệ - Bán dẫn</option>
            <option value="Kinh doanh - Dịch vụ - Kỹ thuật">Kinh doanh - Dịch vụ - Kỹ thuật</option>
            <option value="Văn phòng">Văn phòng</option>
          </select>
        </label>

        <label className="form-field upload-field">
          <span>Upload CV (không bắt buộc)</span>
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

            <a href="https://www.tiktok.com/@nhacao" target="_blank" rel="noopener noreferrer" className="contact-item">
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
            <p>FPT Tower, số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội</p>
            <p>FPT Tân Thuận, KCX Tân Thuận, Quận 7, TP. Hồ Chí Minh</p>
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
                <p>FPT Tower, số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội</p>
                <p>FPT Tân Thuận, KCX Tân Thuận, Quận 7, TP. Hồ Chí Minh</p>
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
              <a href="https://facebook.com/fpttelecom" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IconTikTok /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconLinkedIn /></a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" aria-label="Zalo"><IconPhone /></a>
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
function JobModal({ job, onClose }: { job: JobItem | null; onClose: () => void }) {
  if (!job) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <span className="modal-badge">{job.type || "Full-time"}</span>
        <h2>{job.title}</h2>
        <p className="modal-location"><IconLocation /> {job.location || "Hà Nội - Hồ Chí Minh"}</p>
        <hr className="modal-divider" />

        <h3>Mô tả công việc</h3>
        <p>{job.description}</p>

        <h3>Yêu cầu ứng viên</h3>
        <ul>
          {job.requirements ? (
            job.requirements.map((req, i) => <li key={i}>{req}</li>)
          ) : (
            <>
              <li>Tốt nghiệp ĐH/CĐ chuyên ngành liên quan</li>
              <li>Chủ động, ham học hỏi và có tư duy logic tốt</li>
            </>
          )}
        </ul>

        <div className="modal-actions">
          <a href="#connect" onClick={onClose} style={{ textDecoration: "none" }}>
            <PillButton>Ứng tuyển ngay</PillButton>
          </a>
        </div>
      </div>
    </div>
  );
}

function JourneyModal({ card, onClose }: { card: JourneyCard | null; onClose: () => void }) {
  if (!card) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {card.tag && <span className="modal-badge">{card.tag}</span>}
        <h2>{card.title}</h2>
        <hr className="modal-divider" />
        <p style={{ fontSize: "16px", lineHeight: "24px", color: "#3a4459", marginBottom: "16px" }}>{card.body}</p>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "#637381" }}>{card.fullDetails || card.body}</p>
        <div className="modal-actions" style={{ marginTop: "24px" }}>
          <a href="#connect" onClick={onClose} style={{ textDecoration: "none" }}>
            <PillButton>Đăng ký tham gia</PillButton>
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
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-notification">
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
}

// Main Page Shell
export default function Home() {
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<JourneyCard | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  return (
    <main className="page-shell">
      <div className="desktop-canvas">
        <Navigation onOpenAuth={(mode) => setAuthMode(mode)} />
        <Hero />
        <DecorativeBackground />
        <About />
        <Privileges />
        <Journey onSelectCard={(card) => setSelectedJourney(card)} />
        <Jobs onSelectJob={(job) => setSelectedJob(job)} />
        <Connect onShowToast={(msg) => setToastMsg(msg)} />
        <Footer />
      </div>

      {/* Modals & Overlays */}
      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <JourneyModal card={selectedJourney} onClose={() => setSelectedJourney(null)} />
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
