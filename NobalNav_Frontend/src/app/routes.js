import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import OurClients from "./pages/OurClients";
import Portfolio from "./pages/Portfolio";
import ContactUs from "./pages/ContactUs";
import BookAppointment from "./pages/BookAppointment";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: AboutUs },
      { path: "clients", Component: OurClients },
      { path: "portfolio", Component: Portfolio },
      { path: "contact", Component: ContactUs },
      { path: "book", Component: BookAppointment },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin",
    children: [
      { index: true, Component: AdminLogin },
      { path: "dashboard", Component: AdminDashboard },
    ],
  },
]);