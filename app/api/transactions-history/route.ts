import { getFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }
  const transaction = await getTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );
  return Response.json(transaction);
}

export type GetTransactionsHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;
async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: userId },
  });
  if (!userSettings) {
    throw new Error("User settings not found");
  }

  const formmater = getFormatterForCurrency(userSettings.currency);
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return transactions.map((transaction) => ({
    ...transaction,
    formattedAmount: formmater.format(transaction.amount),
  }));
}
