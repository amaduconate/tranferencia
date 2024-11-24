'use client'

import React, { useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '../../components/ui/input'
import {
	Select,
	SelectLabel,
	SelectTrigger,
	SelectGroup,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import * as z from 'zod'
import { useState } from 'react'

import { SelectValue } from '@radix-ui/react-select'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import currency from 'currency.js'

function InterTransfer() {
	const [amount, setAmount] = useState<number | string | undefined>('')
	const [amountReceived, setAmountReceived] = useState<
		number | string | undefined
	>('')
	const [fromCurrency, setFromCurrency] = useState<string>('De Onde')
	const [toCurrency, setToCurrency] = useState<string>('Para onde')
	const [dataRate, setDataRate] = useState<{
		id: number
		fromEur: number
		fromRub: number
		fromXof: number
	}>()
	const [commission, setCommission] = useState<{
		fromEur: number
		fromRub: number
		fromXof: number
		id: number
	}>()
	useEffect(() => {
		// debounce(getRubleRate, 500)niioo
		// getRubleRate().then(selectCqwountry)
		selectCountry()
		getRubleRate()
	}, [fromCurrency, toCurrency])
	const inputschema1 = z.coerce
		.number()
		.positive()
		.superRefine((n, ctx) => {
			if (fromCurrency === 'EUR' && toCurrency === 'RUB' && n > 10000) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					maximum: 10000,
					type: 'number',
					inclusive: true,
					message: 'O valor deve ser inferior a 10.000',
				})
			}

			if (fromCurrency === 'RUB' && toCurrency === 'XOF' && n > 100000) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					maximum: 1000000,
					type: 'number',
					inclusive: true,
					message: 'O valor deve ser inferior a 1.000.000',
				})
			}
			if (fromCurrency === 'XOF' && toCurrency === 'RUB' && n > 1000000) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					maximum: 1000000,
					type: 'number',
					inclusive: true,
					message: 'O valor deve ser inferior a 1.000.000',
				})
			}
		})
	const inputschema2 = z.coerce
		.number()
		.positive()
		.superRefine((n, ctx) => {
			if (fromCurrency === 'EUR' && toCurrency === 'RUB' && n > 500000) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					maximum: 100000,
					type: 'number',
					inclusive: true,
					message: 'O valor deve ser inferior a 100.000',
				})
			}

			if (fromCurrency === 'RUB' && toCurrency === 'XOF' && n > 1000000) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					maximum: 1000000,
					type: 'number',
					inclusive: true,
					message: 'O valor deve ser inferior a 10.000.000',
				})
			}
			if (fromCurrency === 'XOF' && toCurrency === 'RUB' && n > 1000000) {
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					maximum: 1000000,
					type: 'number',
					inclusive: true,
					message: 'O valor deve ser inferior a 1.000.000',
				})
			}
		})

	const { toast } = useToast()

	const handleamountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		const parseInputSchema = inputschema1.safeParse(e.target.value)
		console.log(parseInputSchema.data)

		// Check if the country is selected
		if (
			!(
				fromCurrency === 'XOF' ||
				fromCurrency === 'RUB' ||
				fromCurrency === 'EUR'
			)
		) {
			toast({ variant: 'destructive', title: 'Seliciona o país preferido' })
		}

		if (parseInputSchema.success && parseInputSchema.data > 0) {
			setAmount(parseInputSchema.data)
			getExchangeRateSender(
				fromCurrency,
				parseInputSchema.data,
				dataRate,
				toCurrency
			)
		}
		if (
			!parseInputSchema.success &&
			parseInputSchema.error.issues[0].code === 'invalid_type'
		) {
			return
		}

		if (
			!parseInputSchema.success &&
			parseInputSchema.error.issues[0].code === 'too_big'
		) {
			toast({
				variant: 'destructive',
				title: parseInputSchema.error?.issues[0].message,
			})
		}
		if (!parseInputSchema.success) {
			console.log(parseInputSchema.error)
			setAmount(parseInputSchema.data)
			setAmountReceived('')
		}
		// if (!Number.isNaN(parseFloat(e.target.value))) {
		// 	setAmount(parseFloat(e.target.value))
		// 	getExchangeRateSender(fromCurrency, parseFloat(e.target.value), dataRuble)
		// }
		if (e.target.value === '') {
			setAmountReceived('')
			setAmount(undefined)
		}
	}

	const handleamountReceivedChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		// e.preventDefault()
		// if (!Number.isNaN(parseFloat(e.target.value))) {
		// 	setAmountReceived(parseFloat(e.target.value))
		// 	getExchangeRateReceiver(toCurrency, parseFloat(e.target.value), dataRuble)
		// }

		e.preventDefault()
		// Check if the country is selected
		if (
			!(
				fromCurrency === 'XOF' ||
				fromCurrency === 'RUB' ||
				fromCurrency === 'EUR'
			)
		) {
			toast({ variant: 'destructive', title: 'Seliciona o país preferido' })
		}

		const parseInputSchema2 = inputschema2.safeParse(e.target.value)

		//if parseinput is not valid then it precides with the value
		if (parseInputSchema2.success && parseInputSchema2.data > 0) {
			setAmountReceived(parseInputSchema2.data)
			getExchangeRateReceiver(
				toCurrency,
				parseInputSchema2.data,
				dataRate,
				fromCurrency
			)
		}
		//otherwise it will prompt the user with the error

		if (
			!parseInputSchema2.success &&
			parseInputSchema2.error.issues[0].code === 'invalid_type'
		) {
			return
		}

		if (
			!parseInputSchema2.success &&
			parseInputSchema2.error.issues[0].code === 'too_big'
		) {
			console.log(parseInputSchema2.error?.issues[0].message)
			toast({
				variant: 'destructive',
				title: parseInputSchema2.error?.issues[0].message,
			})
		}
		if (!parseInputSchema2.success) {
			setAmountReceived(parseInputSchema2.data)
			setAmount('')
		}

		if (e.target.value === '') {
			setAmountReceived(undefined)
			setAmount('')
		}
	}

	const selectCountry = () => {
		if (fromCurrency === 'EUR') {
			setToCurrency('RUB')
		} else if (fromCurrency === 'RUB') {
			setToCurrency('XOF')
		} else if (fromCurrency === 'XOF') {
			setToCurrency('RUB')
		}
	}

	const getRubleRate = async () => {
		const exchange_rate = await fetch('/api/exchange_rate', {
			method: 'GET',
			cache: 'no-store',
			// next: { revalidate: 3600 * 20 },
		})
		const commission = await fetch('/api/fetchcommission', {
			method: 'GET',
			cache: 'no-store',
			// next: { revalidate: 3600 * 20 },
		})
		const dataCommission: {
			id: number
			fromEur: number
			fromRub: number
			fromXof: number
		} = await commission.json()
		const dataExchangeRate: {
			id: number
			fromEur: number
			fromRub: number
			fromXof: number
		} = await exchange_rate.json()
		setDataRate(dataExchangeRate)
		setCommission(dataCommission)
	}

	function getExchangeRateSender(
		fromCurrency: string,
		amount: number | undefined,
		dataRate:
			| { id: number; fromEur: number; fromRub: number; fromXof: number }
			| undefined,
		toCurrency: string
	) {
		if (
			typeof commission !== 'undefined' &&
			typeof amount == 'number' &&
			typeof dataRate !== 'undefined'
		) {
			// const parseDataRate = parseFloat(dataRate.toFixed(4))
			// const parsecommission = parseFloat(
			// 	((100 - commission.fromEur) / 100).toFixed(5)
			// )
			console.log(amount)
			if (fromCurrency === 'EUR' && toCurrency === 'RUB') {
				// const parseamount = parseFloat(amount.toFixed(3))
				// const calculateAmountReceived =
				// 	parseamount * parseDataRate * parsecommission
				// setAmountReceived(parseFloat(calculateAmountReceived.toFixed()))

				const rateWithCommission = currency(
					currency(dataRate.fromEur, { precision: 9 })
						.divide(100)
						.multiply(100 - commission.fromEur),
					{ precision: 8 }
				).value
				const amountReceivedFinal = currency(amount, { precision: 0 }).multiply(
					rateWithCommission
				)
				setAmountReceived(amountReceivedFinal.value)
			} else if (fromCurrency === 'RUB' && toCurrency === 'XOF') {
				// const parseamount = parseFloat(amount.toFixed(4))
				// const calculateAmountReceived =
				// 	((parseamount * 655) / parseDataRate) * parsecommission
				// setAmountReceived(parseFloat(calculateAmountReceived.toFixed()))
				const rateWithCommission = currency(
					currency(dataRate.fromRub, { precision: 6 })
						.divide(100)
						.multiply(100 - commission.fromRub),
					{ precision: 5 }
				).value
				console.log(`this is xof ${rateWithCommission}`)
				const amountReceivedFinal = currency(amount, { precision: 0 }).multiply(
					rateWithCommission
				)

				setAmountReceived(amountReceivedFinal.value)
			} else if (fromCurrency === 'XOF' && toCurrency === 'RUB') {
				// const parseamount = parseFloat(amount.toFixed())
				// const calculateAmountReceived =
				// 	(parseamount / 655) * parseDataRate * parsecommission
				// setAmountReceived(parseFloat(calculateAmountReceived.toFixed(3)))

				const rateWithCommission = currency(
					currency(dataRate.fromXof, { precision: 9 })
						.divide(100)
						.multiply(100 - commission.fromXof),
					{ precision: 8 }
				).value
				console.log(`this is xof ${rateWithCommission}`)
				const amountReceivedFinal = currency(amount, { precision: 0 }).multiply(
					rateWithCommission
				)

				setAmountReceived(amountReceivedFinal.value)
			}
		}
	}

	function getExchangeRateReceiver(
		toCurrency: string,
		amountReceived: number | undefined,
		dataRate:
			| {
					id: number
					fromEur: number
					fromRub: number
					fromXof: number
			  }
			| undefined,
		fromCurrency: string
	) {
		console.log(dataRate)
		if (
			typeof commission !== 'undefined' &&
			typeof amountReceived == 'number' &&
			typeof dataRate !== 'undefined'
		) {
			// const parseDataRate = parseFloat(dataRate.toFixed(2))
			// const parsecommission = parseFloat(
			// 	((100 + commission.fromEur) / 100).toFixed(5)
			// )
			if (toCurrency === 'RUB' && fromCurrency === 'XOF') {
				// const parseamountReceived = parseFloat(amountReceived.toFixed(3))
				// const calculateAmount =
				// 	(parseamountReceived / parseDataRate) * 655 * parsecommission
				// setAmount(parseFloat(calculateAmount.toFixed()))
				const rateWithCommission = currency(
					currency(dataRate.fromXof, { precision: 12 })
						.divide(100)
						.multiply(100 - commission.fromXof),
					{ precision: 10 }
				).value
				const amountFinal = currency(amountReceived, { precision: 1}).divide(
					rateWithCommission
				)

				setAmount(amountFinal.value)
			} else if (toCurrency === 'XOF' && fromCurrency === 'RUB') {
				// const parseamountReceived = parseFloat(amountReceived.toFixed())
				// const calculateAmount =
				// 	(parseamountReceived / 655) * parseDataRate * parsecommission
				// setAmount(parseFloat(calculateAmount.toFixed(3)))
				const rateWithCommission = currency(
					currency(dataRate.fromRub, { precision: 8 })
						.divide(100)
						.multiply(100 - commission.fromRub),
					{ precision: 6 }
				).value
				const amountFinal = currency(amountReceived, { precision: 0 }).divide(
					rateWithCommission
				)
				setAmount(amountFinal.value)
			} else if (toCurrency === 'RUB' && fromCurrency === 'EUR') {
				// const parseamountReceived = parseFloat(amountReceived.toFixed())
				// const calculateAmount =
				// 	(parseamountReceived / parseDataRate) * parsecommission
				// setAmount(parseFloat(calculateAmount.toFixed(3)))

				const rateWithCommission = currency(
					currency(dataRate.fromEur, { precision: 9 })
						.divide(100)
						.multiply(100 - commission.fromEur),
					{ precision: 8 }
				).value
				const amountFinal = currency(amountReceived, { precision: 1, symbol: '€' }).divide(
					rateWithCommission
				)
				console.log(`this is ${amountFinal.format()}`)
				setAmount(amountFinal.value)
			}
		}
	}
	// const debounceFunction = async () => {
	// 	await getRubleRate()
	// }

	// useEffect(() => {
	// 	// debounce(getRubleRate, 500)
	// 	// getRubleRate().then(selectCountry)
	// 	selectCountry()
	// 	getRubleRate()
	// }, [fromCurrency, toCurrency, amount, amountReceived])

	// setInterval(() => {
	// 	getRubleRate()
	// }, 1000 * 5)

	// setInterval(() => {
	// 	revalidatePath('/')
	// 	console.log('revalidate')
	// }, 10000)3

	return (
		<>
			<Card className='shadow-2xl transform transition-transform duration-900hover:scale-110  ring-1 ring-gray-900/5 rounded-lg leading-none'>
				<CardHeader>
					<CardTitle>AcTransfer</CardTitle>
					<CardDescription>
						<>Transferências Rápidas & Seguras</>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CardDescription className='text-bold'>
						<>Montante a enviar</>
					</CardDescription>
					<Input
						placeholder={'Montante a enviar'}
						value={amount}
						type='number'
						onChange={handleamountChange}
						className='text-x shadow-2xl transform transition-transform duration-900 hover:scale-110  ring-1 ring-gray-900/5 rounded-lg leading-none'
					/>
					<CardDescription className='text-bold'>
						<>Montante a receber</>
					</CardDescription>
					<Input
						placeholder={'Montante a receber'}
						value={amountReceived}
						onChange={handleamountReceivedChange}
						type='number'
						className='font-sans text-x shadow-2xl transform transition-transform duration-900 hover:scale-110  ring-1 ring-gray-900/5 rounded-lg leading-none'
					/>
					<Select
						value={fromCurrency}
						onValueChange={(e) => setFromCurrency(e)}
					>
						<SelectGroup>
							<SelectLabel>Enviar apartir de</SelectLabel>
							<SelectTrigger className='shadow-2xl transform transition-transform duration-900 hover:scale-110  ring-1 ring-gray-900/5 rounded-lg leading-none'>
								<SelectValue
									aria-label={fromCurrency}
									placeholder={fromCurrency}
								>
									{fromCurrency}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='EUR'>Europa</SelectItem>
								<SelectItem value='XOF'>Guine-Bissau</SelectItem>
								<SelectItem value='RUB'>Russia</SelectItem>
							</SelectContent>
						</SelectGroup>
					</Select>
					<Select value={toCurrency} onValueChange={(e) => setToCurrency(e)}>
						<SelectGroup>
							<SelectLabel>Enviar para</SelectLabel>
							<SelectTrigger>
								<SelectValue aria-label={toCurrency} placeholder='Para onde' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={toCurrency}>{toCurrency}</SelectItem>
							</SelectContent>
						</SelectGroup>
					</Select>
				</CardContent>
				<CardFooter>
					<div>Transferências</div>
				</CardFooter>
			</Card>
			<Toaster />
			<Link href='https://wa.me/79199737560'>
				<Button className=' bg-green-600 max-w-7xl mx-auto rgb-button text-white font-bold shadow-lg  shadow-red-600/50 transform transition-transform duration-300 hover:scale-110 relative px-7 py-6  ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6'>
					<svg
						width='80'
						height='80'
						viewBox='0 0 24 24'
						fill='#343C54'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M19.074 4.89389C17.2091 3.02894 14.6689 2 12.0644 2C6.59814 2 2.12869 6.4373 2.12869 11.9035C2.12869 13.672 2.57885 15.3441 3.44702 16.8875L2.03223 22L7.33769 20.6495C8.78464 21.4212 10.4245 21.8714 12.0965 21.8714C17.5306 21.8392 21.9679 17.4019 21.9679 11.9035C21.9679 9.26688 20.939 6.791 19.074 4.89389ZM12.0322 20.1672C10.5853 20.1672 9.07403 19.7492 7.82001 18.9775L7.49846 18.7846L4.37949 19.5884L5.24766 16.5659L5.05473 16.2444C4.25088 14.926 3.80072 13.3826 3.80072 11.8392C3.80072 7.30547 7.46631 3.63987 12.0322 3.63987C14.2187 3.63987 16.2766 4.50804 17.82 6.05145C19.3634 7.59486 20.2316 9.68489 20.2316 11.9035C20.2959 16.5016 16.566 20.1672 12.0322 20.1672ZM16.566 13.9936C16.3088 13.865 15.119 13.254 14.8297 13.2219C14.6046 13.1254 14.4116 13.0932 14.283 13.3505C14.1544 13.6077 13.6399 14.1222 13.5113 14.3151C13.3827 14.4437 13.2541 14.508 12.9647 14.3473C12.7075 14.2187 11.9358 13.9936 10.9711 13.0932C10.2316 12.4502 9.71711 11.6463 9.62065 11.3569C9.49203 11.0997 9.5885 11.0032 9.74927 10.8424C9.87788 10.7138 10.0065 10.5852 10.103 10.3923C10.2316 10.2637 10.2316 10.135 10.3602 9.97428C10.4888 9.84566 10.3924 9.65274 10.328 9.52412C10.2316 9.3955 9.78142 8.17364 9.55634 7.65917C9.36342 7.1447 9.13834 7.24116 9.00972 7.24116C8.8811 7.24116 8.68817 7.24116 8.55956 7.24116C8.43094 7.24116 8.1094 7.27331 7.91647 7.5627C7.69139 7.81994 7.0483 8.43087 7.0483 9.65273C7.0483 10.8746 7.91647 12 8.07724 12.2251C8.20586 12.3537 9.84573 14.8939 12.2895 15.9871C12.8682 16.2444 13.3184 16.4051 13.7043 16.5338C14.283 16.7267 14.8297 16.6624 15.2477 16.6302C15.73 16.5981 16.6946 16.0514 16.9197 15.4405C17.1126 14.8939 17.1126 14.3473 17.0483 14.2508C16.984 14.1865 16.7911 14.09 16.566 13.9936Z'
							fill='#343C54'
						/>
					</svg>
					WhatsApp
				</Button>
			</Link>
		</>
	)
}

export default InterTransfer
