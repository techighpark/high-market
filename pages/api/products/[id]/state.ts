import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { id, state, users },
    session: { user },
  } = req;

  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
  });

  if (product) {
    console.log("product");
    if (state === "reserve") {
      console.log("reserve");
      const exist = await client.progress.findFirst({
        where: {
          productId: product.id,
          state: "reserved",
        },
      });
      if (exist) {
        await client.progress.delete({
          where: {
            id: exist.id,
          },
        });
        console.log("reserve exist");
        res.json({ ok: true, state: { state: null } });
      } else {
        const state = await client.progress.create({
          data: {
            user: {
              connect: {
                id: user?.id,
              },
            },
            product: {
              connect: {
                id: product.id,
              },
            },
            state: "reserved",
          },
        });
        console.log("reserve no exist");
        res.json({ ok: true, state });
      }
    }
    if (state === "done") {
      console.log("done");
      const exist = await client.progress.findFirst({
        where: {
          productId: product.id,
          OR: [{ state: "sold" }, { state: "reserved" }],
        },
      });
      if (exist) {
        console.log("done exist");
        if (exist.state === "reserved") {
          const state = await client.progress.update({
            where: {
              id: exist.id,
            },
            data: {
              state: "sold",
            },
          });
          console.log("done exist-reserve");
          res.json({ ok: true, state });
        }
        if (exist.state === "sold") {
          await client.progress.delete({
            where: {
              id: exist.id,
            },
          });
          const purchase = await client.purchase.findFirst({
            where: {
              productId: product.id,
            },
          });
          await client.purchase.delete({
            where: {
              id: purchase?.id,
            },
          });
          console.log("done exist-sold");
          res.json({ ok: true, state: { state: null } });
        }
      } else {
        console.log("done no exist");
        const purchaseUers = users.filter(
          (purchaseUser: { id: number | undefined }) =>
            purchaseUser.id !== user?.id
        );
        const state = await client.progress.create({
          data: {
            user: {
              connect: {
                id: user?.id,
              },
            },
            product: {
              connect: {
                id: product.id,
              },
            },
            state: "sold",
          },
        });
        await client.purchase.create({
          data: {
            product: {
              connect: {
                id: product.id,
              },
            },
            user: {
              connect: {
                id: purchaseUers[0].id,
              },
            },
          },
        });
        res.json({ ok: true, state });
      }
    }
  }
  if (!product) {
    console.log("no product");
    res.json({ ok: false, error: "Can not found." });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
