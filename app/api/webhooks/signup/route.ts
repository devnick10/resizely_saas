import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;
  if (!SIGNING_SECRET) {
    throw new Error("Please add webhook secret.");
  }

  const wh = new Webhook(SIGNING_SECRET);
  const client = await clerkClient()
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured - No Svix headers");
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error(error)
    return new Response("Error occured", { status: 400 });
  }

  const eventT = evt.type;

  if (eventT === "user.created") {

    try {

      const { email_addresses, id ,first_name, username } = evt.data;
      const primaryemail = email_addresses[0]?.email_address;

      if (!primaryemail) {
        return new Response("No primary email found");
      }

      const { user, credit } = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: primaryemail,
            username: username || first_name || primaryemail.split("@")[0],
            clerkUserId: id,
          },
        });
        const credit = await tx.credit.create({
          data: {
            userId: user.id
          },
        });

        return { user, credit };
      });

      if (!user || !credit) {
        return new Response("Error creating user in database", { status: 400 });
      }
    } catch (error) {
      console.error(error)
      if(evt.data.id)client.users.deleteUser(evt.data.id)
      return new Response("Error creating user in database", { status: 400 });
    }
  }

  return new Response("Webhook recieved successfully", { status: 200 });
}
