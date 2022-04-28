import { useRouter } from "next/router";
import React from "react";
import { cls } from "@libs/client/utils";
import Head from "next/head";
import IconLink from "./iconLink";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  children,
  seoTitle,
}: LayoutProps) {
  const router = useRouter();

  const onClickGoBack = () => {
    router.back();
  };
  return (
    <div>
      <Head>
        <title>{seoTitle} | High-Market</title>
      </Head>
      <div className="fixed top-0 z-10 flex h-12 w-full min-w-[350px] max-w-xl items-center justify-center border-b  bg-white px-10 text-lg font-medium text-gray-800">
        {canGoBack ? (
          <button onClick={onClickGoBack} className="absolute left-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        ) : null}
        {title ? (
          <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
        ) : null}
      </div>
      <div className={cls("pt-12", hasTabBar ? "pb-16" : "")}>{children}</div>
      {hasTabBar ? (
        <nav className="fixed bottom-0 flex w-full min-w-[350px] max-w-xl justify-between border-t bg-white px-6 pb-5 pt-3 text-xs text-gray-700">
          <IconLink href={"/"} text="Home" pathname={router.pathname}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </IconLink>
          <IconLink
            href={"/community"}
            text="Community"
            pathname={router.pathname}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </IconLink>

          <IconLink href={"/chats"} text="Chat" pathname={router.pathname}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </IconLink>
          {/* <IconLink href={"/streams"} text="Stream" pathname={router.pathname}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </IconLink> */}
          <IconLink href={"/profile"} text="Profile" pathname={router.pathname}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </IconLink>
        </nav>
      ) : null}
    </div>
  );
}
