/* eslint-disable camelcase */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { WebhookEvent } from "@clerk/nextjs/server";

import { createUser, deleteUser, updateUser } from "~/lib/actions/user.action";

const POST = async (req: Request) => {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  // It not possible to configure a custom domain in development environment on Clerk.
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  const WEBHOOK_SECRET_DEVELOP = process.env.WEBHOOK_SECRET_DEVELOP || "";

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const environment = headerPayload.get("environment");
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(
    environment === "development" ? WEBHOOK_SECRET_DEVELOP : WEBHOOK_SECRET
  );

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  switch (evt.type) {
    case "user.created": {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        username,
        image_url,
      } = evt.data;
      const mongoUser = await createUser({
        clerkId: id,
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        username: username!,
        email: email_addresses[0].email_address,
        picture: image_url,
      });

      return NextResponse.json({ message: "OK", user: mongoUser });
    }
    case "user.updated": {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        username,
        image_url,
      } = evt.data;
      const mongoUser = await updateUser({
        clerkId: id,
        updateData: {
          name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
          username: username!,
          email: email_addresses[0].email_address,
          picture: image_url,
        },
        path: `/profile/${id}`,
      });

      return NextResponse.json({ message: "OK", user: mongoUser });
    }
    case "user.deleted": {
      const { id } = evt.data;
      const deletedUser = await deleteUser({ clerkId: id! });

      return NextResponse.json({ message: "OK", user: deletedUser });
    }
    default: {
      console.log("Webhook body:", body);
      return NextResponse.json(
        { message: "Event type not handled" },
        { status: 200 }
      );
    }
  }
};

export { POST };
