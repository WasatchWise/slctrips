export function Footer() {
  return (
    <footer className="bg-[#0b3b57] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-sm text-white/80">
          As an affiliate, we may earn from qualifying purchases.
        </p>
        <p className="text-xs text-white/60 mt-2">
          © {new Date().getFullYear()} SLC Trips
        </p>
      </div>
    </footer>
  );
}
