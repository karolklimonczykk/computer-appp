export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {/* layout for /about and its children */}
      {children}
    </div>
  );
}
