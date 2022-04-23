import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;

  const chatRoom = await client.chat.findUnique({
    where: {
      id: +id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
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
      product: {
        select: {
          userId: true,
          name: true,
          price: true,
          image: true,
          progress: {
            select: {
              state: true,
              userId: true,
            },
          },
        },
      },
    },
  });
  res.json({ ok: true, chatRoom });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
