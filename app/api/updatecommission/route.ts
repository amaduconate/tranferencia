import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// this is the api call to update the commission
export async function POST(req: NextRequest) {
	const commission = await req.json()

	console.log(commission)
	const prisma = new PrismaClient()
	await prisma.commission.update({
		where: {
			id: 1,
		},
		data: {
			fromEur: commission.fromEur,
			fromRub: commission.fromRub,
			fromXof: commission.fromXof,
		},
	})

  return NextResponse.json({ commission })
}
