export default function BasketLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {/* layout for /basket and its children */}
      {children}
    </div>
  );
}
