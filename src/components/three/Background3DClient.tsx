"use client";

import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("./Background3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 grid-bg opacity-30 pointer-events-none"
    />
  ),
});

export default Background3D;
