import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
export const dynamic = 'force-dynamic'

const updateCurrency = async () => {
	const prisma = new PrismaClient()
	const commission = await prisma.commissionPartnership.findMany({ where: { id: 1 } })

	return commission
}

export async function GET() {
	const currency = await updateCurrency()
	return NextResponse.json(currency[0], { status: 200, statusText: 'ok' })
}
