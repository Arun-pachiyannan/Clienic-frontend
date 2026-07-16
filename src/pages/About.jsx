const About = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="text-center mb-14">
      <h1 className="text-4xl font-bold text-ink">About ANAN Clinic</h1>
      <p className="text-ink/50 mt-3 max-w-xl mx-auto">
        We started ANAN Clinic to make trustworthy healthcare simpler to reach —
        whether that means a medicine at your door or a doctor's slot on your terms.
      </p>
    </div>

    <div className="grid sm:grid-cols-3 gap-6 mb-16">
      <div className="p-6 rounded-2xl border border-gray-100">
        <h2 className="font-display font-semibold text-brand mb-2">Our Mission</h2>
        <p className="text-sm text-ink/60 leading-relaxed">
          Make essential healthcare products and appointments accessible to every
          household, with clear pricing and honest stock information.
        </p>
      </div>
      <div className="p-6 rounded-2xl border border-gray-100">
        <h2 className="font-display font-semibold text-brand mb-2">Our Vision</h2>
        <p className="text-sm text-ink/60 leading-relaxed">
          A future where checking on your order or your appointment is as easy as
          checking the weather — transparent, fast, and stress-free.
        </p>
      </div>
      <div className="p-6 rounded-2xl border border-gray-100">
        <h2 className="font-display font-semibold text-brand mb-2">Our Commitment</h2>
        <p className="text-sm text-ink/60 leading-relaxed">
          Every product we list is sourced from licensed suppliers, and every
          appointment request is reviewed by our team before confirmation.
        </p>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 text-center">
      <h2 className="text-2xl font-bold text-ink mb-3">Have a question for us?</h2>
      <p className="text-ink/60 mb-6">Reach out and our team will get back to you within a day.</p>
      <a
        href="mailto:anan@gmail.com"
        className="inline-block bg-brand text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-dark transition-colors"
      >
        Email anan@gmail.com
      </a>
    </div>
  </div>
);

export default About;
