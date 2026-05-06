import { useState, useEffect } from "react";
import { Cookie, X, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { Button } from "./ui/button";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("nn_cookie_consent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("nn_cookie_consent", "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("nn_cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 pointer-events-none" />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
        style={{ animation: "slideUpBanner 0.4s cubic-bezier(.22,1,.36,1) both" }}
      >
        <style>{`
          @keyframes slideUpBanner {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mt-0.5">
                <Cookie className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-900 font-semibold text-base">We use cookies</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2 py-0.5 font-medium">
                    Privacy Notice
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Nobal Navigator uses cookies to keep you logged in and improve your experience.
                  We use <strong className="text-gray-700">httpOnly session cookies</strong> for secure
                  authentication — these cannot be read by scripts.
                </p>

                {showDetails && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Session Cookie (nn_token)</p>
                        <p className="text-xs text-gray-500">Required for login. Stored as httpOnly — inaccessible to JavaScript for your security. Expires after 7 days.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Cookie className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Local Storage (nn_user)</p>
                        <p className="text-xs text-gray-500">Stores non-sensitive profile info (name, email) locally so your name appears in the app without an extra server request.</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 pt-1">
                      If you reject cookies, you can still browse the site but you will not be able to log in or book appointments.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {showDetails
                    ? <><ChevronUp className="w-3 h-3" /> Hide details</>
                    : <><ChevronDown className="w-3 h-3" /> What cookies do we use?</>
                  }
                </button>
              </div>

              <button
                onClick={reject}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                title="Reject all cookies"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                onClick={reject}
                variant="outline"
                className="h-9 px-5 text-sm border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all"
              >
                Reject All
              </Button>
              <Button
                onClick={accept}
                className="h-9 px-6 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5"
              >
                Accept Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}