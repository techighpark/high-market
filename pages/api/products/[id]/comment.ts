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
    body: { comment },
    session: { user },
  } = req;
  if (req.method === "POST") {
    const myComment = await client.comment.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id,
          },
        },
        comment,
      },
    });

    res.json({ ok: true, myComment });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
