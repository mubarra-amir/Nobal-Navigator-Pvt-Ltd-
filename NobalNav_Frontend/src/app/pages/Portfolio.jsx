import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { GraduationCap, MapPin, Calendar, Award, ChevronLeft, ChevronRight } from "lucide-react";

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
    image: "https://images.unsplash.com/photo-1760348082270-3a46a3512850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    tag: "Portfolio",
    headline: "Celebrating",
    highlight: "Student Success",
    sub: "Real students, real achievements — over 1000 dreams turned into reality.",
  },
  {
    image: "https://images.unsplash.com/photo-1735613981597-78903fbe4156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    tag: "$2M+ Scholarships",
    headline: "Extraordinary",
    highlight: "Outcomes",
    sub: "Millions in scholarships secured for deserving students worldwide.",
  },
  {
    image: "https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    tag: "Top Universities",
    headline: "Prestigious",
    highlight: "Placements",
    sub: "Our students study at Oxford, Harvard, MIT, and top institutions globally.",
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
        @keyframes kb4  { from{transform:scale(1)} to{transform:scale(1.07)} }
        @keyframes su4  { from{opacity:0;transform:translateY(30px);filter:blur(3px)} to{opacity:1;transform:translateY(0);filter:blur(0)} }
        @keyframes tag4 { 0%{opacity:0;transform:scale(.75)} 100%{opacity:1;transform:scale(1)} }
        .kb4  { animation: kb4 8s ease-out forwards; }
        .t4   { animation: tag4 0.55s 0.05s both; }
        .s4-1 { animation: su4 0.65s 0.15s both; }
        .s4-2 { animation: su4 0.65s 0.30s both; }
        .s4-3 { animation: su4 0.65s 0.45s both; }
      `}</style>
      {heroSlides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={s.image} alt="" className={`w-full h-full object-cover ${i === current ? "kb4" : ""}`} style={{ minHeight: 500 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent" />
        </div>
      ))}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 500 }}>
        <div className="max-w-2xl py-20" key={animKey}>
          <span className="t4 inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 text-sm px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />{slide.tag}
          </span>
          <h1 className="s4-1 text-4xl md:text-6xl text-white font-bold leading-tight mb-2">{slide.headline}</h1>
          <h1 className="s4-2 text-4xl md:text-6xl font-bold leading-tight mb-5" style={{
            background: "linear-gradient(135deg,#60a5fa,#a5f3fc)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>{slide.highlight}</h1>
          <p className="s4-3 text-blue-100 text-lg max-w-xl leading-relaxed">{slide.sub}</p>
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

export default function Portfolio() {
  const [selectedCountry, setSelectedCountry] = useState("all");

  const successStories = [
    { name: "Ananya Reddy", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop", country: "UK", university: "Imperial College London", course: "Master's in Artificial Intelligence", year: "2024", achievement: "Received £15,000 scholarship", story: "From a small town in India to one of the world's top tech universities." },
    { name: "James Mitchell", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", country: "Canada", university: "McGill University", course: "Bachelor's in Medicine", year: "2023", achievement: "Full tuition scholarship", story: "Secured admission and full funding at one of Canada's most prestigious medical schools." },
    { name: "Li Wei", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop", country: "Australia", university: "Australian National University", course: "PhD in Quantum Physics", year: "2024", achievement: "Research fellowship awarded", story: "Exceptional research proposal and our guidance helped secure a competitive research position." },
    { name: "Sofia Martinez", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop", country: "USA", university: "Stanford University", course: "MBA", year: "2023", achievement: "$50,000 merit scholarship", story: "Strategic application guidance led to admission at Stanford GSB with significant funding." },
    { name: "Yuki Tanaka", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop", country: "Europe", university: "University of Helsinki", course: "Master's in Environmental Science", year: "2024", achievement: "Selected for research project", story: "Passion for sustainability perfectly matched with Helsinki's cutting-edge programs." },
    { name: "Mohammed Al-Rashid", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop", country: "Europe", university: "KTH Royal Institute of Technology", course: "Master's in Sustainable Engineering", year: "2023", achievement: "Swedish Institute Scholarship", story: "Innovative approach to sustainable technology impressed the admissions committee." },
    { name: "Emma O'Connor", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop", country: "Europe", university: "Trinity College Dublin", course: "Master's in Computer Science", year: "2024", achievement: "Dean's List Scholar", story: "Strong academic background and our application strategy secured a prestigious scholarship." },
    { name: "Alex Petrov", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop", country: "Europe", university: "University of Cyprus", course: "Master's in International Business", year: "2023", achievement: "EU scholarship recipient", story: "International business acumen and multilingual skills made him ideal for Cyprus." },
  ];

  const placementStats = {
    "2024": { totalStudents: 250, countries: ["UK", "USA", "Canada", "Australia", "Europe"], topUniversities: 15, scholarships: 180 },
    "2023": { totalStudents: 220, countries: ["UK", "USA", "Canada", "Australia", "Europe"], topUniversities: 12, scholarships: 155 },
    "2022": { totalStudents: 180, countries: ["UK", "USA", "Canada", "Australia"], topUniversities: 10, scholarships: 120 },
  };

  const achievements = [
    { icon: "🎓", number: "1000+", label: "Students Placed" },
    { icon: "🏆", number: "98%", label: "Visa Success Rate" },
    { icon: "💰", number: "$2M+", label: "Scholarships Secured" },
    { icon: "🌍", number: "50+", label: "Partner Universities" },
  ];

  const countries = ["all", "UK", "USA", "Canada", "Australia", "Europe"];
  const filteredStories = selectedCountry === "all" ? successStories : successStories.filter(s => s.country === selectedCountry);

  const [achRef, achVisible] = useReveal();

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSlider />

      {/* Achievements */}
      <section className="py-14 bg-blue-50">
        <div ref={achRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((a, i) => (
              <div key={i} className="text-center" style={{
                opacity: achVisible ? 1 : 0,
                transform: achVisible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`,
              }}>
                <div className="text-5xl mb-2">{a.icon}</div>
                <div className="text-4xl text-blue-600 mb-2 font-bold">{a.number}</div>
                <div className="text-gray-600">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Student Success Stories</h2>
            <p className="text-xl text-gray-600 mb-8">Real students, real achievements, real impact</p>
            <div className="flex flex-wrap justify-center gap-2">
              {countries.map((country) => (
                <button key={country} onClick={() => setSelectedCountry(country)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${selectedCountry === country ? "bg-blue-600 text-white shadow-lg" : "bg-blue-50 text-blue-900 hover:bg-blue-100 hover:shadow-md"}`}>
                  {country === "all" ? "All Countries" : country}
                </button>
              ))}
            </div>
          </AnimSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story, i) => (
              <AnimSection key={i} delay={i * 0.08} direction="up">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full">
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50">
                    <ImageWithFallback src={story.photo} alt={story.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{story.country}</div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl text-blue-900 mb-3 font-bold">{story.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600"><GraduationCap className="w-4 h-4 text-blue-600 flex-shrink-0" /><span className="text-sm">{story.course}</span></div>
                      <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" /><span className="text-sm">{story.university}</span></div>
                      <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" /><span className="text-sm">Class of {story.year}</span></div>
                      <div className="flex items-center gap-2 text-blue-600"><Award className="w-4 h-4 flex-shrink-0" /><span className="text-sm font-medium">{story.achievement}</span></div>
                    </div>
                    <p className="text-gray-600 text-sm italic">"{story.story}"</p>
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Stats */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Placement Statistics</h2>
            <p className="text-xl text-gray-600">Year-by-year breakdown of our success</p>
          </AnimSection>
          <Tabs defaultValue="2024" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="2024">2024</TabsTrigger>
              <TabsTrigger value="2023">2023</TabsTrigger>
              <TabsTrigger value="2022">2022</TabsTrigger>
            </TabsList>
            {Object.entries(placementStats).map(([year, stats]) => (
              <TabsContent key={year} value={year} className="mt-8">
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { val: stats.totalStudents, label: "Total Students" },
                    { val: stats.countries.length, label: "Countries" },
                    { val: stats.topUniversities, label: "Top 50 Unis" },
                    { val: stats.scholarships, label: "Scholarships" },
                  ].map((item, i) => (
                    <AnimSection key={i} delay={i * 0.1} direction="scale">
                      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl text-blue-600 mb-2 font-bold">{item.val}</div>
                          <div className="text-gray-600">{item.label}</div>
                        </CardContent>
                      </Card>
                    </AnimSection>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Celebration Moments</h2>
            <p className="text-xl text-gray-600">Capturing the joy of success</p>
          </AnimSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1760348082270-3a46a3512850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80", alt: "Students celebrating" },
              { src: "https://images.unsplash.com/photo-1735613981597-78903fbe4156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80", alt: "Graduation celebration" },
              { src: "https://images.unsplash.com/photo-1648301033733-44554c74ec50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80", alt: "Campus life" },
              { src: "https://images.unsplash.com/photo-1758928807847-ed94f9ed3cad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80", alt: "Travel documents" },
            ].map((img, i) => (
              <AnimSection key={i} delay={i * 0.1} direction="scale">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl overflow-hidden">
                  <ImageWithFallback src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimSection>
        <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl mb-6 font-bold">Be Our Next Success Story</h2>
            <p className="text-xl text-blue-100 mb-8">Join hundreds of successful students who turned their study abroad dreams into reality with Nobal Navigator.</p>
            <a href="/book">
              <button className="bg-white text-blue-900 px-10 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-semibold text-lg">
                Start Your Journey Today
              </button>
            </a>
          </div>
        </section>
      </AnimSection>
    </div>
  );
}