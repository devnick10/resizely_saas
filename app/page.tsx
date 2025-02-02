"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";

function Home() {

  return (
    <div className="min-h-screen  bg-base-100">
      <Header/>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Unleash the Power of AI for Your Media
        </h1>
        <p className="text-xl text-white mb-8">
          Remove backgrounds, resize images, compress videos, and more with AI-powered precision.
        </p>
        <div className="space-x-4">
          <Link
            href="/home"
            className="btn btn-primary px-8 py-3 font-semibold"
          >
            Get Started
          </Link>
          <Link
            href="#pricing"
            className="btn text-white btn-outline px-8 py-3 font-semibold"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-10 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Our AI-Powered Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Background Removal */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center">
              <div className="mb-4">
                <Image
                  src="/bg-remove.png"
                  width={1000}
                  height={1000}
                  sizes="fill"
                  alt="Background Removal"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Background Removal</h3>
              <p className="text-white">
                Effortlessly remove backgrounds from images with AI precision.
              </p>
            </div>
          </div>

          {/* Feature 2: Image Resizing */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center">
              <div className="mb-4">
                <Image
                  src="/resize.png"
                  width={1000}
                  height={1000}
                  alt="Image Resizing"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Image Resizing</h3>
              <p className="text-white">
                Resize images for any social media platform with AI content awareness.
              </p>
            </div>
          </div>

          {/* Feature 3: Video Compression */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center">
              <div className="mb-4">
                <Image
                  src="/videocomp.png"
                  width={1000}
                  height={1000}
                  alt="Video Compression"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Video Compression</h3>
              <p className="text-white">
                Compress videos without losing quality using AI-powered algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-base-200 p-10 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Free Plan</h3>
                <p className="text-warning text-md mb-6">Get started with 5 free credits.</p>
                <div className="text-4xl font-bold text-primary mb-6">₹0</div>
                <Link
                  href="/signup"
                  className="btn btn-primary px-8 py-3 font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <h3 className="text-2xl font-bold  text-white mb-4">Pro Plan</h3>
                <p className="text-warning text-md mb-6">10 credits for just ₹500.</p>
                <div className="text-4xl font-bold text-primary mb-6">₹500</div>
                <Link
                  href="/signup"
                  className="btn btn-primary px-8 py-3 font-semibold"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-200 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-base-content">
            &copy; {new Date().getFullYear()} AI Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;