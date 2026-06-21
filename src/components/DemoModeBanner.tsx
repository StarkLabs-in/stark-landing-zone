export default function DemoModeBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-slate-950 text-center text-xs font-semibold py-1.5 px-4">
      Demo mode — Supabase is not configured, so form submissions are only saved to this browser and will not reach Stark Labs.
    </div>
  );
}
