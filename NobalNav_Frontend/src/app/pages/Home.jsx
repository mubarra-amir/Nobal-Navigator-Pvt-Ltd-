import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  GraduationCap, Globe, Users, Award, CheckCircle, ArrowRight,
  MapPin, Clock, Star, ChevronLeft, ChevronRight
} from "lucide-react";

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

/* ── Hero Slides ───────────────────────────────────── */
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1735613981597-78903fbe4156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwYWJyb2FkJTIwZ3JhZHVhdGlvbnxlbnwxfHx8fDE3NzQ3ODc3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Study Abroad",
    headline: "Your Gateway to",
    highlight: "Global Education",
    sub: "Expert consultancy for study abroad programs and visa assistance. Turn your international education dreams into reality.",
  },
  {
    image: "https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaW50ZXJuYXRpb25hbCUyMHN0dWRlbnRzfGVufDF8fHx8MTc3NDc4Nzc4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "50+ Universities",
    headline: "Premium University",
    highlight: "Partnerships",
    sub: "Gain access to top-ranked universities across the UK, USA, Canada, Australia, Europe and beyond.",
  },
  {
    image: "https://images.unsplash.com/photo-1760348082270-3a46a3512850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzZnVsJTIwc3R1ZGVudCUyMGNlbGVicmF0aW5nfGVufDF8fHx8MTc3NDc4Nzc4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "98% Success Rate",
    headline: "Real Results,",
    highlight: "Real Dreams",
    sub: "Over 1,000 students successfully placed in prestigious universities with a 98% visa approval rate.",
  },
  {
    image: "https://images.unsplash.com/photo-1758928807847-ed94f9ed3cad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzcG9ydCUyMHZpc2ElMjB0cmF2ZWwlMjBkb2N1bWVudHN8ZW58MXx8fHwxNzc0Nzg3Nzg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: "Visa Assistance",
    headline: "Stress-Free",
    highlight: "Visa Processing",
    sub: "Complete visa documentation support and expert guidance ensuring your application is perfect from day one.",
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
    setTimeout(() => {
      setCurrent(idx);
      setAnimKey(k => k + 1);
      setTransitioning(false);
    }, 600);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 620 }}>
      <style>{`
        @keyframes kbZoom   { from{transform:scale(1)} to{transform:scale(1.08)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes fadeOut  { from{opacity:1} to{opacity:0} }
        @keyframes tagIn    { 0%{opacity:0;transform:scale(.75) translateY(-12px)} 70%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(36px);filter:blur(4px)} to{opacity:1;transform:translateY(0);filter:blur(0)} }
        @keyframes barFill  { from{width:0%} to{width:100%} }
        @keyframes dotPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
        .kb    { animation: kbZoom 8s ease-out forwards; }
        .fade-in  { animation: fadeIn 0.8s ease forwards; }
        .fade-out { animation: fadeOut 0.5s ease forwards; }
        .tag-in  { animation: tagIn  0.55s 0.05s both cubic-bezier(.34,1.56,.64,1); }
        .su-1    { animation: slideUp 0.65s 0.15s both; }
        .su-2    { animation: slideUp 0.65s 0.30s both; }
        .su-3    { animation: slideUp 0.65s 0.45s both; }
        .su-4    { animation: slideUp 0.65s 0.60s both; }
        .dot-active { animation: dotPulse .4s ease; }
      `}</style>

      {/* Background slides */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={s.image} alt=""
            className={`w-full h-full object-cover ${i === current ? "kb" : ""}`}
            style={{ minHeight: 620 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/60 to-blue-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 620 }}>
        <div className="max-w-2xl py-24" key={animKey}>
          <span className="tag-in inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 backdrop-blur-sm text-blue-200 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full pulse-soft" />
            {slide.tag}
          </span>
          <h1 className="su-1 text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-2">
            {slide.headline}
          </h1>
          <h1 className="su-2 text-5xl md:text-6xl lg:text-7xl leading-tight mb-6" style={{
            background: "linear-gradient(135deg, #60a5fa, #a5f3fc, #93c5fd)",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            {slide.highlight}
          </h1>
          <p className="su-3 text-blue-100 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            {slide.sub}
          </p>
          <div className="su-4 flex flex-wrap gap-4">
            <Link to="/book">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-xl shadow-blue-900/50 transition-all duration-300 hover:-translate-y-1">
                Book FREE Consultation <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dots — no progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? "w-8 h-3 bg-blue-400"
                : "w-3 h-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 hover:scale-110">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 hover:scale-110">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide counter */}
      <div className="absolute top-8 right-8 z-30 text-white/50 text-sm font-mono tracking-widest">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </section>
  );
}

/* ── Animated Section Wrapper ─────────────────────── */
function AnimSection({ children, className = "", direction = "up", delay = 0 }) {
  const [ref, visible] = useReveal();
  const baseStyle = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "none"
      : direction === "up" ? "translateY(40px)"
      : direction === "left" ? "translateX(-50px)"
      : direction === "right" ? "translateX(50px)"
      : "scale(0.9)",
    transition: `opacity 0.7s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.7s ${delay}s cubic-bezier(.22,1,.36,1)`,
  };
  return <div ref={ref} className={className} style={baseStyle}>{children}</div>;
}

/* ── Main Component ───────────────────────────────── */
export default function Home() {
  const countries = [
    { name: "United Kingdom", image: "https://images.unsplash.com/photo-1649162458697-cda48dea1ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVbml0ZWQlMjBLaW5nZG9tJTIwTG9uZG9uJTIwbGFuZG1hcmtzfGVufDF8fHx8MTc3NTI5MDU2MHww&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Ireland", image: "https://images.unsplash.com/photo-1623184506225-8f85bcb5c3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJcmVsYW5kJTIwRHVibGluJTIwZ3JlZW4lMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc1MjkwNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Sweden", image: "https://images.unsplash.com/photo-1663058629330-7bdc15b0681a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTd2VkZW4lMjBTdG9ja2hvbG0lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc1MjkwNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Finland", image: "https://images.unsplash.com/photo-1517078556925-fdb0909b1483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGaW5sYW5kJTIwSGVsc2lua2klMjBuYXR1cmV8ZW58MXx8fHwxNzc1MjkwNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "USA", image: "https://images.unsplash.com/photo-1643678469017-10c1600dc8bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVU0ElMjBOZXclMjBZb3JrJTIwc2t5bGluZXxlbnwxfHx8fDE3NzUyOTA1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Australia", image: "https://images.unsplash.com/photo-1718185795639-c442aff612cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBdXN0cmFsaWElMjBTeWRuZXklMjBPcGVyYSUyMEhvdXNlfGVufDF8fHx8MTc3NTI5MDU2Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Canada", image: "https://images.unsplash.com/photo-1666490971707-d499de4c532b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGElMjBUb3JvbnRvJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3NTI5MDU2M3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Cyprus", image: "https://images.unsplash.com/photo-1710106793368-82f483165c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDeXBydXMlMjBNZWRpdGVycmFuZWFuJTIwYmVhY2h8ZW58MXx8fHwxNzc1MjkwNTYzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Europe", image: "https://images.unsplash.com/photo-1722409706045-f76ae8f9abe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFdXJvcGUlMjBQYXJpcyUyMEVpZmZlbCUyMFRvd2VyfGVufDF8fHx8MTc3NTI5MDU2NHww&ixlib=rb-4.1.0&q=80&w=1080" },
  ];

  const services = [
    { icon: GraduationCap, title: "Study Abroad Consultancy", description: "Expert guidance for pursuing higher education in top universities worldwide." },
    { icon: Globe, title: "Visa Assistance", description: "Complete visa support including documentation and application processing." },
    { icon: Users, title: "University Selection", description: "Personalized university recommendations based on your profile and goals." },
    { icon: Award, title: "Application Support", description: "End-to-end assistance with application forms, essays, and documentation." },
  ];

  const stats = [
    { number: "1000+", label: "Students Placed" },
    { number: "50+", label: "Partner Universities" },
    { number: "9", label: "Countries" },
    { number: "98%", label: "Success Rate" },
  ];

  const testimonials = [
    { name: "Sarah Johnson", country: "UK", text: "Nobal Navigator made my dream of studying at Oxford a reality. Their guidance was invaluable!", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { name: "Raj Patel", country: "Canada", text: "The visa process seemed daunting, but the team handled everything smoothly. Highly recommended!", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    { name: "Emma Williams", country: "Australia", text: "Professional, responsive, and genuinely caring. They helped me secure admission to my top choice!", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  ];

  /* Stats section ref */
  const [statsRef, statsVisible] = useReveal();

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero */}
      <HeroSlider />

      {/* Stats */}
      <section className="py-14 bg-blue-50">
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`,
                }}
              >
                <div className="text-4xl md:text-5xl text-blue-600 mb-2 font-bold">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4">Study Destinations We Serve</h2>
            <p className="text-xl text-gray-600">Choose from top educational destinations worldwide</p>
          </AnimSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {countries.map((country, i) => (
              <AnimSection key={i} delay={i * 0.07} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative h-32 overflow-hidden">
                      <ImageWithFallback
                        src={country.image} alt={country.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 text-center bg-white">
                      <div className="text-sm text-gray-700 font-medium">{country.name}</div>
                    </div>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive support for your study abroad journey</p>
          </AnimSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <AnimSection key={i} delay={i * 0.1} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                      <service.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl text-blue-900 mb-3 font-semibold">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimSection direction="left">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaW50ZXJuYXRpb25hbCUyMHN0dWRlbnRzfGVufDF8fHx8MTc3NDc4Nzc4OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="University campus with international students"
                  className="rounded-2xl shadow-2xl w-full h-[420px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white rounded-2xl px-6 py-4 shadow-xl">
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-blue-200 text-sm">Success Rate</div>
                </div>
              </div>
            </AnimSection>
            <AnimSection direction="right">
              <h2 className="text-3xl md:text-4xl text-blue-900 mb-8 font-bold">Why Choose Nobal Navigator?</h2>
              <div className="space-y-5">
                {[
                  { title: "Expert Counselors", desc: "Experienced team with in-depth knowledge of international education systems." },
                  { title: "End-to-End Support", desc: "From university selection to visa approval and pre-departure guidance." },
                  { title: "High Success Rate", desc: "98% visa approval rate and successful placements in top universities." },
                  { title: "Personalized Approach", desc: "Tailored guidance based on your academic profile and career goals." },
                ].map((item, i) => (
                  <AnimSection key={i} delay={i * 0.1}>
                    <div className="flex gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg text-blue-900 mb-1 font-semibold">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  </AnimSection>
                ))}
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600">Success stories from students who achieved their dreams</p>
          </AnimSection>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimSection key={i} delay={i * 0.15} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <ImageWithFallback src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="text-blue-900 font-medium">{t.name}</div>
                        <div className="text-sm text-gray-500">Studying in {t.country}</div>
                      </div>
                    </div>
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
            <h2 className="text-3xl md:text-4xl mb-6 font-bold">Ready to Start Your Study Abroad Journey?</h2>
            <p className="text-xl text-blue-100 mb-10">
              Book a FREE consultation with our expert counselors today and take the first step towards your global education dreams.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Clock className="mr-2 w-5 h-5" />
                  Book FREE Appointment Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-900 transition-all duration-300 hover:-translate-y-1">
                  <MapPin className="mr-2 w-5 h-5" />
                  Find Our Office
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimSection>
    </div>
  );
}