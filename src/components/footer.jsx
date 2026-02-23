import React from "react";

export default function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-7xl px-4 pb-10 md:px-8">
      <div className="footer-wrap">
        <p>CryptGen</p>
        <span>(c) {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
}
