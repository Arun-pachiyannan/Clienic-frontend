import { Link } from "react-router-dom";
import Button from "./ui/Button";

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-brand-light/60 to-surface">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-accent-dark bg-accent/10 px-3 py-1 rounded-full">
          Healthcare you can trust
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-bold font-display text-ink leading-[1.1]">
          Care that fits <span className="text-brand">your life</span>,
          not the other way around
        </h1>
        <p className="mt-5 text-base sm:text-lg text-ink/60 max-w-md leading-relaxed">
          Order genuine medicines and healthcare essentials, or book a visit with our team —
          all from one place, tracked every step of the way.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
          <Link to="/appointment">
            <Button size="lg" variant="outline">Book Appointment</Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="aspect-square max-w-md mx-auto rounded-[2.5rem] bg-white shadow-xl border border-gray-100 p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="h-11 w-11 rounded-full bg-brand-light flex items-center justify-center text-brand font-display font-bold">
              Rx
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Order #ANAN-48213</p>
              <p className="text-xs text-ink/50">Updated just now</p>
            </div>
          </div>
          {["Processing", "Packed", "Shipped", "Out for Delivery"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${i < 2 ? "bg-accent" : "bg-gray-200"}`}
              />
              <span className={`text-sm ${i < 2 ? "text-ink font-medium" : "text-ink/40"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
