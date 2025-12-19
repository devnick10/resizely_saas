"use client";

import { useEffect, useState } from "react";

export const HeroImage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-100"></div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      {/* Background decorative element */}
      <div className="absolute inset-0 rotate-3 scale-95 transform rounded-lg bg-gradient-to-r from-primary/20 to-primary/10"></div>

      {/* Main container */}
      <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        {/* Window header */}
        <div className="flex h-12 items-center border-b bg-gray-50 px-4 dark:bg-gray-900">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              <div
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744800989/org-video_mcd5ti.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  Original: 24MB
                </div>
              </div>
              <div
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744800989/org-video_mcd5ti.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <div className="absolute bottom-2 left-2 rounded bg-primary/70 px-2 py-1 text-xs text-white">
                  Compressed: 4MB
                </div>
              </div>
              <div className="relative h-20 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-bold dark:text-white">1 Credit</div>
                    <div className="text-xs text-neutral-800 dark:text-neutral-200">
                      Per Compression
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              <div
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744800993/image-with-bg_dbr705.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
                className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600"></div>
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  With Background
                </div>
              </div>
              <div
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744800988/image-without-bg_hpu6k1.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
                className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600"></div>
                <div className="absolute bottom-2 left-2 rounded bg-primary/70 px-2 py-1 text-xs text-white">
                  Background Removed
                </div>
              </div>

              <div className="grid h-20 w-full grid-cols-3 gap-2 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="flex flex-col items-center justify-center rounded bg-white shadow-sm dark:bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="50"
                    height="50"
                    viewBox="0 0 48 48"
                  >
                    <radialGradient
                      id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                      cx="19.38"
                      cy="42.035"
                      r="44.899"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#fd5"></stop>
                      <stop offset=".328" stopColor="#ff543f"></stop>
                      <stop offset=".348" stopColor="#fc5245"></stop>
                      <stop offset=".504" stopColor="#e64771"></stop>
                      <stop offset=".643" stopColor="#d53e91"></stop>
                      <stop offset=".761" stopColor="#cc39a4"></stop>
                      <stop offset=".841" stopColor="#c837ab"></stop>
                    </radialGradient>
                    <path
                      fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                      d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                    ></path>
                    <radialGradient
                      id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                      cx="11.786"
                      cy="5.54"
                      r="29.813"
                      gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#4168c9"></stop>
                      <stop
                        offset=".999"
                        stopColor="#4168c9"
                        stopOpacity="0"
                      ></stop>
                    </radialGradient>
                    <path
                      fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                      d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                    ></path>
                    <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                    <path
                      fill="#fff"
                      d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                    ></path>
                  </svg>
                  <div className="text-center text-xs">Instagram</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded bg-white shadow-sm dark:bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                  </svg>
                  <div className="text-center text-xs">Twitter</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded bg-white shadow-sm dark:bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="50"
                    height="50"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#0288D1"
                      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                    ></path>
                    <path
                      fill="#FFF"
                      d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                    ></path>
                  </svg>
                  <div className="text-center text-xs">LinkedIn</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
