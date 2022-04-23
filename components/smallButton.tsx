import { cls } from "@libs/client/utils";

interface ButtonProps {
  text: string;
  clicked?: boolean;
  disable: boolean;
  sold?: boolean;
  [key: string]: any;
}

export default function SmallButton({
  children,
  clicked,
  text,
  sold,
  disable = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        "border-box flex h-6 w-24 items-center justify-center space-x-1 rounded-md border py-1 font-medium shadow-sm hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:bg-white disabled:text-gray-400 ",
        clicked ? "border-none bg-orange-500 text-white" : "text-gray-800"
      )}
      disabled={!disable || sold}
    >
      {children}
      <span className="text-xs font-semibold">{text}</span>
    </button>
  );
}
