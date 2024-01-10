import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

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

export default function EditUserProfile() {
	return (
		<div className="flex h-full">
			<main className="relative mx-auto flex h-full max-w-screen-2xl flex-col p-2 md:px-8 md:py-4">
				<Outlet />
			</main>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
