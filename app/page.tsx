"use client";

import { useState } from "react";

const journeyCards = [
  {
    image: "/assets/card-internship.png",
    title: <>FPT Telecom<br />Internship</>,
    body: "Chương trình thực tập đa ngành đưa bạn vào các dự án thực tế cùng Mentor 1-1 để khởi đầu sự nghiệp vững chắc.",
  },
  {
    image: "/assets/card-tech.png",
    title: <>Sinh viên<br />công nghệ tập sự</>,
    body: "Chương trình tuyển dụng dành riêng cho sinh viên khối Công nghệ - Kỹ thuật với lộ trình phát triển thành nhân sự nòng cốt và thu nhập tới 150 triệu/năm",
  },
  {
    image: "/assets/card-leaders.png",
    title: <>Nextgen Leaders</>,
    body: "Chương trình tuyển dụng dành riêng cho sinh viên khối ngành Kinh tế với lộ trình đào tạo bứt phá thành thế hệ Quản lý kế cận tại FTEL.",
  },
  {
    image: "/assets/card-careerfair.png",
    title: <>Career talk<br />& Hội thảo định hướng</>,
    body: "Chuỗi hội thảo hướng nghiệp trực tiếp tại giảng đường giúp bạn nắm bắt xu hướng thị trường và bí kíp săn job chất.",
  },
  {
    image: "/assets/card-tour.png",
    title: <>FPT Tour</>,
    body: "Thăm quan văn phòng công nghệ xịn mịn, trải nghiệm thực tế văn hóa sáng tạo.",
  },
  {
    image: "/assets/card-university.png",
    title: <>Hợp tác cùng<br />các trường đại học</>,
    body: "Ký kết MOU chiến lược cùng hàng loạt trường Đại học, Cao đẳng, đồng hành bền vững cùng sinh viên qua đa dạng các hoạt động.",
  },
];

const jobs = [
  ["Developer", "Tham gia phát triển và hoàn thiện các chức năng phần mềm theo phân công của đội ngũ."],
  ["Data", "Xử lý, phân tích dữ liệu và xây dựng report/dashboard theo dõi KPI."],
  ["AI", "Tham gia nghiên cứu, xây dựng và tối ưu các mô hình, tính năng AI theo nhu cầu dự án."],
  ["IC Design", "Tham gia thiết kế và phát triển các khối IP/phần cứng số theo yêu cầu dự án."],
  ["Embedded", "Tham gia phát triển firmware/phần mềm nhúng cho chip, vi điều khiển hoặc thiết bị phần cứng."],
];

function PillButton({ children, blue = false }: { children: React.ReactNode; blue?: boolean }) {
  return <span className={`pill-button ${blue ? "pill-blue" : "pill-orange"}`}><span>{children}</span></span>;
}

function Navigation() {
  return (
    <header className="navigation">
      <div className="nav-inner">
        <img className="logo" src="/assets/logo.png" alt="FPT Telecom" />
        <nav className="nav-links" aria-label="Điều hướng chính">
          <a href="#jobs">Việc làm</a>
          <a href="#about">Về chúng tôi <img src="/assets/caret.svg" alt="" /></a>
          <a href="#journey">Life at FTEL <img src="/assets/caret.svg" alt="" /></a>
          <a href="#footer">Tin tức &amp; Sự kiện <img src="/assets/caret.svg" alt="" /></a>
        </nav>
        <div className="account-actions">
          <button type="button" className="register">Đăng ký</button>
          <button type="button" className="login">Đăng nhập</button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-back"><img src="/assets/hero-back.png" alt="" /></div>
      <div className="hero-title"><img src="/assets/hero-headline.png" alt="FPT Telecom Career Booming" /></div>
      <div className="hero-subtitle">Khám phá vũ trụ cơ hội nghề nghiệp, chương trình thực tập thực chiến và hành trình phát triển dành riêng cho sinh viên tại FPT Telecom.</div>
      <a className="hero-cta" href="#connect"><PillButton>Để lại thông tin ngay</PillButton></a>
      <img className="hero-people" src="/assets/hero-people.png" alt="Sinh viên FPT Telecom" />
    </section>
  );
}

function DecorativeBackground() {
  return (
    <div className="decorative-background" aria-hidden="true">
      <div className="background-gradient" />
      <img className="background-buildings" src="/assets/bg-buildings.png" alt="" />
      <div className="background-pattern"><img src="/assets/bg-pattern.png" alt="" /></div>
      <img className="background-cloud-left" src="/assets/bg-clouds.png" alt="" />
      <img className="background-cloud-right" src="/assets/bg-clouds.png" alt="" />
      <img className="background-cloud-bottom" src="/assets/bg-bottom.png" alt="" />
      <div className="background-plane"><img src="/assets/paper-plane.png" alt="" /></div>
    </div>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <div className="about-title"><img src="/assets/section2-headline.png" alt="Về FPT Telecom" /></div>
      <div className="trust-bar">
        <div><strong>34</strong><span>Tỉnh thành</span></div>
        <i />
        <div><strong>10K+</strong><span>Nhân sự</span></div>
        <i />
        <div><strong>15K TỶ</strong><span>Doanh thu</span></div>
      </div>
      <p>Bệ phóng công nghệ hàng đầu, nơi Gen Z được học hỏi từ những dự án thực tế, phát triển năng lực mỗi ngày và bứt phá sự nghiệp trong môi trường đổi mới, sáng tạo</p>
    </section>
  );
}

function Privileges() {
  const cards = [
    ["/assets/privilege-1.png", "Học từ thực tế", "Đội ngũ đồng hành, được tham gia công việc và dự án thực tế."],
    ["/assets/privilege-2.png", "Lộ trình rõ ràng", "Cơ hội phát triển dài hạn và trở thành nhân viên chính thức theo năng lực."],
    ["/assets/privilege-3.png", "Trải nghiệm khác biệt", "Văn hóa không khoảng cách và chuỗi hoạt động gắn kết nội bộ giàu năng lượng."],
  ];
  return (
    <section className="privileges">
      <div className="privilege-title"><img src="/assets/privilege-headline.png" alt="Đặc quyền thực tế bạn nhận được" /></div>
      <div className="privilege-cards">
        {cards.map(([image, title, body]) => (
          <article className="privilege-card" key={title} style={{ backgroundImage: `url(${image})` }}>
            <div className="privilege-shade" />
            <div className="privilege-copy"><h3>{title}</h3><p>{body}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  const [start, setStart] = useState(0);
  const visible = Array.from({ length: 3 }, (_, index) => journeyCards[(start + index) % journeyCards.length]);
  return (
    <section className="journey" id="journey">
      <div className="journey-heading"><img src="/assets/journey-headline.png" alt="Hành trình đồng hành kiến tạo tương lai" /></div>
      <p className="journey-subtitle">Đa dạng hoạt động trải nghiệm dành cho sinh viên với các chương trình tài năng trẻ và lộ trình fast-track bứt phá sự nghiệp.</p>
      <button className="carousel-arrow carousel-left" type="button" aria-label="Chương trình trước" onClick={() => setStart((start + journeyCards.length - 1) % journeyCards.length)}><img src="/assets/chevron-left.svg" alt="" /></button>
      <div className="journey-cards">
        {visible.map((card, index) => (
          <article className="journey-card" key={`${start}-${index}`}>
            <img className="journey-photo" src={card.image} alt="" />
            <div className="journey-overlay" />
            <img className="journey-pattern" src="/assets/card-pattern.png" alt="" />
            <div className="journey-copy"><h3>{card.title}</h3><hr /><p>{card.body}</p></div>
          </article>
        ))}
      </div>
      <button className="carousel-arrow carousel-right" type="button" aria-label="Chương trình tiếp theo" onClick={() => setStart((start + 1) % journeyCards.length)}><img src="/assets/chevron-right.svg" alt="" /></button>
      <div className="dots" aria-hidden="true">{journeyCards.map((_, index) => <span key={index} className={index === start ? "active" : ""} />)}</div>
    </section>
  );
}

function JobCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="job-card">
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="job-meta"><span><img src="/assets/location.svg" alt="" />Hà Nội - Hồ Chí Minh</span><button type="button">Xem JD ngay</button></div>
    </article>
  );
}

function Jobs() {
  const categories = ["Công nghệ - Bán dẫn", "Văn phòng", "Kinh doanh - Dịch vụ - Kỹ thuật"];
  const [active, setActive] = useState(0);
  return (
    <section className="jobs" id="jobs">
      <div className="jobs-heading"><img src="/assets/jobs-headline.png" alt="Vũ trụ nghề nghiệp tại FPT Telecom" /></div>
      <p className="jobs-subtitle">Mở ra đa dạng cơ hội việc làm và lộ trình phát triển sự nghiệp tại khắp các tỉnh thành trên toàn quốc.</p>
      <div className="job-tabs">{categories.map((category, index) => <button key={category} type="button" className={active === index ? "active" : ""} onClick={() => setActive(index)}>{category}</button>)}</div>
      <div className="job-grid">{jobs.map(([title, body]) => <JobCard key={title} title={title} body={body} />)}</div>
      <PillButton blue>Xem tất cả việc làm</PillButton>
    </section>
  );
}

function Field({ label }: { label: string }) {
  return <label className="form-field"><span>{label}</span><input aria-label={label} /></label>;
}

function SelectField({ label }: { label: string }) {
  return <label className="form-field"><span>{label}</span><select defaultValue=""><option value="" disabled>Lựa chọn...</option></select></label>;
}

function Connect() {
  return (
    <section className="connect" id="connect">
      <img className="connect-back" src="/assets/form-back.png" alt="" />
      <div className="connect-tint" />
      <div className="connect-heading"><img src="/assets/form-headline.png" alt="Nơi dây kết nối bật sáng tương lai" /></div>
      <p className="connect-subtitle">Để lại thông tin ngay, đội ngũ Tuyển dụng sẽ gửi đến bạn những cơ hội đo ni đóng giày theo đúng ngành học!</p>
      <form className="connect-form" onSubmit={(event) => event.preventDefault()}>
        <Field label="Họ và tên" />
        <Field label="Số điện thoại" />
        <Field label="Email" />
        <Field label="Trường đại học/ cao đẳng" />
        <SelectField label="Thời gian dự kiến tốt nghiệp" />
        <SelectField label="Khu vực mong muốn làm việc" />
        <SelectField label="Vị trí mong muốn ứng tuyển" />
        <label className="form-field upload-field"><span>Upload CV (không bắt buộc)</span><input type="file" aria-label="Upload CV (không bắt buộc)" /><b>Upload</b></label>
      </form>
      <label className="consent"><input type="checkbox" defaultChecked /><span>Tôi đồng ý nhận thông tin việc làm và các cơ hội sự nghiệp từ FPT Telecom.</span></label>
      <button className="connect-submit" type="button"><PillButton>Để lại thông tin ngay</PillButton></button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-top"><img src="/assets/footer-top.png" alt="Kết nối với chúng tôi" /></div>
      <div className="footer-bottom"><img src="/assets/footer-bottom.png" alt="Thông tin FPT Telecom" /></div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="page-shell">
      <div className="desktop-canvas">
        <Navigation />
        <Hero />
        <DecorativeBackground />
        <About />
        <Privileges />
        <Journey />
        <Jobs />
        <Connect />
        <Footer />
      </div>
    </main>
  );
}
