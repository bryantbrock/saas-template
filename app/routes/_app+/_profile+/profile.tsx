import { invariantResponse } from '@epic-web/invariant'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'
import { Link, Outlet, useMatch } from '@remix-run/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { Button, ChevronLeftIcon } from '#app/components/radix'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export const BreadcrumbHandle = z.object({ breadcrumb: z.any() })
export type BreadcrumbHandle = z.infer<typeof BreadcrumbHandle>

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: data
				? 'saas-template | Profile'
				: 'Error | saas-template | Profile',
		},
		{ name: 'description', content: `saas-template user profile` },
	]
}

export const handle: BreadcrumbHandle & SEOHandle = {
	getSitemapEntries: () => null,
}

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { email: true },
	})
	invariantResponse(user, 'User not found', { status: 404 })
	return json({})
}

export default function EditUserProfile() {
	const isRootProfile = useMatch('/profile')

	return (
		<main className="m-auto mb-24 mt-16 max-w-3xl">
			<div className="min-h-10 min-w-full">
				{isRootProfile ? null : (
					<Button asChild variant="ghost">
						<Link to=".">
							<ChevronLeftIcon /> Back
						</Link>
					</Button>
				)}
			</div>
			<Outlet />
		</main>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
