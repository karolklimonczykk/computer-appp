"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = { productId: number; src: string; alt?: string };

export default function ImageModalClient({ productId, src, alt }: Props) {
  const router = useRouter();

  // UWAGA: zwykła ścieżka, BEZ "(modal)"!
  const imageHref = `/product-list/${productId}/image/1`;

  function openModal(e: React.MouseEvent) {
    e.preventDefault();
    router.push(imageHref);    // to odpali intercepting route
  }

  return (
    <div>
      <a href={imageHref} onClick={openModal} className="block">
        <img
          src={src}
          alt={alt}
          className="w-[300px] h-[300px] object-contain rounded-lg bg-white cursor-pointer"
        />
      </a>

      <div className="mt-2 text-sm text-gray-600">
        <Link href={imageHref} className="text-sky-600">
          Otwórz na osobnej stronie
        </Link>
      </div>
    </div>
  );
}
