import DiscountsDefault from "./@discounts/default";

export default function ProductListLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {/* Promotions slot: always visible for /product-list */}
      <div className="mb-6">
        <DiscountsDefault />
      </div>

      {/* layout for /product-list and its children */}
      {children}
    </div>
  );
}
