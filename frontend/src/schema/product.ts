import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  sku: z.string().trim().min(2, "SKU is required"),

  quantity: z
    .number({
      error: "Quantity is required",
    })
    .int()
    .min(0, "Quantity cannot be negative"),

  price: z
    .number({
      error: "Price is required",
    })
    .positive("Price must be greater than zero"),
});

export type ProductFormData = z.infer<typeof productSchema>;
