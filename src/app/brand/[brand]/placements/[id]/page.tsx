"use client";
import { Button } from "@/components/brand/ui/Button";
import { Badge } from "@/components/brand/ui/Badge";
import { FramesStrip } from "@/components/brand/placements/FramesStrip";
import { FileText, Users, Star, Search } from "lucide-react";
import { Input } from "@/components/brand/ui/Input";
import type { Bid } from "@/types/brand/brand";

const BIDS: Bid[] = [
  {
    id: "b1",
    brandName: "Samsung",
    productName: "S21 Ultra",
    category: "Electronics",
    price: 30700,
  },
  {
    id: "b2",
    brandName: "Pringles co.",
    productName: "Pringles",
    category: "Food",
    price: 13700,
  },
  {
    id: "b3",
    brandName: "Mercedes",
    productName: "Mercedes",
    category: "Automobile",
    price: 30700,
  },
];

export default function PlacementDetailPage() {
  const frames = Array(8).fill("/moviePoster.jpg");

  return (
    <div>
      <div className="mb-6 mt-[50px] flex items-start justify-between">
        <div className="flex gap-5">
          <img
            src="/moviePoster.jpg"
            alt=""
            className="h-48 w-48 rounded-xl object-cover"
          />
          <div className="max-w-[560px]">
            <h2 className="text-lg font-semibold">The Matrix remastered</h2>
            <p className="mt-2 text-sm text-zinc-600">
              The iconic sci-fi classic rebuilt with enhanced visuals and sound
              for a new generation of viewers.
            </p>
            <div className="mt-3 flex items-center gap-5 text-sm text-zinc-700">
              <span className="inline-flex items-center gap-1">
                <FileText className="h-4 w-4" />
                224
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                12
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge tone="pink">Action</Badge>
              <Badge tone="purple">Film</Badge>
              <Badge tone="orange">Adults</Badge>
            </div>
          </div>
        </div>

        <Button>Place a bid</Button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-700">
            Scenes: <span className="font-semibold">224</span>
          </div>
          <div className="text-sm text-zinc-700">
            Ideal placement: <span className="font-semibold">34</span>
          </div>
        </div>
        <a href="#" className="text-sm text-indigo-700 underline">
          View potential placements
        </a>
      </div>

      <FramesStrip frames={frames} />

      <div className="mt-8 rounded-xl border border-[#E8E8E8FF] bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-medium">All Bids</div>
          <div className="relative w-72">
            <Input placeholder="Search" />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <div className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1fr] items-center gap-2 border-t px-4 py-2 text-[12px] text-zinc-500">
          <div>Brand</div>
          <div>Product name</div>
          <div>Category</div>
          <div>Price</div>
        </div>

        <ul className="divide-y">
          {BIDS.map((b) => (
            <li
              key={b.id}
              className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1fr] border-[#E8E8E8FF] items-center gap-2 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-zinc-200" />
                <span className="text-sm">{b.brandName}</span>
              </div>
              <a className="text-sm text-indigo-700 hover:underline" href="#">
                {b.productName}
              </a>
              <div className="text-sm">{b.category}</div>
              <div className="text-sm">${b.price.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
