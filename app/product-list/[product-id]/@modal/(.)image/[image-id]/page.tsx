"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ModalImagePage({
  params,
}: {
  params: { "image-id": string };
}) {
  const router = useRouter();

  function closeModal() {
    router.back(); // wraca do /product-list/[product-id]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white rounded shadow-lg max-w-3xl w-full">
        <div className="p-4 text-right">
          <button
            onClick={closeModal}
            className="px-3 py-1 bg-sky-100 rounded hover:bg-sky-200"
          >
            Zamknij
          </button>
        </div>
        <div className="p-4 flex flex-col items-center">
          <img
            src="/politechnika-krakowska-logo.svg"
            className="w-full h-[60vh] object-contain rounded-lg bg-white"
          />
          <div className="mt-2 text-sm text-gray-600">

          </div>
        </div>
      </div>
    </div>
  );
}
