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

function InterTransfer() {
	const [amount, setAmount] = useState<number | string | undefined>('')
	const [amountReceived, setAmountReceived] = useState<
		number | string | undefined
	>('')
	const [fromCurrency, setFromCurrency] = useState<string>('De Onde')
	const [toCurrency, setToCurrency] = useState<string>('Para onde')
	const [dataRuble, setDataRuble] = useState(0)
	const [commission, setCommission] = useState<{
		fromEur: number
		fromRub: number
		fromXof: number
		id: number
	}>()
	useEffect(() => {
		// debounce(getRubleRate, 500)
		// getRubleRate().then(selectCountry)
		selectCountry()
		getRubleRate()
	}, [fromCurrency, toCurrency, amount, amountReceived])
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
			getExchangeRateSender(fromCurrency, parseInputSchema.data, dataRuble)
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

			setAmount(parseInputSchema2.data)
			getExchangeRateReceiver(toCurrency, parseInputSchema2.data, dataRuble)
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
			console.log(parseInputSchema2.error)
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
		const ruble = await fetch('/api/exchange_rate', {
			method: 'GET',
			cache: 'no-store',
			next: { revalidate: 3600 * 20 },
		})
		const commission = await fetch('/api/fetchcommission', {
			method: 'GET',
			cache: 'no-store',

			next: { revalidate: 3600 * 20 },
		})
		const dataCommission: {
			id: number
			fromEur: number
			fromRub: number
			fromXof: number
		} = await commission.json()
		const data: number = await ruble.json()
		setDataRuble(data)
		setCommission(dataCommission)
	}

	function getExchangeRateSender(
		fromCurrency: string,
		amount: number | undefined,
		dataRate: number
	) {
		if (typeof commission !== 'undefined' && typeof amount == 'number') {
			const parseDataRate = parseFloat(dataRate.toFixed(4))
			console.log(amount)
			if (fromCurrency === 'EUR' && toCurrency === 'RUB') {
				const parseamount = parseFloat(amount.toFixed(1))
				const calculateAmountReceived =
					(parseamount * parseDataRate * (100 - commission.fromEur)) / 100
				console.log(dataRate)
				setAmountReceived(parseFloat(calculateAmountReceived.toFixed()))
			} else if (fromCurrency === 'RUB' && toCurrency === 'XOF') {
				const parseamount = parseFloat(amount.toFixed())
				const calculateAmountReceived =
					((parseamount * 655) / parseDataRate) *
					((100 - commission.fromRub) / 100)
				setAmountReceived(parseFloat(calculateAmountReceived.toFixed()))
			} else if (fromCurrency === 'XOF' && toCurrency === 'RUB') {
				const parseamount = parseFloat(amount.toFixed())
				const calculateAmountReceived =
					(parseamount / 655) *
					parseDataRate *
					((100 - commission.fromXof) / 100)
				setAmountReceived(parseFloat(calculateAmountReceived.toFixed()))
			}
		}
	}

	function getExchangeRateReceiver(
		toCurrency: string,
		amountReceived: number | undefined,
		dataRate: number
	) {
		console.log(dataRate)
		if (
			typeof commission !== 'undefined' &&
			typeof amountReceived == 'number'
		) {
			const parseDataRate = parseFloat(dataRate.toFixed(2))
			if (toCurrency === 'RUB' && fromCurrency === 'XOF') {
				const parseamountReceived = parseFloat(amountReceived?.toFixed())
				const calculateAmount =
					(parseamountReceived / parseDataRate) *
					655 *
					((100 + commission.fromXof) / 100)
				setAmount(parseFloat(calculateAmount.toFixed()))
			} else if (toCurrency === 'XOF' && fromCurrency === 'RUB') {
				const parseamountReceived = parseFloat(amountReceived?.toFixed())
				const calculateAmount =
					(parseamountReceived / 655) *
					parseDataRate *
					((100 + commission.fromRub) / 100)
				setAmount(parseFloat(calculateAmount.toFixed()))
			} else if (toCurrency === 'RUB' && fromCurrency === 'EUR') {
				const parseamountReceived = parseFloat(amountReceived?.toFixed())
				const calculateAmount =
					(parseamountReceived / parseDataRate) *
					((100 + commission.fromEur) / 100)
				setAmount(parseFloat(calculateAmount.toFixed(1)))
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
						className='shadow-2xl transform transition-transform duration-900 hover:scale-110  ring-1 ring-gray-900/5 rounded-lg leading-none'
					/>
					<CardDescription className='text-bold'>
						<>Montante a receber</>
					</CardDescription>
					<Input
						placeholder={'Montante a receber'}
						value={amountReceived}
						onChange={handleamountReceivedChange}
						type='number'
						className='shadow-2xl transform transition-transform duration-900 hover:scale-110  ring-1 ring-gray-900/5 rounded-lg leading-none'
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
					WhatsApp
				</Button>
			</Link>
		</>
	)
}

export default InterTransfer
