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
    session: { user },
  } = req;

  const products = await client.product.findUnique({
    where: {
      id: +id.toString(),
    }, //******/
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = products?.name
    .split(" ")
    .map(term => ({ name: { contains: term } }));

  const similartProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: products?.id,
        },
      },
    },
  });

  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        userId: user?.id,
        productId: products?.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({ ok: true, products, isLiked, similartProducts });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
