import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <h1 className="text-9xl mb-4">404</h1>
        <h2 className="text-4xl mb-6">Page Not Found</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}