import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const APIURL = process.env.APIURL as 'URL'

const fetchRate = async () => {

	try {
		const rateexchange = await fetch(APIURL)
		const data = await rateexchange.json()
    
		const rubleRate = data.data.RUB
    console.log(rubleRate)
		return rubleRate
	} catch (error) {
		console.log(error)
		return null
	}
}

const updateRate = async (rate: number) => {
	if (!rate) return

	const prisma = new PrismaClient()
	await prisma.currency.update({
		where: {
			id: 1,
		},
		data: {
			rubles: rate as number,
		},
	})
}

const startcronjob = () => {
	fetchRate().then((rates) => {
		updateRate(rates)
	})

	// setInterval(async () => {
	// 	const rate = await fetchRate()
	// 	await updateRate(rate)
	// }, 6 * 60 * 60 * 1000)
}

startcronjob()

export async function GET() {

  startcronjob()
	return NextResponse.json({ message: 'Exchange rate cron job started' })
}
