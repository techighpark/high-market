/* eslint-disable jsx-a11y/alt-text */
import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import { Chat, Message, Product, User } from "@prisma/client";
import { withSsrSession } from "@libs/server/withSession";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import { Fragment } from "react";
import RoundImage from "@components/roundImage";

interface ProductWithUser extends Product {
  user: User;
}
interface ChatWithMessage extends Chat {
  messages: Message[];
  users: User[];
  product: ProductWithUser;
}
interface ChatsResponse {
  ok: boolean;
  chatRooms: ChatWithMessage[];
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<ChatsResponse>("/api/chats");

  return (
    <Layout hasTabBar title="Chat" seoTitle="Chat">
      <div className="divide-y-[1px]">
        {data?.chatRooms?.map(chat => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <a className="flex cursor-pointer items-start space-x-3 px-4 py-3">
              {chat.users.map(chatUser => {
                if (user?.id && chatUser.id !== user.id) {
                  return (
                    <Fragment key={chatUser.id}>
                      <RoundImage src={chatUser.avatar!} lg={false} />
                    </Fragment>
                  );
                }
              })}
              <div className="flex flex-col">
                {chat.users.map(chatUser => {
                  if (user?.id && chatUser.id !== user.id)
                    return (
                      <p className="text-gray-700" key={chatUser.id}>
                        {chatUser.name}
                      </p>
                    );
                })}
                <p className="text-sm text-gray-500">
                  {chat?.messages[0]?.message}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

const Page: NextPage<{ chatRooms: Chat[] }> = ({ chatRooms }) => {
  return (
    <SWRConfig value={{ fallback: { "/api/chats": { ok: true, chatRooms } } }}>
      <Chats />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const chatRooms = await client.chat.findMany({
      where: {
        OR: [
          {
            users: {
              some: {
                id: req?.session?.user?.id,
              },
            },
          },
          {
            product: {
              user: {
                id: req?.session?.user?.id,
              },
            },
          },
        ],
      },
      include: {
        users: true,
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            userId: true,
            message: true,
          },
        },
        product: {
          select: {
            image: true,
            user: true,
          },
        },
      },
    });

    return {
      props: {
        chatRooms: JSON.parse(JSON.stringify(chatRooms)),
      },
    };
  }
);

export default Page;
