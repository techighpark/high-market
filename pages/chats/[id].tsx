import type { GetServerSidePropsContext, NextPage } from "next";
import Layout from "@components/layout";
import Msg from "@components/message";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import { Chat, Message, User } from "@prisma/client";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import { useForm } from "react-hook-form";
import useUser from "@libs/client/useUser";

interface ChatMessageWithUser {
  id: number;
  message: string;
  user: {
    id: number;
    avatar?: string;
  };
}

interface ChatWithMessage extends Chat {
  messages: ChatMessageWithUser[];
  users: User[];
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
  return (
    <Layout title="Chat" canGoBack seoTitle={"Chat with " + "User"}>
      <div className="space-y-4 py-10 px-4 pb-16">
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
