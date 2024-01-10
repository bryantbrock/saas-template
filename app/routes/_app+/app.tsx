import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import { NavLink, Outlet } from '@remix-run/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn } from '#app/utils/misc'

export const BreadcrumbHandle = z.object({ breadcrumb: z.any() })
export type BreadcrumbHandle = z.infer<typeof BreadcrumbHandle>

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: data ? 'saas-template | App' : 'Error | saas-template | App' },
		{ name: 'description', content: `saas-template user app` },
	]
}

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { email: true },
	})

	invariantResponse(user, 'User not found', { status: 404 })
	return json({})
}

const navLinks = [{ to: '/app', label: 'Home' }]

export default function EditUserProfile() {
	return (
		<div className="flex h-full border-t dark:border-t-[--gray-4]">
			<nav className="flex h-full min-w-[220px] flex-col gap-1 border-r p-2 md:p-4 dark:border-r-[--gray-4]">
				{navLinks.map(navLink => (
					<NavLink
						key={navLink.to}
						className={({ isActive }) =>
							cn(
								'cursor-pointer rounded-full px-4 py-1.5 transition hover:bg-[--indigo-6]',
								{ 'bg-[--indigo-6]': isActive },
							)
						}
						to={navLink.to}
					>
						{navLink.label}
					</NavLink>
				))}
			</nav>
			<main className="relative mx-auto flex h-full max-w-screen-2xl flex-col p-2 md:px-8 md:py-4">
				<Outlet />
			</main>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
