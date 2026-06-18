import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface BaseProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

interface InputProps<T extends FieldValues> extends BaseProps<T> {
  type?: 'text' | 'number' | 'email' | 'password' | 'date';
  options?: never;
}

interface SelectProps<T extends FieldValues> extends BaseProps<T> {
  type: 'select';
  options: { value: string; label: string }[];
}

type Props<T extends FieldValues> = InputProps<T> | SelectProps<T>;

export default function FormField<T extends FieldValues>({
  label, name, register, required, placeholder, type = 'text', className = '',
  ...rest
}: Props<T>) {
  return (
    <div className={className}>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {'options' in rest && rest.options ? (
        <select {...register(name)} className="input">
          <option value="">— Seleccionar —</option>
          {rest.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          {...register(name, { valueAsNumber: type === 'number' ? true : undefined })}
          type={type}
          placeholder={placeholder}
          className="input"
        />
      )}
    </div>
  );
}
