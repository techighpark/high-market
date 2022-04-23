import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const purchases = await client.purchase.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          progress: {
            select: {
              state: true,
            },
          },
          _count: {
            select: {
              favs: true,
            },
          },
        },
      },
    },
  });
  console.log(purchases);

  res.json({
    ok: true,
    purchases,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
