import { cls } from "@libs/client/utils";

interface ButtonProps {
  text: string;
  lg?: boolean;
  [key: string]: any;
}

export default function Button({ text, lg = false, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        lg ? "py-3 text-base" : "py-2 text-sm",
        "w-full rounded-md border border-transparent bg-orange-500 px-4 font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      )}
    >
      {text}
    </button>
  );
}
