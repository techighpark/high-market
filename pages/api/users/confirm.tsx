import { withIronSessionApiRoute } from "iron-session/next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const existsToken = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!existsToken) res.status(404).end();
  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "highsession",
  password:
    "123123456781231234567812312345678123123456781231234567812312345678ssssss",
});
