// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D8F3DC] via-[#E9F5DB] to-[#F0F8E8] dark:from-slate-900 dark:via-green-900/10 dark:to-slate-900 text-gray-900 px-6 py-16 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Privacy Policy
          </h1>
          <p className="text-md text-gray-500 mt-2 italic">
            An emotionally intelligent AI wellness system, built with love and care by Prabal Mittal.
          </p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">🔒 Commitment to Privacy</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              HealingHues is designed with your privacy at its core. We collect only the information necessary to provide you with personalized emotional wellness insights, and we never sell or share your data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">🗂️ Data Collection & Use</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              We store user mood entries, medical queries, and medicine orders securely in Firestore. This data helps generate insights, track emotional trends, and fulfill orders — always encrypted and access-controlled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">🛡️ Data Security</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              HealingHues implements industry-standard security practices, including encrypted data storage, secure authentication, and strict access controls to protect your personal information at all times.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">🔗 Third-Party Services</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              HealingHues may integrate third-party APIs, like AI services or payment gateways, only to improve your experience. All integrations adhere to strict confidentiality standards, ensuring your data remains protected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">👥 Your Rights</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              You have the right to request access to, correction of, or deletion of your personal data. Contact us at any time to exercise these rights and we will respond promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-3">📅 Updates to This Policy</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              We may update this Privacy Policy as HealingHues evolves. Significant changes will be communicated through our platform so you always stay informed about how your data is handled.
            </p>
          </section>

        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} HealingHues. Your wellness, our commitment.
        </footer>
      </div>
    </div>
  );
}
