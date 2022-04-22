import { Chat } from "@prisma/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { id },
    session: { user },
  } = req;
  if (req.method === "POST") {
    const product = await client.product.findUnique({
      where: { id: +id },
    });
    const exist = await client.chat.findFirst({
      where: {
        productId: product?.id,
        users: {
          some: {
            id: user?.id,
          },
        },
      },
    });

    if (exist) {
      res.json({ ok: true, chatRoom: exist });
    }
    if (!exist) {
      const chatRoom = await client.chat.create({
        data: {
          users: {
            connect: [
              {
                id: user?.id,
              },
              {
                id: product?.userId,
              },
            ],
          },
          product: {
            connect: {
              id: product?.id,
            },
          },
        },
      });
      res.json({ ok: true, chatRoom });
    }
  }
  if (req.method === "GET") {
    const chatRooms = await client.chat.findMany({
      where: {
        OR: [
          {
            users: {
              some: {
                id: user?.id,
              },
            },
          },
          {
            product: {
              user: {
                id: user?.id,
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
    res.json({ ok: true, chatRooms });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
