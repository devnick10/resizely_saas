import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-background border-t dark:border-gray-800 py-12 md:py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Resizely
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Transform your media effortlessly with AI-powered tools for compression, background removal, and social
              media optimization.
            </p>
            <div className="flex gap-4">
              {/* Facebook */}
              <Link href="#" className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>

              {/* Twitter */}
              <Link href="#" className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83z" />
                </svg>
              </Link>

              {/* Instagram */}
              <Link href="#" className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Columns */}
          {[
            { title: "Product", items: ["Features", "Pricing", "API", "Integrations"] },
            { title: "Resources", items: ["Blog", "Documentation", "Tutorials", "Support"] },
            { title: "Company", items: ["About", "Careers", "Privacy Policy", "Terms of Service"] },
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Resizely. All rights reserved.</p>
        </div>
      </div>
    </footer>

  )
}
