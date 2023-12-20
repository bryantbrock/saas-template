import { Form } from '@remix-run/react'
import { z } from 'zod'
import { StatusButton } from '#app/components/status-button.tsx'
import { useIsPending } from './misc.tsx'

// to add another provider, set their name here and add it to the providerNames below

export const providerNames = [] as const
export const ProviderNameSchema = z.enum(providerNames as any)
export type ProviderName = z.infer<typeof ProviderNameSchema>

export const providerLabels: Record<ProviderName, string> = {} as const

export const providerIcons: Record<ProviderName, React.ReactNode> = {} as const

export function ProviderConnectionForm({
	redirectTo,
	type,
	providerName,
}: {
	redirectTo?: string | null
	type: 'Connect' | 'Login' | 'Signup'
	providerName: ProviderName
}) {
	const label = providerLabels[providerName]
	const formAction = `/auth/${providerName}`
	const isPending = useIsPending({ formAction })
	return (
		<Form
			className="flex items-center justify-center gap-2"
			action={formAction}
			method="POST"
		>
			{redirectTo ? (
				<input type="hidden" name="redirectTo" value={redirectTo} />
			) : null}
			<StatusButton
				type="submit"
				className="w-full"
				status={isPending ? 'pending' : 'idle'}
			>
				<span className="inline-flex items-center gap-1.5">
					{providerIcons[providerName]}
					<span>
						{type} with {label}
					</span>
				</span>
			</StatusButton>
		</Form>
	)
}
