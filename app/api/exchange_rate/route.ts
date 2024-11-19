import { NextResponse } from 'next/server'
import {PrismaClient} from  '@prisma/client'

export const revalidate = 1

export async function GET() {
  const prisma = new PrismaClient()
  const data = await prisma.currency.findMany()
  // const commission = await prisma.commission.findMany()
  // const fulldata = {ruble: data[0].rubles, commission: commission[0]}
  // console.log(fulldata)
  return NextResponse.json(data[0].rubles)
}