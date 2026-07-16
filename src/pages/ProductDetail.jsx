import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import api from "../services/api";

const placeholderImage =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F1F5F9'/%3E%3C/svg%3E";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Loading product" />;

  if (notFound || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-ink/60 mb-4">We couldn't find that product.</p>
        <Link to="/products" className="text-brand font-medium hover:text-brand-dark">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  const handleAdd = () => {
    addItem(product, quantity);
    showToast(`${quantity} × ${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/products" className="text-sm text-ink/50 hover:text-brand">← Back to Products</Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="aspect-square rounded-2xl overflow-hidden bg-surface border border-gray-100">
          <img src={product.image || placeholderImage} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="text-xs font-medium text-brand bg-brand-light px-2.5 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-ink mt-4">{product.name}</h1>
          <p className="text-2xl font-display font-bold text-brand mt-3">₹{product.price}</p>

          <p
            className={`mt-3 text-sm font-medium inline-flex items-center gap-1.5 ${
              inStock ? "text-accent-dark" : "text-red-500"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${inStock ? "bg-accent" : "bg-red-500"}`} />
            {inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          <p className="mt-5 text-ink/70 leading-relaxed">{product.description}</p>

          {product.benefits && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-ink mb-1.5">Benefits</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{product.benefits}</p>
            </div>
          )}

          {product.usageInstructions && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-ink mb-1.5">Usage Instructions</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{product.usageInstructions}</p>
            </div>
          )}

          {inStock ? (
            <div className="mt-7 flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-ink/60 hover:text-ink"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 text-sm font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-ink/60 hover:text-ink"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <Button onClick={handleAdd} size="lg">Add to Cart</Button>
            </div>
          ) : (
            <div className="mt-7">
              <Button size="lg" disabled>
                Out of Stock
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
