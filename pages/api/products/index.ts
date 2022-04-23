import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const products = await client.product.findMany({
      where: {
        userId: {
          not: user?.id,
        },
      },
      include: {
        progress: {
          select: {
            state: true,
          },
        },
        favs: true,
        _count: {
          select: {
            favs: true,
          },
        },
      },
    });

    res.json({ ok: true, products });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: photoId,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    await client.sale.create({
      data: {
        product: {
          connect: {
            id: product.id,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({ ok: true, product });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
