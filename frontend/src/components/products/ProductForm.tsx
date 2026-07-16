import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../common/Input";
import Button from "../common/Button";
import { productSchema, type ProductFormData } from "../../schema/product";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  loading?: boolean;
}

export default function ProductForm({
  defaultValues,
  onSubmit,
  loading,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Product Name"
        {...register("name")}
        error={errors.name?.message}
      />

      <Input label="SKU" {...register("sku")} error={errors.sku?.message} />

      <Input
        label="Quantity"
        type="number"
        {...register("quantity", {
          valueAsNumber: true,
        })}
        error={errors.quantity?.message}
      />

      <Input
        label="Price"
        type="number"
        step="0.01"
        {...register("price", {
          valueAsNumber: true,
        })}
        error={errors.price?.message}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
