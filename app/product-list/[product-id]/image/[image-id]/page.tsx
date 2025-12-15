import React from "react";

export default function ImagePage({
  params,
}: {
  params: { "image-id": string };
}) {
  return (
    <div className="p-6 flex flex-col items-center">
      <img
        src="/politechnika-krakowska-logo.svg"
       
        className="w-full max-w-3xl h-[80vh] object-contain rounded-lg bg-white"
      />
    </div>
  );
}
