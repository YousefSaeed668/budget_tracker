import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        currency: "USD",
        userId: user.id,
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettings);
}
