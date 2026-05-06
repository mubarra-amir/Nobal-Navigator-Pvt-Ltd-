import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Target, Users, Award, Globe, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Scroll Animation Hook ─────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function AnimSection({ children, className = "", direction = "up", delay = 0 }) {
  const [ref, visible] = useReveal();
  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none"
      : direction === "up" ? "translateY(40px)"
      : direction === "left" ? "translateX(-50px)"
      : direction === "right" ? "translateX(50px)"
      : "scale(0.9)",
    transition: `opacity 0.7s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.7s ${delay}s cubic-bezier(.22,1,.36,1)`,
  };
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

/* ── Hero Slides ─────────────────────────────────────── */
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1739298061766-e2751d92e9db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjB0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3NzQ3MDU1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "About Us",
    headline: "Trusted Partner",
    highlight: "Since 2015",
    sub: "Your trusted partner in making global education dreams a reality.",
  },
  {
    image: "https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    tag: "Our Team",
    headline: "Expert Counselors",
    highlight: "Dedicated to You",
    sub: "A team of experienced professionals committed to your international education success.",
  },
  {
    image: "https://images.unsplash.com/photo-1760348082270-3a46a3512850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    tag: "1000+ Students",
    headline: "Proven Track",
    highlight: "Record",
    sub: "Over a decade of successfully guiding students to top universities worldwide.",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const total = heroSlides.length;

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(idx); setAnimKey(k => k + 1); setTransitioning(false); }, 600);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);

  useEffect(() => { const t = setInterval(next, 6000); return () => clearInterval(t); }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 500 }}>
      <style>{`
        @keyframes kbZoom  { from{transform:scale(1)} to{transform:scale(1.07)} }
        @keyframes tagIn   { 0%{opacity:0;transform:scale(.75) translateY(-12px)} 70%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px);filter:blur(3px)} to{opacity:1;transform:translateY(0);filter:blur(0)} }
        .kb   { animation: kbZoom 8s ease-out forwards; }
        .tag-in { animation: tagIn  0.55s 0.05s both; }
        .su-1   { animation: slideUp 0.65s 0.15s both; }
        .su-2   { animation: slideUp 0.65s 0.30s both; }
        .su-3   { animation: slideUp 0.65s 0.45s both; }
      `}</style>

      {heroSlides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={s.image} alt="" className={`w-full h-full object-cover ${i === current ? "kb" : ""}`} style={{ minHeight: 500 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/65 to-blue-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 500 }}>
        <div className="max-w-2xl py-20" key={animKey}>
          <span className="tag-in inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 text-sm px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-blue-400 rounded-full" style={{ animation: "pulseSoft 2s infinite" }} />
            {slide.tag}
          </span>
          <h1 className="su-1 text-4xl md:text-6xl text-white font-bold leading-tight mb-2">{slide.headline}</h1>
          <h1 className="su-2 text-4xl md:text-6xl font-bold leading-tight mb-5" style={{
            background: "linear-gradient(135deg,#60a5fa,#a5f3fc)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>{slide.highlight}</h1>
          <p className="su-3 text-blue-100 text-lg max-w-xl leading-relaxed">{slide.sub}</p>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ${i === current ? "w-7 h-3 bg-blue-400" : "w-3 h-3 bg-white/40 hover:bg-white/70"}`} />
        ))}
      </div>
      <button onClick={prev} className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110">
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}

export default function AboutUs() {
  const values = [
    { icon: Target, title: "Our Mission", description: "To empower students with world-class education opportunities by providing expert guidance and comprehensive support throughout their study abroad journey." },
    { icon: Users, title: "Our Vision", description: "To be the most trusted study abroad consultancy, connecting ambitious students with their dream universities worldwide." },
    { icon: Award, title: "Our Values", description: "Integrity, Excellence, Student-Centric Approach, Innovation, and Commitment to Success." },
  ];

  const team = [
    { name: "Dr. Rajesh Kumar", role: "Founder & CEO", description: "15+ years in international education consultancy", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop" },
    { name: "Sarah Mitchell", role: "Head of Admissions", description: "Expert in UK & Europe university placements", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop" },
    { name: "Michael Chen", role: "Visa Specialist", description: "Specialist in USA, Canada & Australia visas", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" },
    { name: "Priya Sharma", role: "Student Counselor", description: "Personalized guidance for 500+ students", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop" },
  ];

  const milestones = [
    { year: "2015", event: "Nobal Navigator Pvt Ltd founded" },
    { year: "2017", event: "Reached 100 successful student placements" },
    { year: "2019", event: "Expanded to 9 countries partnership" },
    { year: "2021", event: "Achieved 98% visa success rate" },
    { year: "2024", event: "1000+ students placed in top universities" },
  ];

  const features = [
    "Personalized career counseling", "University selection assistance",
    "Application processing support", "Visa documentation & filing",
    "Scholarship guidance", "Pre-departure orientation",
    "Post-landing support", "Test preparation guidance",
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSlider />

      {/* About Intro */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimSection direction="left">
              <h2 className="text-3xl md:text-4xl text-blue-900 mb-6 font-bold">Empowering Students Since 2015</h2>
              <p className="text-gray-600 mb-4 text-lg">Nobal Navigator Pvt Ltd is a premier study abroad consultancy dedicated to helping students achieve their international education goals. With over a decade of experience, we have successfully guided more than 1,000 students to prestigious universities across the globe.</p>
              <p className="text-gray-600 mb-4 text-lg">Our team of expert counselors provides comprehensive support throughout the entire journey - from selecting the right university and course to visa approval and pre-departure guidance.</p>
              <p className="text-gray-600 text-lg">What sets us apart is our personalized approach, high success rate, and commitment to student satisfaction.</p>
            </AnimSection>
            <AnimSection direction="right">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1739298061766-e2751d92e9db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjB0ZWFtJTIwbWVldGluZ3xlbnwxfHx8fDE3NzQ3MDU1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Our team meeting"
                  className="rounded-2xl shadow-2xl w-full h-[480px] object-cover"
                />
                <div className="absolute -bottom-5 -left-5 bg-blue-600 text-white rounded-2xl p-5 shadow-xl">
                  <div className="text-3xl font-bold">10+</div>
                  <div className="text-blue-200 text-sm">Years Experience</div>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <AnimSection key={i} delay={i * 0.15} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                      <value.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl text-blue-900 mb-4 font-semibold">{value.title}</h3>
                    <p className="text-gray-600 text-lg">{value.description}</p>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Comprehensive Services We Offer</h2>
            <p className="text-xl text-gray-600">End-to-end support for your study abroad journey</p>
          </AnimSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <AnimSection key={i} delay={i * 0.06} direction="up">
                <div className="flex items-start gap-3 bg-blue-50 p-5 rounded-xl hover:bg-blue-100 transition-colors duration-300 hover:shadow-md">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600">Experienced professionals dedicated to your success</p>
          </AnimSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <AnimSection key={i} delay={i * 0.12} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <ImageWithFallback src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl text-blue-900 mb-1 font-semibold">{member.name}</h3>
                    <div className="text-blue-600 mb-3 text-sm font-medium">{member.role}</div>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Our Journey</h2>
            <p className="text-xl text-gray-600">Milestones that define our success</p>
          </AnimSection>
          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <AnimSection key={i} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-200">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 bg-blue-50 p-6 rounded-xl hover:bg-blue-100 hover:shadow-md transition-all duration-300">
                    <p className="text-lg text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <AnimSection>
        <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Globe className="w-16 h-16 mx-auto mb-6 text-blue-300" />
            <h2 className="text-3xl md:text-4xl mb-6 font-bold">Recognized Excellence</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Our commitment to excellence has earned us recognition as one of the leading study abroad consultancies.
              We maintain partnerships with over 50 universities and have achieved a remarkable 98% visa success rate.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { icon: "🏆", label: "Best Consultancy 2023" },
                { icon: "⭐", label: "4.9/5 Student Rating" },
                { icon: "🎓", label: "Top University Partners" },
                { icon: "🌍", label: "Global Reach" },
              ].map((item, i) => (
                <AnimSection key={i} delay={i * 0.1}>
                  <div className="hover:scale-110 transition-transform duration-300">
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="text-blue-100">{item.label}</div>
                  </div>
                </AnimSection>
              ))}
            </div>
          </div>
        </section>
      </AnimSection>
    </div>
  );
}