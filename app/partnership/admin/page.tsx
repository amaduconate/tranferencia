'use client'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import React, { useEffect } from 'react'
import * as z from 'zod'
import {
	RegisterLink,
	LoginLink,
	LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useState } from 'react'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'


const formSchema = z.object({
	fromEur: z.coerce.number(),
	fromRub: z.coerce.number(),
	fromXof: z.coerce.number(),
})

function Page() {

	const [isLoading, setIsLoading] = useState(true)
	const [commissionPartnership, setCommissionPartnership] = useState<{
		fromEurPartnership: number
		fromRubPartnership: number
		fromXofPartnership: number
		id: number
	}>()

	useEffect(() => {
		getPartnershipCommission()
	}, [])

	const getPartnershipCommission = async () => {
		try {
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

			setCommissionPartnership(dataCommissionPartnership);
		} catch (error) {
			console.error("error fetching commission", error);
		}finally {
			setIsLoading(false)
		}
	}

	const { getPermissions, user, getClaim } = useKindeBrowserClient()

	const permissions = getPermissions() as { permissions?: string[] }

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fromEur: 0,
			fromRub: 0,
			fromXof: 0,
		},
	})

	console.log(getClaim('roles'))

	if (!permissions.permissions?.includes('admin:permission')) {
		return (
			<>
				<div>You do not have permission to access this page</div>
				<LogoutLink>Log out</LogoutLink>
				<div>{user?.email}</div>
			</>
		)
	}
	// this is the api call to update the commission
	// if (!isAuthenticated) {
	// 	return <LoginLink>Sign in</LoginLink>
	// }
	const handleSubmitCommission = async (data: z.infer<typeof formSchema>) => {
		const parsedata = formSchema.safeParse(data)
		await fetch('/api/updatecommissionPartnership', {
			cache: 'no-cache',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(parsedata.data),
		})
		console.log(parsedata)
    await getPartnershipCommission() 
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmitCommission)}
					className='space-y-6'
				>
					<FormField
						control={form.control}
						name='fromEur'
						render={({ field, formState }) => {
							return (
								<FormItem>
									<FormLabel>De Europa</FormLabel>
									<FormControl>
										<Input placeholder='fromEur ' type='number' {...field} />
									</FormControl>
									<FormMessage>{formState.errors.fromEur?.message}</FormMessage>
								</FormItem>
							)
						}}
					/>
					<FormField
						control={form.control}
						name='fromRub'
						render={({ field, formState }) => {
							return (
								<FormItem>
									<FormLabel>De Russia</FormLabel>
									<FormControl>
										<Input placeholder='fromRub ' type='number' {...field} />
									</FormControl>
									<FormMessage>{formState.errors.fromRub?.message}</FormMessage>
								</FormItem>
							)
						}}
					/>
					<FormField
						control={form.control}
						name='fromXof'
						render={({ field, formState }) => {
							return (
								<FormItem>
									<FormLabel>De Guine-bissau</FormLabel>
									<FormControl>
										<Input placeholder='fromXof ' type='number' {...field} />
									</FormControl>
									<FormMessage>{formState.errors.fromXof?.message}</FormMessage>
								</FormItem>
							)
						}}
					/>
					<Button type='submit'>Postar comissão</Button>
				</form>
			</Form>

			<LoginLink>Sign in</LoginLink>

			<RegisterLink>Sign up</RegisterLink>
			<LogoutLink>Log out</LogoutLink>
			<div>{user?.email}</div>
			{isLoading ? (
				<div>Loading commission data...</div>
			) : (
				<Table>
					<TableCaption>comissão do parceiro</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>De europa</TableHead>
							<TableHead>De Russia</TableHead>
							<TableHead>De Guine-bissau</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className='font-medium'>
								{commissionPartnership?.fromEurPartnership}
							</TableCell>
							<TableCell className='font-medium'>
								{commissionPartnership?.fromRubPartnership}
							</TableCell>
							<TableCell className='font-medium'>
								{commissionPartnership?.fromXofPartnership}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</>
	)
}

export default Page
