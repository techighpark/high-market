import type { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps {
  name?: string;
  label?: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function Textarea({
  name,
  label,
  register,
  ...rest
}: TextareaProps) {
  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <textarea
        {...register}
        rows={4}
        id={name}
        {...rest}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:outline-none  focus:ring-1 focus:ring-orange-500"
      />
    </div>
  );
}
