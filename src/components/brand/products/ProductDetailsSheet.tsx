"use client";
import { Sheet } from "@/components/brand/ui/Sheet";
import type { Product } from "@/types/brand/brand";

export function ProductDetailsSheet({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}) {
  if (!product) return null;
  return (
    <Sheet open={open} onClose={onClose} title="Product details" width={480}>
      <div className="space-y-5">
        <div className="text-right text-xs text-indigo-700">
          Brand: {product.brandName}
        </div>
        <div className="flex items-start gap-4">
          <img
            src={product.image ?? "/placeholder.svg"}
            alt=""
            className="h-40 w-40 rounded-xl object-cover ring-1 ring-zinc-200"
          />
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <dt className="text-xs text-zinc-500">Product name</dt>
            <dd className="text-sm">{product.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Category</dt>
            <dd className="text-sm">{product.category}</dd>
          </div>

          <div>
            <dt className="text-xs text-zinc-500">Price</dt>
            <dd className="text-sm">
              $
              {product.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-zinc-500">Product description</dt>
            <dd className="mt-1 text-sm text-zinc-700">
              {product.description ??
                "The iPhone 16 delivers Apple’s most advanced performance yet, with a sleek design, intelligent AI features, and powerful tools that make everyday life faster, smarter, and more connected."}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-zinc-500">Projects</dt>
            <dd className="text-sm">{product.projectsCount} projects</dd>
          </div>
        </dl>
      </div>
    </Sheet>
  );
}
