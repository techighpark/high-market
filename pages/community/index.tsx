import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floatingButton";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Post, User } from "@prisma/client";
import useCoords from "@libs/client/useCoords";
import client from "@libs/server/client";
import { userInfo } from "os";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wonderings: number;
  };
}
interface PostResponse {
  ok: boolean;
  posts: PostWithUser[];
}

const Community: NextPage = () => {
  const { user } = useUser();
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<PostResponse>(
    latitude && longitude
      ? `/api/posts?latitude=${latitude}&longitude=${longitude}`
      : null
  );

  return (
    <Layout title="Community" hasTabBar seoTitle="Community">
      <div className="space-y-8 px-4">
        {data?.posts?.map(post => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <a className=" flex cursor-pointer flex-col items-start">
              <span className="flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                동네질문
              </span>
              <div className="text-gra-700 mt-2">
                <span className="font-medium text-orange-500">Q.</span>
                {post.question}
              </div>
              <div className=" mt-5 flex w-full items-center justify-between text-xs font-medium">
                {post.user.id === user?.id ? (
                  <span className="rounded-full border border-orange-500 p-1 font-normal text-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                      />
                    </svg>
                  </span>
                ) : (
                  post.user.name
                )}
              </div>
              <div className="mt-3 flex w-full space-x-5 border-t border-b-[2px] py-2.5 text-gray-700">
                <span className="flex items-center space-x-2 text-sm">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Me too {post._count?.wonderings}</span>
                </span>
                <span className="flex items-center space-x-2 text-sm">
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
                  <span>Answer {post._count?.answers}</span>
                </span>
              </div>
            </a>
          </Link>
        ))}
        <FloatingButton href={"/community/write"}>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ posts: Post[] }> = ({ posts }) => {
  const { latitude, longitude } = useCoords();

  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/posts?latitude=${latitude}&longitude=${longitude}`]: {
            ok: true,
            posts,
          },
        },
      }}
    >
      <Community />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  // console.log("BUILDING COMM. STATICALLY");
  const posts = await client.post.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
    // revalidate: 120,
  };
}

export default Page;
