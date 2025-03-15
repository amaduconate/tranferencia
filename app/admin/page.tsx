'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import {
	RegisterLink,
	LoginLink,
	LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
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
	const [commission, setCommission] = useState<{
		fromEur: number
		fromRub: number
		fromXof: number
		id: number
	}>()
	useEffect(() => {
		getCommission()
	}, [])
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



	const getCommission = async () => {
		try {
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

			setCommission(dataCommission)
		} catch (error) {
			console.error('error fetching commission', error)
		} finally {
			setIsLoading(false)
		}
	}

	console.log(getClaim('roles'))

	if (
		!permissions.permissions?.includes('admin:permission') ||
		!permissions.permissions?.includes('adminown:allowed')
	) {
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
		await fetch('/api/updatecommission', {
			cache: 'no-cache',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(parsedata.data),
		})
		console.log(parsedata)
		await getCommission()
	}
	const handleSubmitRate = async () => {
		await fetch('/api/updaterate', {
			cache: 'no-cache',
			method: 'GET',
		})
		console.log('Rate updated')
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
									<FormLabel>fromEur</FormLabel>
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
									<FormLabel>fromRub</FormLabel>
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
									<FormLabel>fromXof</FormLabel>
									<FormControl>
										<Input placeholder='fromXof ' type='number' {...field} />
									</FormControl>
									<FormMessage>{formState.errors.fromXof?.message}</FormMessage>
								</FormItem>
							)
						}}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>

			<Card>
				<CardHeader>
					<CardTitle>update Commission</CardTitle>
				</CardHeader>

				<CardContent>
					<Button name='fromEur' type='submit' onClick={handleSubmitRate} />
				</CardContent>
			</Card>
			<LoginLink>Sign in</LoginLink>

			<RegisterLink>Sign up</RegisterLink>
			<LogoutLink>Log out</LogoutLink>
			<div>{user?.email}</div>
			{isLoading ? (
				<div>Loading commission data...</div>
			) : (
				<Table>
					<TableCaption>comissão</TableCaption>
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
								{commission?.fromEur}
							</TableCell>
							<TableCell className='font-medium'>
								{commission?.fromRub}
							</TableCell>
							<TableCell className='font-medium'>
								{commission?.fromXof}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</>
	)
}

export default Page
