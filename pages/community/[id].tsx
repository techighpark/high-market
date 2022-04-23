import type { NextPage } from "next";
import Layout from "@components/layout";
import Textarea from "@components/textarea";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useEffect } from "react";
import useUser from "@libs/client/useUser";
import RoundImage from "@components/roundImage";

interface AnswerWithUser extends Answer {
  user: User;
}
interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wonderings: number;
  };
  answers: AnswerWithUser[];
}
interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  newAnswer: Answer;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data, mutate: boundMutate } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );

  const [wonder, { loading }] = useMutation<AnswerResponse>(
    `/api/posts/${router.query.id}/wonder`
  );
  const onWonderClick = () => {
    if (!data || loading) return;
    boundMutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data?.post._count,
            wonderings: data.isWondering
              ? data?.post._count.wonderings - 1
              : data?.post._count.wonderings + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    if (!loading) {
      wonder({});
    }
  };

  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation(`/api/posts/${router.query.id}/answers`);

  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      boundMutate();
    }
  }, [answerData, reset, boundMutate]);
  return (
    <Layout canGoBack seoTitle={data?.post?.user?.name + " - Community"}>
      <div className="">
        <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          동네질문
        </span>
        <div className="mb-3 flex cursor-pointer items-center space-x-3  border-b px-4 pb-3">
          <RoundImage src={data?.post?.user?.avatar!} lg={false} />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {data?.post?.user?.name}
            </p>
            <Link href={`/users/profiles/${data?.post?.user.id}`}>
              <a className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700 ">
            <span className="mr-2 font-medium text-orange-500">Q.</span>
            {data?.post?.question}
          </div>
          <div className="mt-3 flex w-full space-x-5 border-t border-b-[2px] px-4 py-2.5  text-gray-700">
            <button
              onClick={onWonderClick}
              className={cls(
                "flex items-center space-x-2 text-sm",
                data?.isWondering ? "text-orange-600" : ""
              )}
            >
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
              <span>Check {data?.post?._count?.wonderings}</span>
            </button>
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
              <span>Answer {data?.post?._count?.answers}</span>
            </span>
          </div>
        </div>
        <div className="my-5 space-y-5 px-4 ">
          {data?.post?.answers?.map(answer => (
            <div
              className="flex items-center justify-start space-x-3"
              key={answer.id}
            >
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div className=" flex w-full flex-col items-start  font-normal">
                {answer.user.id === user?.id ? (
                  <div className="rounded-full text-orange-600">
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
                  </div>
                ) : (
                  <span className=" text-xs font-semibold">
                    {answer.user.name}
                  </span>
                )}
                <div className=" text-sm text-gray-600">{answer.answer}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4">
          <form onSubmit={handleSubmit(onValid)}>
            <Textarea
              register={register("answer", { required: true, minLength: 5 })}
              name="description"
              placeholder="Answer this question!"
              required
            />

            <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
              {answerLoading ? "Loading..." : "Reply"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
