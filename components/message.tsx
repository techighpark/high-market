/* eslint-disable jsx-a11y/alt-text */
import { cls } from "@libs/client/utils";
import Image from "next/image";

interface MessageProps {
  reversed?: boolean;
  message: string;
  avatarUrl?: string;
}

export default function Msg({ reversed, message, avatarUrl }: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start",
        reversed ? "flex-row-reverse space-x-2 space-x-reverse" : "space-x-2"
      )}
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-300">
        <Image
          src={`https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${avatarUrl}/public`}
          layout="fill"
          className="object-cover"
        />
      </div>
      <div
        className={cls(
          "w-1/2 rounded-md p-2 text-sm text-gray-700",
          reversed ? "bg-orange-100" : " bg-gray-100"
        )}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
