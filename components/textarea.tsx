interface TextareaProps {
  name?: string;
  label?: string;
  [key: string]: any;
}

export default function Textarea({ name, label, ...rest }: TextareaProps) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <textarea
        rows={4}
        id={name}
        {...rest}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:outline-none  focus:ring-1 focus:ring-orange-500"
      />
    </div>
  );
}
