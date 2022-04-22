import { cls } from "@libs/client/utils";
import Link from "next/link";

interface LinkProps {
  href: string;
  text: string;
  pathname: string;
  children: React.ReactNode;
}

export default function IconLink({
  href,
  text,
  pathname,
  children,
}: LinkProps) {
  return (
    <Link href={href}>
      <a
        className={cls(
          "flex w-20 flex-col items-center space-y-2",
          pathname === href
            ? "text-orange-500"
            : "transition-colors hover:text-gray-500"
        )}
      >
        <span>{text}</span>
        {children}
      </a>
    </Link>
  );
}
