/* eslint-disable jsx-a11y/alt-text */
import { cls } from "@libs/client/utils";
import Image from "next/image";

interface ImageForm {
  src: string;
  size: string;
}

export default function SquareImage({ src, size }: ImageForm) {
  return (
    <>
      {src ? (
        <div className={cls("relative", size)}>
          <Image
            layout="fill"
            src={`https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${src}/avatar`}
            className="rounded-md bg-slate-300 object-cover"
          />
        </div>
      ) : (
        <div className={cls("rounded-full bg-slate-300", size)} />
      )}
    </>
  );
}
