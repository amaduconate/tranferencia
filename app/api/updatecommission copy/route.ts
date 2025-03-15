import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// this is the api call to update the commission
export async function POST(req: NextRequest) {
	const commission = await req.json()

	console.log(commission)
	const prisma = new PrismaClient()
	await prisma.commissionPartnership.update({
		where: {
			id: 1,
		},
		data: {
			fromEurPartnership: commission.fromEur,
			fromRubPartnership: commission.fromRub,
			fromXofPartnership: commission.fromXof,
		},
	})

  return NextResponse.json({ commission })
}
