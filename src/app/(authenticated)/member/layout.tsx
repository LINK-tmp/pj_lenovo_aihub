export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">{children}</div>
  );
}
