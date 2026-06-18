export default function Spinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }} className="border-2 border-[#e8e8e8] border-t-[#c9a84c] rounded-full animate-spin" />
    </div>
  );
}
