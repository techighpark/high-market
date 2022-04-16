import { NextApiResponse, NextApiRequest } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type WithHandlerMethod = "GET" | "POST" | "DELETE";
type withHandlerFunction = (req: NextApiRequest, res: NextApiResponse) => void;
interface ConfigType {
  methods: WithHandlerMethod[];
  handler: withHandlerFunction;
  isPravate?: boolean;
}

export default function withHandler({
  methods,
  handler,
  isPravate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    return new Promise<void>(resolve => {
      if (req.method && !methods.includes(req.method as any)) {
        return res.status(405).end();
      }
      if (isPravate && !req.session.user) {
        res.status(401).json({ ok: false, error: "You need to log in." });
        return resolve();
      }
      try {
        handler(req, res);
      } catch (e) {
        res.status(500).json({ e });
        return resolve();
      }
    });
  };
}
