interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageHeader({ title, subtitle, badge }: Props) {
  return (
    <div className="mb-8 pb-6 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {badge && (
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}
