import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Calendar } from "../components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import api from "../../api";   // ← axios instance with JWT interceptor

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", country: "", educationLevel: "", message: "" });

  const services = [
    "Study Abroad Consultation - UK", "Study Abroad Consultation - USA",
    "Study Abroad Consultation - Canada", "Study Abroad Consultation - Australia",
    "Study Abroad Consultation - Europe", "Visa Assistance",
    "University Selection Guidance", "Application Support", "General Inquiry",
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  ];

  const countries = ["United Kingdom", "United States", "Canada", "Australia", "Ireland", "Sweden", "Finland", "Germany", "France", "Cyprus", "Other"];
  const educationLevels = ["High School", "Undergraduate", "Graduate/Master's", "PhD/Doctorate", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && !selectedDate) { toast.error("Please select a date"); return; }
    if (step === 2 && !selectedTime) { toast.error("Please select a time slot"); return; }
    if (step === 3 && !selectedService) { toast.error("Please select a service"); return; }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      // JWT token is automatically attached by the axios interceptor in api.js
      await api.post("/appointments/book", {
        ...formData,
        service: selectedService,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
      });
      setStep(5);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const isWeekend = (date) => date.getDay() === 0;

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mb-6">Book Your Consultation</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Schedule a free consultation with our expert counselors</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {[{ num: 1, label: "Select Date" }, { num: 2, label: "Choose Time" }, { num: 3, label: "Select Service" }, { num: 4, label: "Your Details" }].map((stepItem) => (
                <div key={stepItem.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step >= stepItem.num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                      {step > stepItem.num ? <CheckCircle2 className="w-5 h-5" /> : stepItem.num}
                    </div>
                    <span className="text-sm mt-2 text-gray-600 hidden sm:block">{stepItem.label}</span>
                  </div>
                  {stepItem.num < 4 && (
                    <div className={`h-1 flex-1 mx-2 transition-colors ${step > stepItem.num ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl text-blue-900 mb-6">Select a Date</h2>
                  <div className="flex justify-center">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || isWeekend(date)} className="rounded-md border" />
                  </div>
                  {selectedDate && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-blue-900">Selected Date: <span className="font-semibold">{format(selectedDate, "PPPP")}</span></p>
                    </div>
                  )}
                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleNext} disabled={!selectedDate} className="bg-blue-600 hover:bg-blue-700">
                      Next Step <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl text-blue-900 mb-6">Choose Time Slot</h2>
                  <p className="text-gray-600 mb-6">Selected Date: <span className="font-semibold">{selectedDate && format(selectedDate, "PPPP")}</span></p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button key={time} onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 transition-all ${selectedTime === time ? "border-blue-600 bg-blue-50 text-blue-900" : "border-gray-200 hover:border-blue-300"}`}>
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-sm">{time}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button onClick={() => setStep(step - 1)} variant="outline">Back</Button>
                    <Button onClick={handleNext} disabled={!selectedTime} className="bg-blue-600 hover:bg-blue-700">
                      Next Step <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl text-blue-900 mb-6">Select Service</h2>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <button key={service} onClick={() => setSelectedService(service)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedService === service ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedService === service ? "border-blue-600" : "border-gray-300"}`}>
                            {selectedService === service && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                          </div>
                          <span className={selectedService === service ? "text-blue-900" : "text-gray-700"}>{service}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button onClick={() => setStep(step - 1)} variant="outline">Back</Button>
                    <Button onClick={handleNext} disabled={!selectedService} className="bg-blue-600 hover:bg-blue-700">
                      Next Step <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl text-blue-900 mb-6">Your Details</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (234) 567-8900" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="country">Preferred Study Destination</Label>
                      <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select a country" /></SelectTrigger>
                        <SelectContent>{countries.map((country) => <SelectItem key={country} value={country}>{country}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="educationLevel">Current Education Level</Label>
                      <Select value={formData.educationLevel} onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select your education level" /></SelectTrigger>
                        <SelectContent>{educationLevels.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="message">Additional Message (Optional)</Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange}
                        placeholder="Tell us more about your goals..." className="mt-1 min-h-[100px]" />
                    </div>
                    <div className="flex justify-between">
                      <Button type="button" onClick={() => setStep(step - 1)} variant="outline">Back</Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Confirm Booking</Button>
                    </div>
                  </form>
                </div>
              )}

              {step === 5 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl text-blue-900 mb-4">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-8">
                    Your appointment has been successfully scheduled. We've sent a confirmation email to{" "}
                    <span className="font-semibold">{formData.email}</span>
                  </p>
                  <Card className="bg-blue-50 border-blue-200 mb-8">
                    <CardContent className="p-6">
                      <h3 className="text-xl text-blue-900 mb-4">Appointment Details</h3>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-blue-600" /><span>{selectedDate && format(selectedDate, "PPPP")}</span></div>
                        <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-blue-600" /><span>{selectedTime}</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" /><span>{selectedService}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">You will receive a reminder email 24 hours before your appointment.</p>
                    <div className="flex gap-4 justify-center">
                      <a href="/"><Button variant="outline">Back to Home</Button></a>
                      <a href="/contact"><Button className="bg-blue-600 hover:bg-blue-700">Contact Us</Button></a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {step < 5 && (
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <Card><CardContent className="p-6"><Clock className="w-8 h-8 text-blue-600 mb-3" /><h3 className="text-lg text-blue-900 mb-2">Duration</h3><p className="text-sm text-gray-600">60-90 minutes consultation</p></CardContent></Card>
              <Card><CardContent className="p-6"><CheckCircle2 className="w-8 h-8 text-blue-600 mb-3" /><h3 className="text-lg text-blue-900 mb-2">Free Service</h3><p className="text-sm text-gray-600">Initial consultation is completely free</p></CardContent></Card>
              <Card><CardContent className="p-6"><CalendarIcon className="w-8 h-8 text-blue-600 mb-3" /><h3 className="text-lg text-blue-900 mb-2">Flexible</h3><p className="text-sm text-gray-600">Easy rescheduling options available</p></CardContent></Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}