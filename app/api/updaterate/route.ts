import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 1;

const APIKEY = process.env.APIKEY as "KEY";

export async function GET() {
  // await startcronjob();

  const rateEur = await fetch(
    `https://v6.exchangerate-api.com/v6/${APIKEY}/pair/EUR/RUB`
  );
  const rateRub = await fetch(
    `https://v6.exchangerate-api.com/v6/${APIKEY}/pair/RUB/XOF`
  );
  const rateXof = await fetch(
    `https://v6.exchangerate-api.com/v6/${APIKEY}/pair/XOF/RUB`
  );

  const dataEur = await rateEur.json();
  const dataRub = await rateRub.json();
  const dataXof = await rateXof.json();

  const euroRate: number = (await dataEur.conversion_rate) as number;
  const rubleRate: number = (await dataRub.conversion_rate) as number;
  const xofRate: number = (await dataXof.conversion_rate) as number;

  const datareturn = {
    fromEur: euroRate,
    fromRub: rubleRate,
    fromXof: xofRate,
  };
  if (!datareturn) {
    return;
  }
  console.log(datareturn);
  const prisma = new PrismaClient();
  await prisma.exchange_rate.update({
    where: {
      id: 1,
    },
    data: {
      fromEur: datareturn.fromEur,
      fromRub: datareturn.fromRub,
      fromXof: datareturn.fromXof,
    },
  });
  return NextResponse.json({
    message: "Exchange rate cron job updated successfully",
  });
}
