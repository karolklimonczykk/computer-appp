export default function OrderHistoryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {/* layout for /order-history and its children */}
      {children}
    </div>
  );
}
