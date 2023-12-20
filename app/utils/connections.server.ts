import { createCookieSessionStorage } from '@remix-run/node'
import { type ProviderName } from './connections.tsx'
import { type AuthProvider } from './providers/provider.ts'
import { type Timings } from './timing.server.ts'

export const connectionSessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'en_connection',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		secrets: process.env.SESSION_SECRET.split(','),
		secure: process.env.NODE_ENV === 'production',
	},
})

export const providers: Record<ProviderName, AuthProvider> = {}

export function handleMockAction(providerName: ProviderName, request: Request) {
	return providers[providerName].handleMockAction(request)
}

export function resolveConnectionData(
	providerName: ProviderName,
	providerId: string,
	options?: { timings?: Timings },
) {
	return providers[providerName].resolveConnectionData(providerId, options)
}
