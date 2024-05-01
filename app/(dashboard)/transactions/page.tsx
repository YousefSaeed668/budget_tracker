"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth, subMonths } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import TransactionsTable from "./_components/TransactionsTable";

const TransactionsPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: new Date(),
  });
  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <h1 className="text-3xl font-bold">Transcations History</h1>
          </div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big, Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="container">
        <TransactionsTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
};

export default TransactionsPage;
