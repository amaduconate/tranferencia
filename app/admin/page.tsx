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

import React from 'react'
import * as z from 'zod'
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'



const formSchema = z.object({
	fromEur: z.coerce.number(),
	fromRub: z.coerce.number(),
	fromXof: z.coerce.number(),
})

function Page() {
	const {  getPermissions, user, getClaim } = useKindeBrowserClient()
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fromEur: 0,
			fromRub: 0,
			fromXof: 0,
		},
	})

	console.log(getClaim('roles'))

	if (!getPermissions().permissions?.includes('admin:permission')) {
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
		</>
	)
}

export default Page
