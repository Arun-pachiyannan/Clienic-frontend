import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/ui/Spinner";
import api from "../services/api";

const features = [
  {
    title: "Certified Medicines",
    desc: "Every product is sourced from licensed suppliers and stored to pharmacy standards.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Fast, Tracked Delivery",
    desc: "Watch your order move from Processing to Delivered in real time, no guessing.",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 005.6 19H17",
  },
  {
    title: "Real Appointments",
    desc: "Book a slot with our clinic in under a minute, and get a clear approval status.",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

const testimonials = [
  {
    name: "Priya R.",
    role: "Verified Patient",
    quote:
      "Booking my appointment took less time than making tea. The reminder and status updates meant I never had to call the front desk once.",
  },
  {
    name: "Karthik M.",
    role: "Repeat Customer",
    quote:
      "I track every order from Processing to Delivered right on the site. Refreshingly clear compared to other pharmacy apps I've used.",
  },
  {
    name: "Fathima S.",
    role: "Verified Patient",
    quote:
      "The product pages tell you usage instructions clearly, which I really appreciated when ordering for my parents.",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?limit=4&sort=popularity")
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">Featured Products</h2>
            <p className="text-ink/50 mt-1">Tablets, medicines & healthcare essentials</p>
          </div>
          <Link to="/products" className="text-brand text-sm font-medium hover:text-brand-dark hidden sm:block">
            View all →
          </Link>
        </div>

        {loading ? (
          <Spinner label="Loading products" />
        ) : products.length === 0 ? (
          <p className="text-ink/50 text-sm">
            No products yet — check back soon, or visit the admin dashboard to add some.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink text-center">Why Choose ANAN Clinic?</h2>
          <div className="grid sm:grid-cols-3 gap-6 mt-10">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100">
                <div className="h-11 w-11 rounded-xl bg-brand-light flex items-center justify-center mb-4">
                  <svg className="h-5 w-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={f.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-ink mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink text-center mb-10">What Our Patients Say</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="p-6 rounded-2xl bg-surface border border-gray-100">
              <blockquote className="text-sm text-ink/70 leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink">
                {t.name} <span className="text-ink/40 font-normal">— {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
