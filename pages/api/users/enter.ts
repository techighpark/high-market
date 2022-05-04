const nodemailer = require("nodemailer");
import twilio from "twilio";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PW,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  if (phone) {
    console.log("phone");
    await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_SERVICE_SID,
      to: process.env.PHONE_NUM!,
      body: `Your login token is ${payload}`,
    });
  } else if (email) {
    console.log("email");
    await transporter.sendMail({
      from: `High-Market`,
      to: process.env.GMAIL_ID,
      subject: "High-Market Login Token",
      text: `your login token is ${payload}`,
      html: `
        <div style="text-align: center;">
          <p>Your login token is</p>
          <strong style="color:blue;">${payload}</strong>
        </div>
    `,
    });
  }
  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPravate: false });
