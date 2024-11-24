import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './AuthProvider'


// const geistSans = localFont({
// 	src: './fonts/GeistVF.woff',
// 	variable: '--font-geist-sans',
// 	weight: '100 900',
// })
// const geistMono = localFont({
// 	src: './fonts/GeistMonoVF.woff',
// 	variable: '--font-geist-mono',
// 	weight: '100 900',
// })

export const metadata: Metadata = {
	title: 'Currency',
	description: 'Transfer money with ease',
	icons: {
		icon: '/imag/money.svg',
		shortcut: '/imag/money.svg',
		apple: '/imag/money.svg',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<AuthProvider>
			<html lang='en'>
				<body
				className='antialiased'
				>
					{children}
				</body>
			</html>
		</AuthProvider>
	)
}
