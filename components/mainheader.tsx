import Link from "next/link";
import NavLink from "./navlink";

export default function MainHeader() {
  return (
    <header className="flex justify-between items-center py-3">
      <div>
        <Link href="/" className="inline-block font-bold font-inter text-[#e5e5e1] bg-black/10 p-1.5 rounded-sm" aria-label="Strona główna">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/politechnika-krakowska-logo.svg" alt="Politechnika Krakowska Logo" width={50} height={50} />
        </Link>
      </div>

      <nav aria-label="Główne menu">
        <ul className="flex gap-4 items-center md:flex-row flex-col md:gap-4">
          <li>
            <NavLink href="/product-list">Produkty</NavLink>
          </li>
          <li>
            <NavLink href="/basket">Koszyk</NavLink>
          </li>
          <li>
            <NavLink href="/order-history">Historia</NavLink>
          </li>
          <li>
            <NavLink href="/about">O sklepie</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
