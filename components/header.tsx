import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <nav className="bg-base-200 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          <Link href="/">Resizely</Link>
        </div>
        <div className="flex space-x-2">
          <Link href="/" className="text-white border-b-2 border-blue-500 px-4 py-2  hover:text-primary">
             Home
          </Link>
          <Link href="/home" className="text-white border-b-2 border-blue-500 px-4 py-2  hover:text-primary">
             Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header
