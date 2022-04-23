import type { GetServerSidePropsContext, NextPage } from "next";
import Layout from "@components/layout";
import Msg from "@components/message";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import { Chat, Product, Progress, User } from "@prisma/client";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import { useForm } from "react-hook-form";
import useUser from "@libs/client/useUser";
import SmallButton from "@components/smallButton";
import SquareImage from "@components/squareImage";
import Link from "next/link";

interface ChatMessageWithUser {
  id: number;
  message: string;
  user: {
    id: number;
    avatar?: string;
  };
}

interface ProductProgress extends Product {
  progress: Progress;
}

interface ChatWithMessage extends Chat {
  messages: ChatMessageWithUser[];
  users: User[];
  product: ProductProgress;
}
interface ChatMsgResponse {
  ok: boolean;
  chatRoom: ChatWithMessage;
}
interface SendMsgForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<SendMsgForm>();
  const [sendMessage, { data: sendMessageData, loading }] = useMutation(
    `/api/chats/${router.query.id}/messages`
  );
  const { data, mutate } = useSWR<ChatMsgResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null,
    { refreshInterval: 2000 }
  );

  const onValid = (form: SendMsgForm) => {
    if (loading) return;
    sendMessage(form);
    reset();
    mutate(
      prev =>
        prev &&
        ({
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            messages: [
              ...prev.chatRoom.messages,
              {
                id: Date.now(),
                message: form.message,
                user: { ...user },
              },
            ],
          },
        } as any),
      false
    );
  };
  const [updateState, { data: stateData, loading: reserveLoading }] =
    useMutation(`/api/products/${data?.chatRoom.productId}/state`);

  const onClickReserve = () => {
    if (reserveLoading) return;
    updateState({ id: data?.chatRoom.productId, state: "reserve" });
    mutate(
      prev =>
        prev && {
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            product: {
              ...prev.chatRoom.product,
              progress: stateData?.state?.state,
            },
          },
        },
      false
    );
  };
  const onClickDone = () => {
    if (reserveLoading) return;
    updateState({
      id: data?.chatRoom.productId,
      state: "done",
      users: data?.chatRoom?.users,
    });
    mutate(
      prev =>
        prev && {
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            product: {
              ...prev.chatRoom.product,
              progress: stateData?.state?.state,
            },
          },
        },
      false
    );
  };

  return (
    <Layout title="Chat" canGoBack seoTitle={"Chat with " + "User"}>
      <div className=" relative flex justify-between border-b px-4 py-4">
        <Link href={`/products/${data?.chatRoom?.productId}`}>
          <a>
            <div className=" flex items-start space-x-2 font-normal">
              <div className="my-auto">
                <SquareImage
                  src={data?.chatRoom?.product?.image!}
                  size="w-12 h-12"
                />
              </div>
              <div className="my-auto flex flex-col space-y-1 ">
                <span className="text-sm font-bold text-gray-700">
                  {data?.chatRoom?.product?.name}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  $ {data?.chatRoom?.product?.price}
                </span>
              </div>
            </div>
          </a>
        </Link>
        <div className=" flex flex-col justify-center space-y-2">
          {data?.chatRoom?.product?.userId === user?.id ? (
            <SmallButton
              text="Done"
              disable={true}
              onClick={onClickDone}
              clicked={data?.chatRoom?.product?.progress?.state === "sold"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </SmallButton>
          ) : (
            ""
          )}
          {data?.chatRoom?.product?.progress?.state === "sold" &&
          data?.chatRoom?.product?.userId !== user?.id ? (
            <div className="">
              <span className="absolute inset-0 z-10 flex h-full w-full items-center justify-center text-xs font-bold text-white">
                Sorry, already sold.
              </span>
              <div className="absolute inset-0 h-full w-full bg-orange-600 opacity-80" />
            </div>
          ) : (
            <SmallButton
              text={
                data?.chatRoom?.product?.progress?.state === "reserved"
                  ? "Reserved"
                  : "Reserve"
              }
              clicked={data?.chatRoom?.product?.progress?.state === "reserved"}
              disable={
                data?.chatRoom?.product?.progress?.userId !== undefined
                  ? data?.chatRoom?.product?.progress?.userId === user?.id ||
                    data?.chatRoom?.product?.userId === user?.id
                  : true
              }
              sold={data?.chatRoom?.product?.progress?.state === "sold"}
              onClick={onClickReserve}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </SmallButton>
          )}
        </div>
      </div>
      <div className="space-y-4 px-4 pb-20 pt-4">
        {data?.chatRoom?.messages?.map(message => (
          <div key={message.id}>
            <Msg
              avatarUrl={message.user.avatar}
              message={message.message}
              reversed={message.user.id === user?.id}
            />
          </div>
        ))}
        <div className="fixed inset-x-0 bottom-0 bg-white py-2">
          <form
            onSubmit={handleSubmit(onValid)}
            className="relative mx-auto flex w-full max-w-md items-center"
          >
            <input
              type="text"
              {...register("message", { required: true })}
              className="mx-4 mb-2 w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
            <div className="absolute inset-y-0 bottom-2 right-4 flex py-1.5 pr-1.5">
              <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ chatRoom: Chat }> = ({ chatRoom }) => {
  const router = useRouter();
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/chats/${router.query.id}`]: { ok: true, chatRoom },
        },
      }}
    >
      <ChatDetail />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async (ctx: GetServerSidePropsContext) => {
    const { query } = ctx;
    const chatRoom = await client.chat.findUnique({
      where: { id: +query.id! },
      include: {
        messages: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                id: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return {
      props: {
        chatRoom: JSON.parse(JSON.stringify(chatRoom)),
      },
    };
  }
);
export default Page;
