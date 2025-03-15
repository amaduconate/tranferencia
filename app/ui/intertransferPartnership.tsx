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
	const [commissionPartnership, setCommissionPartnership] = useState<{
		fromEurPartnership: number
		fromRubPartnership: number
		fromXofPartnership: number
		id: number
	}>()
	useEffect(() => {
		selectCountry()
		getRubleRate()
		getPartnershipCommission()
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
		if (e.target.value === '') {
			setAmountReceived('')
			setAmount(undefined)
		}
	}

	const handleamountReceivedChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
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
	const getPartnershipCommission = async () => {
		const commissionPartnership = await fetch('/api/fetchPartnership', {
			method: 'GET',
			cache: 'no-store',
		})
		const dataCommissionPartnership: {
			id: number
			fromEurPartnership: number
			fromRubPartnership: number
			fromXofPartnership: number
		} = await commissionPartnership.json()

		setCommissionPartnership(dataCommissionPartnership)
	}
	const getRubleRate = async () => {
		const exchange_rate = await fetch('/api/exchange_rate', {
			method: 'GET',
			cache: 'no-store',
		})
		const commission = await fetch('/api/fetchcommission', {
			method: 'GET',
			cache: 'no-store',
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
			typeof dataRate !== 'undefined' && typeof commissionPartnership !== 'undefined'
		) {
			console.log(amount)
			if (fromCurrency === 'EUR' && toCurrency === 'RUB') {
				const rateWithCommission = currency(
					currency(dataRate.fromEur, { precision: 9 })
						.divide(100)
						.multiply(100 - commission.fromEur - commissionPartnership.fromEurPartnership + 2),
					{ precision: 8 }
				).value
				const amountReceivedFinal = currency(amount, { precision: 0 }).multiply(
					rateWithCommission
				)
				setAmountReceived(amountReceivedFinal.value)
			} else if (fromCurrency === 'RUB' && toCurrency === 'XOF') {
				const rateWithCommission = currency(
					currency(dataRate.fromRub, { precision: 6 })
						.divide(100)
						.multiply(100 - commission.fromRub - commissionPartnership.fromRubPartnership + 2),
					{ precision: 5 }
				).value
				console.log(`this is xof ${rateWithCommission}`)
				const amountReceivedFinal = currency(amount, { precision: 0 }).multiply(
					rateWithCommission
				)

				setAmountReceived(amountReceivedFinal.value)
			} else if (fromCurrency === 'XOF' && toCurrency === 'RUB') {
				const rateWithCommission = currency(
					currency(dataRate.fromXof, { precision: 9 })
						.divide(100)
						.multiply(100 - commission.fromXof - commissionPartnership.fromXofPartnership + 2),
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
			typeof dataRate !== 'undefined' && typeof commissionPartnership !== 'undefined'
		) {
			if (toCurrency === 'RUB' && fromCurrency === 'XOF') {
				const rateWithCommission = currency(
					currency(dataRate.fromXof, { precision: 12 })
						.divide(100)
						.multiply(100 - commission.fromXof - commissionPartnership.fromXofPartnership + 2),
					{ precision: 10 }
				).value
				const amountFinal = currency(amountReceived, { precision: 1 }).divide(
					rateWithCommission
				)

				setAmount(amountFinal.value)
			} else if (toCurrency === 'XOF' && fromCurrency === 'RUB') {
				const rateWithCommission = currency(
					currency(dataRate.fromRub, { precision: 8 })
						.divide(100)
						.multiply(100 - commission.fromRub - commissionPartnership.fromRubPartnership + 2),
					{ precision: 6 }
				).value
				const amountFinal = currency(amountReceived, { precision: 0 }).divide(
					rateWithCommission
				)
				setAmount(amountFinal.value)
			} else if (toCurrency === 'RUB' && fromCurrency === 'EUR') {
				const rateWithCommission = currency(
					currency(dataRate.fromEur, { precision: 9 })
						.divide(100)
						.multiply(100 - commission.fromEur - commissionPartnership.fromEurPartnership + 2),
					{ precision: 8 }
				).value
				const amountFinal = currency(amountReceived, {
					precision: 1,
					symbol: '€',
				}).divide(rateWithCommission)
				console.log(`this is ${amountFinal.format()}`)
				setAmount(amountFinal.value)
			}
		}
	}

	
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
						onValueChange={(e) => {
							setAmountReceived('')
							setAmount('')
							setFromCurrency(e)
						}}
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
		</>
	)
}

export default InterTransfer
