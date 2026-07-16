import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/common/Button";
import StatusFilter from "../components/products/StatusFilter";
import SearchInput from "../components/common/SearchInput";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/common/Pagination";
import type { Product } from "../api/products";
import { useCreateProduct } from "../hooks/useCreateProduct";
import Modal from "../components/common/Modal";
import ProductForm from "./ProductForm";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import DeleteProductDialog from "../components/products/DeleteProductDialog";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import TableSkeleton from "../components/common/TableSkeleton";

export default function Products() {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useProducts({
    page,
    limit: 10,
    search: debouncedSearch,
    status: status || undefined,
  });

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="h-10 w-72 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-44 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-10 w-36 animate-pulse rounded bg-slate-200" />
        </div>

        <TableSkeleton />

        <div className="flex justify-center">
          <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <StatusFilter
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
        </div>
        <Button onClick={() => setOpen(true)}>+ Add Product</Button>{" "}
      </div>
      <div className="rounded-xl bg-white shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data.length ? (
              data?.data.map((product: Product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4">₦{product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditOpen(true);
                        }}
                        className="rounded p-2 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setDeleteOpen(true);
                        }}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
      <Modal open={open} onOpenChange={setOpen} title="Add Product">
        <ProductForm
          loading={createMutation.isPending}
          onSubmit={(values) => {
            createMutation.mutate(values, {
              onSuccess: () => {
                toast.success("Product created successfully");
                setOpen(false);
              },
            });
          }}
        />
      </Modal>
      <Modal open={editOpen} onOpenChange={setEditOpen} title="Edit Product">
        {selectedProduct && (
          <ProductForm
            defaultValues={{
              name: selectedProduct.name,
              sku: selectedProduct.sku,
              quantity: selectedProduct.quantity,
              price: selectedProduct.price,
            }}
            loading={updateMutation.isPending}
            onSubmit={(values) => {
              updateMutation.mutate(
                {
                  id: selectedProduct.id,
                  data: values,
                },
                {
                  onSuccess: () => {
                    toast.success("Product updated successfully");
                    setEditOpen(false);
                  },
                },
              );
            }}
          />
        )}
      </Modal>
      <DeleteProductDialog
        open={deleteOpen}
        loading={deleteMutation.isPending}
        productName={productToDelete?.name ?? ""}
        onClose={() => {
          setDeleteOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => {
          if (!productToDelete) return;

          deleteMutation.mutate(productToDelete.id, {
            onSuccess: () => {
              toast.success("Product deleted successfully");

              setDeleteOpen(false);
              setProductToDelete(null);
            },
          });
        }}
      />
    </div>
  );
}
