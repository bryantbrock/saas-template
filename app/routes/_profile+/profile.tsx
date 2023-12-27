import { invariantResponse } from '@epic-web/invariant'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type DataFunctionArgs, type MetaFunction } from '@remix-run/node'
import { Link, Outlet, useMatches } from '@remix-run/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { Icon } from '#app/components/icon'
import { Spacer } from '#app/components/spacer.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn } from '#app/utils/misc.tsx'

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

const BreadcrumbHandleMatch = z.object({
	handle: BreadcrumbHandle,
})

export default function EditUserProfile() {
	const matches = useMatches()
	const breadcrumbs = matches
		.map(m => {
			const result = BreadcrumbHandleMatch.safeParse(m)
			if (!result.success || !result.data.handle.breadcrumb) return null
			return (
				<Link key={m.id} to={m.pathname} className="flex items-center">
					{result.data.handle.breadcrumb}
				</Link>
			)
		})
		.filter(Boolean)

	return (
		<div className="m-auto mb-24 mt-16 max-w-3xl">
			<div className="container">
				<ul className="flex gap-3">
					<li>
						<Link className="text-muted-foreground" to="/profile">
							Profile
						</Link>
					</li>
					{breadcrumbs.map((breadcrumb, i, arr) => (
						<li
							key={i}
							className={cn('flex items-center gap-3', {
								'text-muted-foreground': i < arr.length - 1,
							})}
						>
							<Icon name="chevron-right" /> {breadcrumb}
						</li>
					))}
				</ul>
			</div>
			<Spacer size="2xs" />
			<main className="bg-muted mx-auto px-6 py-8 md:container md:rounded-3xl">
				<Outlet />
			</main>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
