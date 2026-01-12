"use server";

import prisma from "@/db";
import { getUser } from "@/lib/data/user/getUser";
import { Transformation } from "@/types";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { revalidateTag } from "next/cache";

type SaveTransformationPayload =
  | {
      type: "DERIVED";
      imagePublicId: string;
      transformation: Transformation;
    }
  | {
      type: "IRREVERSIBLE";
      imagePublicId: string;
      transformedPublicId: string;
    };

export async function saveTransformation(payload: SaveTransformationPayload) {
  const user = await getUser();

  const transformationHash =
    payload.type === "DERIVED"
      ? crypto
          .createHash("sha256")
          .update(JSON.stringify(payload.transformation ?? {}))
          .digest("hex")
      : crypto.randomUUID();

  try {
    await prisma.$transaction(async (txn) => {
      const image =
        (await txn.image.findFirst({
          where: { publicId: payload.imagePublicId, userId: user.id },
        })) ??
        (await txn.image.create({
          data: { publicId: payload.imagePublicId, userId: user.id! },
        }));

      await txn.transformedImage.create({
        data: {
          imageId: image.id,
          publicId:
            payload.type === "IRREVERSIBLE"
              ? payload.transformedPublicId
              : payload.imagePublicId,
          type: payload.type,
          transformation:
            payload.type === "DERIVED"
              ? (payload.transformation as Prisma.JsonObject)
              : Prisma.DbNull,
          transformationHash,
        },
      });
    });

    revalidateTag(`images_${user.id}`);
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Transformation already exists");
    }
    throw err;
  }
}
