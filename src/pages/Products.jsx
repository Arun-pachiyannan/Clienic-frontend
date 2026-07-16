import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/ui/Spinner";
import { Input, Select } from "../components/ui/Field";
import api from "../services/api";

const categories = ["All", "Tablets", "Medicines", "Healthcare Products"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ products: [], page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    params.set("page", page);
    params.set("limit", "12");

    api
      .get(`/products?${params.toString()}`)
      .then((res) => setData(res.data))
      .catch(() => setData({ products: [], page: 1, totalPages: 1 }))
      .finally(() => setLoading(false));
  }, [category, sort, page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All") next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">Shop Products</h1>
        <p className="text-ink/50 mt-1">Tablets, medicines, and healthcare essentials</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark"
          >
            Search
          </button>
        </form>

        <Select value={category} onChange={(e) => updateParam("category", e.target.value)} className="sm:w-52">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="sm:w-52">
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popularity">Most Popular</option>
        </Select>
      </div>

      {loading ? (
        <Spinner label="Loading products" />
      ) : data.products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/50">No products match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    p === data.page ? "bg-brand text-white" : "text-ink/60 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
