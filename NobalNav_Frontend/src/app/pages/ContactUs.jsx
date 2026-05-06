// ============================================================
//  ContactUs.jsx  — Hero Slider + Scroll Animations
// ============================================================
import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, ChevronLeft, ChevronRight } from "lucide-react";

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
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=1080&q=80&fit=crop",
    tag: "Contact Us",
    headline: "We're Here",
    highlight: "To Help You",
    sub: "Get in touch with our expert team. We're here to answer your questions and guide you.",
  },
  {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&q=80&fit=crop",
    tag: "24hr Response",
    headline: "Reach Out",
    highlight: "Anytime",
    sub: "Our team responds within 24 hours. Book a free consultation today.",
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
    <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
      <style>{`
        @keyframes kb3  { from{transform:scale(1)} to{transform:scale(1.07)} }
        @keyframes su3  { from{opacity:0;transform:translateY(30px);filter:blur(3px)} to{opacity:1;transform:translateY(0);filter:blur(0)} }
        @keyframes tag3 { 0%{opacity:0;transform:scale(.75)} 100%{opacity:1;transform:scale(1)} }
        .kb3  { animation: kb3 8s ease-out forwards; }
        .t3   { animation: tag3 0.55s 0.05s both; }
        .s3-1 { animation: su3 0.65s 0.15s both; }
        .s3-2 { animation: su3 0.65s 0.30s both; }
        .s3-3 { animation: su3 0.65s 0.45s both; }
      `}</style>
      {heroSlides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={s.image} alt="" className={`w-full h-full object-cover ${i === current ? "kb3" : ""}`} style={{ minHeight: 480 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent" />
        </div>
      ))}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: 480 }}>
        <div className="max-w-2xl py-20" key={animKey}>
          <span className="t3 inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 text-sm px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />{slide.tag}
          </span>
          <h1 className="s3-1 text-4xl md:text-6xl text-white font-bold leading-tight mb-2">{slide.headline}</h1>
          <h1 className="s3-2 text-4xl md:text-6xl font-bold leading-tight mb-5" style={{
            background: "linear-gradient(135deg,#60a5fa,#a5f3fc)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>{slide.highlight}</h1>
          <p className="s3-3 text-blue-100 text-lg max-w-xl leading-relaxed">{slide.sub}</p>
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

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: "Visit Our Office", details: ["123 Education Street", "Business District", "City, State 12345"] },
    { icon: Phone, title: "Call Us", details: ["+1 (234) 567-8900", "+1 (234) 567-8901", "Mon-Sat: 9 AM - 6 PM"] },
    { icon: Mail, title: "Email Us", details: ["info@nobalnavigator.com", "support@nobalnavigator.com", "We reply within 24 hours"] },
    { icon: Clock, title: "Business Hours", details: ["Monday - Friday: 9 AM - 6 PM", "Saturday: 10 AM - 4 PM", "Sunday: Closed"] },
  ];

  const offices = [
    { city: "Main Office", address: "123 Education Street, Business District, City 12345", phone: "+1 (234) 567-8900", email: "info@nobalnavigator.com" },
    { city: "Regional Office", address: "456 University Avenue, Downtown, City 67890", phone: "+1 (234) 567-8901", email: "regional@nobalnavigator.com" },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSlider />

      {/* Contact Info Cards */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <AnimSection key={i} delay={i * 0.1} direction="up">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl text-blue-900 mb-3 font-semibold">{info.title}</h3>
                    {info.details.map((d, j) => <p key={j} className="text-gray-600 text-sm mb-1">{d}</p>)}
                  </CardContent>
                </Card>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimSection direction="left">
              <h2 className="text-3xl text-blue-900 mb-4 font-bold">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { id: "name", label: "Full Name *", type: "text", placeholder: "John Doe" },
                  { id: "email", label: "Email Address *", type: "email", placeholder: "john@example.com" },
                  { id: "phone", label: "Phone Number *", type: "tel", placeholder: "+1 (234) 567-8900" },
                  { id: "subject", label: "Subject *", type: "text", placeholder: "Inquiry about study abroad programs" },
                ].map(f => (
                  <div key={f.id}>
                    <Label htmlFor={f.id}>{f.label}</Label>
                    <Input id={f.id} name={f.id} type={f.type} value={formData[f.id]}
                      onChange={handleChange} placeholder={f.placeholder} required className="mt-1 transition-all focus:shadow-md" />
                  </div>
                ))}
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange}
                    placeholder="Tell us about your study abroad goals..." required className="mt-1 min-h-[140px] transition-all focus:shadow-md" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  {isSubmitting ? "Sending..." : <><Send className="mr-2 w-4 h-4" />Send Message</>}
                </Button>
              </form>
            </AnimSection>

            <AnimSection direction="right">
              <h2 className="text-3xl text-blue-900 mb-6 font-bold">Visit Our Offices</h2>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl h-64 mb-8 flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Find us on Google Maps</p>
                </div>
              </div>
              <div className="space-y-5">
                {offices.map((office, i) => (
                  <AnimSection key={i} delay={i * 0.1}>
                    <Card className="hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl text-blue-900 mb-3 font-semibold">{office.city}</h3>
                        <div className="space-y-2 text-gray-600">
                          {[
                            { Icon: MapPin, val: office.address },
                            { Icon: Phone, val: office.phone, href: `tel:${office.phone}` },
                            { Icon: Mail, val: office.email, href: `mailto:${office.email}` },
                          ].map(({ Icon, val, href }, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <Icon className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                              {href ? <a href={href} className="text-sm hover:text-blue-600 transition-colors">{val}</a>
                                : <span className="text-sm">{val}</span>}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </AnimSection>
                ))}
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-blue-900 mb-4 font-bold">Frequently Asked Questions</h2>
          </AnimSection>
          <div className="space-y-4">
            {[
              { q: "How long does the consultation process take?", a: "Our initial consultation typically lasts 60-90 minutes. During this time, we assess your profile, discuss your goals, and recommend suitable universities and programs." },
              { q: "What documents do I need to bring?", a: "Please bring your academic transcripts, standardized test scores (if available), passport copy, and any relevant certificates or work experience documents." },
              { q: "Do you charge for the initial consultation?", a: "We offer a free initial consultation to understand your needs and explain our services. Detailed service charges will be discussed during the meeting." },
              { q: "How long does the visa process take?", a: "Visa processing times vary by country. Typically, student visas take 4-8 weeks for processing. We guide you through every step to ensure timely submission." },
            ].map((faq, i) => (
              <AnimSection key={i} delay={i * 0.1} direction="up">
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg text-blue-900 mb-2 font-semibold">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
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
            <h2 className="text-3xl md:text-4xl mb-6 font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">Book a free consultation with our expert counselors and take the first step towards your study abroad dreams.</p>
            <a href="/book">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                Book Free Consultation
              </Button>
            </a>
          </div>
        </section>
      </AnimSection>
    </div>
  );
}