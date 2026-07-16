import { useEffect, useState } from "react";
import { Field, Input, Select, Textarea } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";

const emptyForm = {
  name: "",
  description: "",
  benefits: "",
  usageInstructions: "",
  price: "",
  stock: "",
  category: "Tablets",
};

const placeholderImage =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23F1F5F9'/%3E%3C/svg%3E";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/products?limit=50")
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      benefits: product.benefits || "",
      usageInstructions: product.usageInstructions || "",
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await api.put(`/products/${editing._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Product updated");
      } else {
        await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Product created");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not save product", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      showToast("Product deleted");
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not delete product", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Products</h1>
        <Button onClick={openCreate}>+ Add Product</Button>
      </div>

      {loading ? (
        <Spinner label="Loading products" />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-gray-100">
                <th className="py-3 px-4 font-medium">Product</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Price</th>
                <th className="py-3 px-4 font-medium">Stock</th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.image || placeholderImage} alt="" className="h-10 w-10 rounded-lg object-cover bg-surface" />
                    <span className="font-medium text-ink line-clamp-1">{p.name}</span>
                  </td>
                  <td className="py-3 px-4 text-ink/60">{p.category}</td>
                  <td className="py-3 px-4 text-ink/60">₹{p.price}</td>
                  <td className="py-3 px-4">
                    <span className={p.stock > 0 ? "text-accent-dark" : "text-red-500"}>{p.stock}</span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="text-brand hover:text-brand-dark text-sm font-medium mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-ink/40 py-10 text-sm">No products yet. Click "Add Product" to create one.</p>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-display font-semibold text-ink mb-5">
              {editing ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Name" required>
                <Input value={form.name} onChange={handleChange("name")} required />
              </Field>
              <Field label="Description" required>
                <Textarea rows={2} value={form.description} onChange={handleChange("description")} required />
              </Field>
              <Field label="Benefits">
                <Textarea rows={2} value={form.benefits} onChange={handleChange("benefits")} />
              </Field>
              <Field label="Usage Instructions">
                <Textarea rows={2} value={form.usageInstructions} onChange={handleChange("usageInstructions")} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₹)" required>
                  <Input type="number" min="0" step="0.01" value={form.price} onChange={handleChange("price")} required />
                </Field>
                <Field label="Stock" required>
                  <Input type="number" min="0" value={form.stock} onChange={handleChange("stock")} required />
                </Field>
              </div>
              <Field label="Category" required>
                <Select value={form.category} onChange={handleChange("category")}>
                  <option value="Tablets">Tablets</option>
                  <option value="Medicines">Medicines</option>
                  <option value="Healthcare Products">Healthcare Products</option>
                </Select>
              </Field>
              <Field label="Image" hint={editing ? "Leave blank to keep the current image" : ""}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-sm"
                />
              </Field>

              <div className="flex gap-3 mt-2">
                <Button type="submit" loading={saving} fullWidth>
                  {editing ? "Save Changes" : "Create Product"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
