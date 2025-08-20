// "use client";

// import { useState, useEffect } from "react";
// import { Home, ArrowLeft, Search, RefreshCw } from "lucide-react";

// export default function NotFound() {
//   const [countdown, setCountdown] = useState(30);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           window.location.href = "/";
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const handleGoHome = () => {
//     window.location.href = "/login";
//   };

//   const handleGoBack = () => {
//     window.history.back();
//   };

//   const handleRefresh = () => {
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full text-center">
//         {/* 404 Number */}
//         <div className="mb-8">
//           <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
//           <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
//         </div>

//         {/* Error Message */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">
//             Page Not Found
//           </h2>
//           <p className="text-gray-600 text-lg mb-6">
//             Sorry, the page you are looking for doesn't exist or has been moved.
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="space-y-4 mb-8">
//           <button
//             onClick={handleGoHome}
//             className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
//           >
//             <Home className="mr-2 h-5 w-5" />
//             Go to Homepage
//           </button>

//           <div className="flex space-x-3">
//             <button
//               onClick={handleGoBack}
//               className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Go Back
//             </button>

//             <button
//               onClick={handleRefresh}
//               className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
//             >
//               <RefreshCw className="mr-2 h-4 w-4" />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Auto Redirect Notice */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <div className="flex items-center justify-center">
//             <div className="flex-shrink-0">
//               <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-blue-800">
//                 Redirecting to homepage in{" "}
//                 <span className="font-bold text-blue-600">{countdown}</span>{" "}
//                 seconds
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Search Suggestion */}
//         <div className="mt-8 pt-8 border-t border-gray-200">
//           <div className="flex items-center justify-center text-gray-500 mb-4">
//             <Search className="h-5 w-5 mr-2" />
//             <span className="text-sm">Looking for something specific?</span>
//           </div>
//           <div className="flex space-x-4 text-sm">
//             <a
//               href="/login"
//               className="text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline cursor-pointer"
//             >
//               Login
//             </a>
//             <a
//               href="/signup"
//               className="text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline cursor-pointer"
//             >
//               Sign Up
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";

export default function NotFound() {
  const [countdown, setCountdown] = useState(30);
  const REDIRECT_TO = "/";
  const bgGif = "/bg.gif";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = REDIRECT_TO;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGoHome = () => (window.location.href = REDIRECT_TO);
  const handleGoBack = () => window.history.back();
  const handleRefresh = () => window.location.reload();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
    

      {/* <div className="fixed inset-0 flex justify-center pointer-events-none">
  <img
    src={bgGif}
    alt="Animated 404 background"
    className="h-screen w-[68vw] object-cover translate-y-[8vh] sm:translate-y-[10vh] md:translate-y-[23vh]"
   
    style={{ objectPosition: "center 78%" }}
    loading="eager"
    decoding="async"
    fetchPriority="high"
  />
</div> */}

   {/* Narrower, centered GIF (locked size, responsive-safe) */}
<div className="fixed inset-0 flex justify-center pointer-events-none">
  <img
    src={bgGif}
    alt="Animated 404 background"
    className="
      h-screen
      w-[68vw]              /* ← your final locked width */
      max-w-[1280px]        /* ← prevent over-expanding on ultra-wide */
      min-w-[320px]         /* ← prevent too-narrow on small phones */
      object-cover
      translate-y-[8vh] sm:translate-y-[10vh] md:translate-y-[23vh]
    "
    style={{ objectPosition: "center 78%" }}
    loading="eager"
    decoding="async"
    fetchPriority="high"
  />
</div>

      {/* Overlay content slightly lifted */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-4xl text-center
                     -translate-y-6 sm:-translate-y-10 md:-translate-y-74
                     transform-gpu"
        >
          {/* Headings in blue */}
          <h1
            className="
              text-[56px] sm:text-[80px] md:text-[110px]
              font-bold tracking-tight text-blue-900
              select-none
            "
            style={{ fontFamily: '"Arvo", ui-serif, Georgia, serif' }}
          >
            404
          </h1>

          <h2
            className="mt-2 text-2xl sm:text-3xl font-semibold text-blue-900"
            style={{ fontFamily: '"Arvo", ui-serif, Georgia, serif' }}
          >
            Looks like you’re lost
          </h2>
          <p className="mt-2 text-blue-800">
            The page you are looking for is not available.
          </p>

          <div className="mt-6 space-y-3">
            {/* Primary CTA — blue */}
            <button
              onClick={handleGoHome}
              className="
                w-full sm:w-auto inline-flex items-center justify-center
                rounded-lg px-5 py-3
                text-white bg-blue-600 hover:bg-blue-700
                transition-all duration-200 shadow-md hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700
              "
            >
              <Home className="mr-2 h-5 w-5" />
              Go to Home
            </button>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              {/* Secondary buttons — light blue */}
              <button
                onClick={handleGoBack}
                className="
                  inline-flex items-center justify-center
                  rounded-lg px-4 py-3
                  bg-blue-50 text-blue-900 border border-blue-200
                  hover:bg-blue-100 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300
                "
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </button>

              <button
                onClick={handleRefresh}
                className="
                  inline-flex items-center justify-center
                  rounded-lg px-4 py-3
                  bg-blue-50 text-blue-900 border border-blue-200
                  hover:bg-blue-100 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300
                "
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>

            {/* Links — blue */}
            <div className="mt-3 text-sm text-blue-900">
              <a href="/login" className="underline hover:opacity-80">
                Login
              </a>
              <span className="mx-2">•</span>
              <a href="/signup" className="underline hover:opacity-80">
                Sign Up
              </a>
            </div>
          </div>

          {/* Redirect notice — blue pill */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-50/90 px-4 py-2 text-blue-900 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <p className="text-sm">
              Redirecting to homepage in{" "}
              <span className="font-semibold">{countdown}</span> seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
