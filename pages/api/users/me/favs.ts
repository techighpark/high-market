import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import fav from "pages/api/products/[id]/fav";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const favs = await client.fav.findMany({
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

  res.json({
    ok: true,
    favs,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
