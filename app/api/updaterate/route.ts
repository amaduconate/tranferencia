import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const APIKEY = process.env.APIKEY as "KEY";

const fetchRate = async () => {
  try {
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

    return {
      fromEur: euroRate,
      fromRub: rubleRate,
      fromXof: xofRate,
    };
  } catch (error) {
    console.log(error);
    console.log(
      "something has gone wrong in fetching the data in updateRate api"
    );
    return null;
  }
};

const updateRate = async (
  rates: { fromEur: number; fromRub: number; fromXof: number } | null
) => {
  if (!rates) return;
  console.log(rates.fromEur);
  const prisma = new PrismaClient();
  await prisma.exchange_rate.update({
    where: {
      id: 1,
    },
    data: {
      fromEur: rates.fromEur,
      fromRub: rates.fromRub,
      fromXof: rates.fromXof,
    },
  });
};

const startcronjob = async () => {
  await fetchRate().then((rates) => {
    updateRate(rates);
  });

  // setInterval(async () => {
  // 	const rate = await fetchRate()
  // 	await updateRate(rate)
  // }, 6 * 60 * 60 * 1000)
};

export async function GET() {
  await startcronjob();
  return NextResponse.json({
    message: "Exchange rate cron job updated successfully",
  });
}
