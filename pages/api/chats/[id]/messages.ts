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
    body: { message },
    session: { user },
  } = req;

  const newMessage = await client.message.create({
    data: {
      message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      chat: {
        connect: {
          id: +id,
        },
      },
    },
  });

  res.json({ ok: true, newMessage });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
