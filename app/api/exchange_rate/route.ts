import { NextResponse } from 'next/server'
import {PrismaClient} from  '@prisma/client'
export const dynamic = 'force-dynamic'

export const revalidate = 1

export async function GET() {
  const prisma = new PrismaClient()
  const data = await prisma.exchange_rate.findFirstOrThrow()
  
  
  return NextResponse.json(data)
}