import React from "react";

export const HowItsWorkSection: React.FC = () => {
  return (
    <section id="learnmore" className="bg-gray-50 py-20 dark:bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mx-auto max-w-[800px] text-gray-600 dark:text-gray-400 md:text-lg">
            Resizely makes media processing simple with just three easy steps.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[1, 2, 3].map((step, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-muted"
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">{step}</span>
              </div>
              <h3 className="mb-3 text-xl font-bold">
                {step === 1
                  ? "Upload Your Media"
                  : step === 2
                    ? "Choose Your Options"
                    : "Download & Share"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step === 1
                  ? "Drag and drop your videos or images onto our platform."
                  : step === 2
                    ? "Select compression level, background removal, or social media platform."
                    : "Get your optimized media instantly and share it anywhere."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
