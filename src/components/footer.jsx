import React from "react";

export default function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-7xl px-4 pb-10 md:px-8">
      <div className="flex items-center justify-between gap-4 border-t border-white/12 pt-4 text-slate-400">
        <p className="m-0 text-[1.05rem] text-slate-100">TrackGen</p>
        <span className="text-[0.86rem]">(c) {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
}
