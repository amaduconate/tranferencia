import React from 'react'
import InterTransfer from './ui/intertransfer'
import Exemple from './ui/exemple'

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-r from-green-100 to-blue-100'>
			<InterTransfer />
			<Exemple/>
		</main>
	)
}
