import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function GET(requset: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}
export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;
async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "asc",
    },
  });
  const years = result.map((l) => l.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }
  return years;
}
