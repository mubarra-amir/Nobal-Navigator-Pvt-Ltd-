import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

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

/* ── Hero Slider ─────────────────────────────────────── */
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1760348082270-3a46a3512850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    tag: "Success Stories",
    headline: "Students Who",
    highlight: "Achieved Dreams",
    sub: "Hear from students who transformed their lives with our guidance.",
  },
  {
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1080&h=600&fit=crop",
    tag: "1000+ Placements",
    headline: "Real People,",
    highlight: "Real Results",
    sub: "Over a thousand successful placements in top universities worldwide.",
  },
  {
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1080&h=600&fit=crop",
    tag: "98% Success",
    headline: "Your Journey",
    highlight: "Starts Here",
    sub: "Join thousands of satisfied students who trusted Nobal Navigator.",
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
        @keyframes kb2  { from{transform:scale(1)} to{transform:scale(1.07)} }
        @keyframes tag2 { 0%{opacity:0;transform:scale(.75) translateY(-12px)} 70%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
        @keyframes su2  { from{opacity:0;transform:translateY(30px);filter:blur(3px)} to{opacity:1;transform:translateY(0);filter:blur(0)} }
        .kb2  { animation: kb2 8s ease-out forwards; }
        .t2   { animation: tag2 0.55s 0.05s both; }
        .s2-1 { animation: su2 0.65s 0.15s both; }
        .s2-2 { animation: su2 0.65s 0.30s both; }
        .s2-3 { animation: su2 0.65s 0.45s both; }
      `}</style>
      {heroSlides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={s.image} alt="" className={`w-full h-full object-cover ${i === current ? "kb2" : ""}`} style={{ minHeight: 500 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent" />
        </div>
      ))}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 500 }}>
        <div className="max-w-2xl py-20" key={animKey}>
          <span className="t2 inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 text-sm px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />{slide.tag}
          </span>
          <h1 className="s2-1 text-4xl md:text-6xl text-white font-bold leading-tight mb-2">{slide.headline}</h1>
          <h1 className="s2-2 text-4xl md:text-6xl font-bold leading-tight mb-5" style={{
            background: "linear-gradient(135deg,#60a5fa,#a5f3fc)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>{slide.highlight}</h1>
          <p className="s2-3 text-blue-100 text-lg max-w-xl leading-relaxed">{slide.sub}</p>
        </div>
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ${i === current ? "w-7 h-3 bg-blue-400" : "w-3 h-3 bg-white/40 hover:bg-white/70"}`} />
        ))}
      </div>
      <button onClick={prev} className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110"><ChevronLeft className="w-5 h-5" /></button>
      <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-110"><ChevronRight className="w-5 h-5" /></button>
    </section>
  );
}

export default function OurClients() {
  const testimonials = [
    { name: "Sarah Johnson", university: "University of Oxford", country: "United Kingdom", course: "Master's in Computer Science", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", text: "Nobal Navigator was instrumental in helping me secure admission to Oxford. Their guidance on crafting my personal statement and preparing for interviews was invaluable.", rating: 5 },
    { name: "Raj Patel", university: "University of Toronto", country: "Canada", course: "MBA", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", text: "The visa process seemed overwhelming at first, but the team at Nobal Navigator handled everything professionally. I got my visa approved on the first attempt!", rating: 5 },
    { name: "Emma Williams", university: "University of Melbourne", country: "Australia", course: "Bachelor's in Medicine", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", text: "I was confused about which country and university to choose. The counselors took time to understand my career goals and helped me find the perfect fit.", rating: 5 },
    { name: "Ahmed Hassan", university: "Technical University of Munich", country: "Germany", course: "Master's in Engineering", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", text: "Outstanding service! They helped me find scholarship opportunities and guided me through the entire application process. Highly recommended!", rating: 5 },
    { name: "Priya Sharma", university: "Harvard University", country: "USA", course: "Master's in Public Health", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop", text: "Getting into an Ivy League school was my dream, and Nobal Navigator made it come true. Their counselors are highly knowledgeable about US admissions.", rating: 5 },
    { name: "Michael Chen", university: "University College Dublin", country: "Ireland", course: "Master's in Data Science", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop", text: "Professional, responsive, and genuinely caring - that's how I'd describe Nobal Navigator. The post-landing support was also excellent!", rating: 5 },
    { name: "Sofia Rodriguez", university: "University of Sydney", country: "Australia", course: "Bachelor's in Business", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", text: "They helped me find affordable universities with scholarship options. They made my study abroad dream achievable!", rating: 5 },
    { name: "David Kim", university: "University of British Columbia", country: "Canada", course: "PhD in Physics", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", text: "Nobal Navigator's expertise was evident in how they guided me through research proposals and connecting with potential supervisors.", rating: 5 },
    { name: "Aisha Mohammed", university: "KTH Royal Institute of Technology", country: "Sweden", course: "Master's in Sustainable Energy", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", text: "Their support with accommodation and pre-departure preparations was also very helpful. Wonderful experience!", rating: 5 },
  ];

  const stats = [
    { number: "1000+", label: "Happy Students" },
    { number: "98%", label: "Success Rate" },
    { number: "50+", label: "Partner Universities" },
    { number: "4.9/5", label: "Average Rating" },
  ];

  const universities = [
    "University of Oxford", "Harvard University", "University of Toronto",
    "University of Melbourne", "Technical University of Munich", "University College Dublin",
    "ETH Zurich", "University of British Columbia", "KTH Royal Institute of Technology",
    "University of Helsinki", "University of Cyprus", "Australian National University",
  ];

  const [statsRef, statsVisible] = useReveal();

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSlider />

      {/* Stats */}
      <section className="py-14 bg-blue-50">
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center" style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`,
              }}>
                <div className="text-4xl md:text-5xl text-blue-600 mb-2 font-bold">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">What Our Students Say</h2>
            <p className="text-xl text-gray-600">Real experiences from students we've helped succeed</p>
          </AnimSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimSection key={i} delay={i * 0.08} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-blue-200 mb-4" />
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <ImageWithFallback src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <div className="text-blue-900 font-semibold">{t.name}</div>
                          <div className="text-sm text-gray-500">{t.country}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">{t.university}</div>
                        <div className="text-blue-600">{t.course}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Universities */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Our Partner Universities</h2>
            <p className="text-xl text-gray-600">We work with prestigious institutions worldwide</p>
          </AnimSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {universities.map((university, i) => (
              <AnimSection key={i} delay={i * 0.06} direction="up">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 text-2xl">🎓</span>
                    </div>
                    <div className="text-gray-700 font-medium text-sm">{university}</div>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Video Testimonials</h2>
            <p className="text-xl text-gray-600">Watch our students share their experiences</p>
          </AnimSection>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, i) => (
              <AnimSection key={item} delay={i * 0.15} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 aspect-video flex items-center justify-center group cursor-pointer">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 group-hover:scale-110 shadow-xl">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-gray-700 font-medium">Student Success Story {item}</div>
                    <div className="text-sm text-gray-500">Watch how we helped them succeed</div>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimSection>
        <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl mb-6 font-bold">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-blue-100 mb-8">Join thousands of successful students who achieved their study abroad dreams with Nobal Navigator.</p>
            <a href="/book">
              <button className="bg-white text-blue-900 px-10 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-semibold text-lg">
                Book Your Free Consultation
              </button>
            </a>
          </div>
        </section>
      </AnimSection>
    </div>
  );
}