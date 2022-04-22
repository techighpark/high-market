import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const streams = await client.stream.findMany({
      take: 10,
      skip: 0,
    });
    res.json({ ok: true, streams });
  }
  if (req.method === "POST") {
    const {
      session: { user },
      body: { name, price, description },
    } = req;
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, stream });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
