import { NextApiResponse, NextApiRequest } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type WithHandlerMethod = "GET" | "POST" | "DELETE";
type withHandlerFunction = (req: NextApiRequest, res: NextApiResponse) => void;

export default function withHandler(
  method: WithHandlerMethod,
  fn: withHandlerFunction
) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method !== method) {
      return res.status(405).end();
    }
    try {
      await fn(req, res);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ e });
    }
  };
}
