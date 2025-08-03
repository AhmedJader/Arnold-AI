"use client";

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-6 py-16 text-gray-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
            </div>
            <h1 className="text-5xl font-black">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your privacy is our priority. Learn how ARNOLD protects and uses your data.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Introduction</h2>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              Welcome to <span className="text-blue-400 font-semibold">ARNOLD – Your Fitness Companion</span>. This
              privacy policy explains how we collect, use, and protect your data
              when you use our web application. By using ARNOLD, you agree to the
              practices outlined below.
            </p>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-blue-400 font-semibold mb-2">User Input Data</h3>
                  <p className="text-gray-400">Information you provide, such as selected muscle groups, fitness goals, or rehabilitation needs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-purple-400 font-semibold mb-2">Device Information</h3>
                  <p className="text-gray-400">Browser type, operating system, and basic usage stats for improving performance.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Webcam Access (Optional)</h3>
                  <p className="text-gray-400">For feedback on form and posture during exercises, ARNOLD may request access to your webcam. This data is processed locally or temporarily used with Gemini AI and not stored.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Use of Gemini AI</h2>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              ARNOLD integrates with <span className="text-green-400 font-semibold">Google's Gemini AI</span> for natural
              language understanding and exercise plan generation. Here's how it works:
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-400">Input prompts (e.g., "rehab plan for shoulder") are sent to Gemini servers for processing.</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-400">No identifiable user information (name, email, IP) is sent with the prompt.</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-400">Gemini's responses are used to generate exercise suggestions and guidance.</p>
              </div>
            </div>
            <p className="text-gray-500">
              For more details, please refer to{" "}
              <a
                href="https://ai.google.dev/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                Google AI Terms of Service
              </a>.
            </p>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-bold">4</span>
              </div>
              <h2 className="text-3xl font-bold text-white">How We Use Your Data</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-300">To personalize workouts and recommendations.</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-300">To improve our app's performance and user experience.</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-300">To provide real-time feedback using AI tools.</p>
              </div>
            </div>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <span className="text-indigo-400 font-bold">5</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Data Storage and Retention</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              ARNOLD does not permanently store any personal data or webcam footage.
              Any data used for AI interaction is processed temporarily and not saved
              unless explicitly stated.
            </p>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <span className="text-pink-400 font-bold">6</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Third-Party Services</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              ARNOLD may use third-party services like Google Gemini for AI and
              analytics. These providers are governed by their own privacy policies.
            </p>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400 font-bold">7</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Your Rights</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              You may request to delete any session-based data or revoke camera
              access at any time through your browser settings.
            </p>
          </section>

          <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-orange-400 font-bold">8</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Contact</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              If you have any questions or concerns about this policy, please contact
              us at{" "}
              <a 
                href="mailto:support@arnoldapp.dev" 
                className="text-orange-400 hover:text-orange-300 underline transition-colors font-semibold"
              >
                support@arnoldapp.dev
              </a>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-700/50">
          <p className="text-gray-500 text-sm">
            Last updated: August 3, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;