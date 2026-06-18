interface Props {
  data: unknown;
  maxHeight?: string;
}

export default function JsonViewer({ data, maxHeight = '400px' }: Props) {
  return (
    <pre
      className="bg-slate-900 text-emerald-400 text-xs p-4 rounded-lg overflow-auto font-mono leading-relaxed"
      style={{ maxHeight }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
