"use client";

import { getBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeltonWrapper from "@/components/SkeltonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, getFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";
interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}
const StatsCards = ({ from, to, userSettings }: Props) => {
  const statsQuery = useQuery<getBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });
  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  const income = statsQuery.data?.income || 0;
  console.log(income);
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeltonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10 " />
          }
        />
      </SkeltonWrapper>
      <SkeltonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10 " />
          }
        />
      </SkeltonWrapper>
      <SkeltonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10 " />
          }
        />
      </SkeltonWrapper>
    </div>
  );
};

export default StatsCards;

function StatCard({
  title,
  value,
  icon,
  formatter,
}: {
  formatter: Intl.NumberFormat;
  title: string;
  value: number;
  icon: ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value).replace("EGP", "E£");
    },
    [formatter]
  );
  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
