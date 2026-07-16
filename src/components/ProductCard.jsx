import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Button from "./ui/Button";

const placeholderImage =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F1F5F9'/%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const inStock = product.stock > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inStock) return;
    addItem(product, 1);
    showToast(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="aspect-[4/3] bg-surface overflow-hidden relative">
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!inStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Out of Stock
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 text-ink text-[11px] font-medium px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-semibold text-ink text-[15px] leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-ink/50 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-display font-bold text-brand">₹{product.price}</span>
          <Button size="sm" variant={inStock ? "primary" : "ghost"} disabled={!inStock} onClick={handleAdd}>
            {inStock ? "Add to Cart" : "Notify Me"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
