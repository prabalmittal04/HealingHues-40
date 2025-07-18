// app/contact/page.tsx

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900 text-gray-900 px-6 py-16 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Contact Us
          </h1>
          <p className="text-md text-gray-500 mt-2 italic">
            An emotionally intelligent AI wellness system, built with love and care by Prabal Mittal.
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">📧 General Inquiries</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              Have questions about HealingHues, your data, or our features? Email us anytime at{" "}
              <a href="mailto:support@healinghues.ai" className="text-green-700 underline">support@healinghues.ai</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">🛠️ Technical Support</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              Experiencing issues or bugs? Reach out to our engineering team so we can assist you promptly at{" "}
              <a href="mailto:tech@healinghues.ai" className="text-green-700 underline">tech@healinghues.ai</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">💬 Feedback & Collaboration</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              We love hearing from our users and partners. Share your thoughts or explore opportunities to work with us by emailing{" "}
              <a href="mailto:prabal@healinghues.ai" className="text-green-700 underline">prabal@healinghues.ai</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">🏢 Our Office</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              HealingHues HQ<br />
              Sector 21, Gurugram, Haryana, India
            </p>
          </section>

        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} HealingHues. We're here to help you heal.
        </footer>
      </div>
    </div>
  );
}
