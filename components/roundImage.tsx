/* eslint-disable jsx-a11y/alt-text */
import { cls } from "@libs/client/utils";
import Image from "next/image";

interface ImageForm {
  src: string;
  lg: boolean;
  sm?: boolean;
}

export default function RoundImage({ src, lg = false, sm = false }: ImageForm) {
  return (
    <>
      {src ? (
        <div
          className={cls(
            "relative",
            lg ? "h-16 w-16" : sm ? "h-8 w-8" : "h-10 w-10"
          )}
        >
          <Image
            layout="fill"
            src={`https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${src}/avatar`}
            className="rounded-full bg-slate-300 object-cover"
          />
        </div>
      ) : (
        <div
          className={cls(
            "rounded-full bg-slate-300",
            lg ? "h-16 w-16" : sm ? "h-8 w-8" : "h-10 w-10"
          )}
        />
      )}
    </>
  );
}
