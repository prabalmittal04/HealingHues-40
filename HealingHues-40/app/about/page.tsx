// app/about/page.tsx

import React from "react"

export default function AboutPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900 text-gray-900 px-6 py-12 font-sans">
        <div className="max-w-6xl mx-auto">
  
          {/* Content Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 space-y-10">
  
          {/* Intro */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
              HealingHues
            <br />
            </h1>
            <p className="text-lg text-gray-700 mt-4">
              HealingHues is a scientifically crafted emotional wellness ecosystem that blends empathetic AI with real-time behavioral analytics and medical assistance. The platform is designed to help individuals track their moods, receive emotionally intelligent responses through HueBot, access guided symptom support, and order medicines seamlessly — all within a secure and intuitive interface.
            </p>
            <p className="text-lg text-gray-700 mt-3">
              Whether you're seeking balance, comfort, or clarity, HealingHues adapts to your emotional needs, offering precision-guided insight and gentle companionship through intelligent design.
            </p>
            <p className="text-sm text-gray-500 mt-2 italic">
              An emotionally intelligent AI wellness system, built with love and care by Prabal Mittal.
            </p>
          </div>
  
            
            {/* Section 5: Timeline of Evolution */}
            <section>
              <h2 className="text-2xl font-bold text-green-700 mb-6">📅 Platform Evolution Timeline</h2>
              <ol className="relative border-l-4 border-green-300 pl-6 space-y-10">
                
                <li>
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2.5 top-1"></div>
                  <h3 className="text-xl font-semibold text-green-800">🟢 Initial Vision</h3>
                  <p className="text-gray-700 mt-1">
                    HealingHues began as a mission-driven idea to combine empathy, AI, and emotional intelligence into one unified wellness platform.
                  </p>
                </li>
  
                <li>
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2.5 top-1"></div>
                  <h3 className="text-xl font-semibold text-green-800">📥 Firestore-Based Mood Tracker</h3>
                  <p className="text-gray-700 mt-1">
                    A secure Firestore integration was built to capture, store, and visualize user mood entries — laying the foundation for longitudinal emotional analysis.
                  </p>
                </li>
  
                <li>
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2.5 top-1"></div>
                  <h3 className="text-xl font-semibold text-green-800">🤖 HueBot - The Emotion-Aware AI</h3>
                  <p className="text-gray-700 mt-1">
                    HueBot, a real-time conversational agent, was developed using local NLP and OpenRouter AI APIs. It analyzes mood context and responds with comforting, emotionally intelligent dialogue.
                  </p>
                </li>
  
                <li>
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2.5 top-1"></div>
                  <h3 className="text-xl font-semibold text-green-800">🩺 Medical Intelligence Engine</h3>
                  <p className="text-gray-700 mt-1">
                    A smart Q&A system was integrated to deliver symptom-based health insights, including estimated recovery timelines, remedies, and professional guidance suggestions.
                  </p>
                </li>
  
                <li>
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2.5 top-1"></div>
                  <h3 className="text-xl font-semibold text-green-800">📦 Medicine Ordering System</h3>
                  <p className="text-gray-700 mt-1">
                    Users can now order medicines through a fully connected module, with Firestore storing medicine data, order history, and delivery tracking securely.
                  </p>
                </li>
  
                <li>
                  <div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2.5 top-1"></div>
                  <h3 className="text-xl font-semibold text-green-800">📈 Dynamic Dashboards</h3>
                  <p className="text-gray-700 mt-1">
                    Real-time dashboards now display user emotional trends, AI-based recommendations, and historical insights to support self-awareness and emotional regulation.
                  </p>
                </li>
  
              </ol>
            </section>
          </div>
  
          {/* Footer */}
          <footer className="text-center mt-12 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HealingHues. Made with 💚 for mental wellness.
          </footer>
        </div>
      </div>
    );
  }
