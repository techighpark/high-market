/* eslint-disable jsx-a11y/alt-text */
import { cls, currentProgress } from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";
import { title } from "process";

interface ItemProps {
  id: number;
  title: string;
  price: number;
  img: string;
  isLiked: boolean;
  comments: number;
  hearts: number;
  state?: string;
}

export default function Item({
  id,
  title,
  price,
  comments,
  isLiked,
  img,
  state,
  hearts,
}: ItemProps) {
  return (
    <Link href={`/products/${id}`}>
      <a className="flex cursor-pointer justify-between border-b px-4 py-2">
        <div className="flex space-x-4">
          <div className="relative h-20 w-20">
            <Image
              className="rounded-md bg-gray-400 object-cover"
              layout="fill"
              src={`https://imagedelivery.net/y59bDhDAuiAOBKkFYsga6Q/${img}/avatar`}
            />
          </div>
          <div className="flex flex-col pt-2 ">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className="mt-1 font-medium text-gray-900">
              <span className="text-sm font-normal text-gray-600">$ </span>
              {price}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between space-x-2 ">
          <div
            className={cls(
              "flex items-center justify-center rounded-full px-2 py-[2px] shadow-sm ",
              currentProgress(
                state,
                "bg-white-500 border border-orange-500",
                "bg-orange-500",
                "bg-gray-500",
                ""
              )
            )}
          >
            <span
              className={cls(
                "text-[10px] font-bold",
                state === undefined ? "text-orange-500" : "text-white"
              )}
            >
              {currentProgress(state, "Sale", "Reserved", "Sold", "")}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-0.5 text-sm text-gray-600">
              <div
                className={cls(
                  "rounded-md ",
                  isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </div>
              <span>{hearts}</span>
            </div>
            <div className="flex items-center space-x-0.5  text-sm text-gray-600">
              <div className="rounded-md  text-gray-400  hover:text-gray-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
              </div>
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
