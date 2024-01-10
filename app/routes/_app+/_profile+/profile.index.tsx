import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { IconButton, Button } from '@radix-ui/themes'
import { json, type DataFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { Field } from '#app/components/forms.tsx'
import { Icon } from '#app/components/icon.tsx'
import { EnvelopeClosedIcon } from '#app/components/radix'
import { StatusButton } from '#app/components/status-button.tsx'
import { requireUserId, sessionKey } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { getUserImgSrc, useDoubleCheck } from '#app/utils/misc.tsx'
import { authSessionStorage } from '#app/utils/session.server.ts'
import { NameSchema } from '#app/utils/user-validation.ts'
import { twoFAVerificationType } from './profile.two-factor.js'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

const ProfileFormSchema = z.object({
	name: NameSchema.optional(),
})

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			image: {
				select: { id: true },
			},
			_count: {
				select: {
					sessions: {
						where: {
							expirationDate: { gt: new Date() },
						},
					},
				},
			},
		},
	})

	const twoFactorVerification = await prisma.verification.findUnique({
		select: { id: true },
		where: { target_type: { type: twoFAVerificationType, target: userId } },
	})

	const password = await prisma.password.findUnique({
		select: { userId: true },
		where: { userId },
	})

	return json({
		user,
		hasPassword: Boolean(password),
		isTwoFactorEnabled: Boolean(twoFactorVerification),
	})
}

type ProfileActionArgs = {
	request: Request
	userId: string
	formData: FormData
}
const profileUpdateActionIntent = 'update-profile'
const signOutOfSessionsActionIntent = 'sign-out-of-sessions'

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)
	const intent = formData.get('intent')

	switch (intent) {
		case profileUpdateActionIntent: {
			return profileUpdateAction({ request, userId, formData })
		}
		case signOutOfSessionsActionIntent: {
			return signOutOfSessionsAction({ request, userId, formData })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export default function EditUserProfile() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="flex flex-col gap-6">
			<div className="flex gap-4">
				<div className="relative h-52 w-52">
					<img
						src={getUserImgSrc(data.user.image?.id)}
						alt={data.user.name ?? data.user.email}
						className="h-48 w-48 rounded-full object-cover"
					/>
					<IconButton asChild className="absolute bottom-6 right-6">
						<Link
							preventScrollReset
							to="photo"
							title="Change profile photo"
							aria-label="Change profile photo"
						>
							<Icon name="camera" className="h-4 w-4" />
						</Link>
					</IconButton>
				</div>
				<div className="flex flex-grow flex-col gap-2">
					<UpdateProfile />
					<div className="flex gap-2">
						<Button asChild variant="soft" className="flex-grow">
							<Link to="change-email">
								<EnvelopeClosedIcon /> Change email
							</Link>
						</Button>
						<Button asChild variant="soft" className="flex-grow">
							<Link to="two-factor">
								{data.isTwoFactorEnabled ? (
									<Icon name="lock-closed">2FA is enabled</Icon>
								) : (
									<Icon name="lock-open-1">Enable 2FA</Icon>
								)}
							</Link>
						</Button>
						<Button asChild variant="soft" className="flex-grow">
							<Link to={data.hasPassword ? 'password' : 'password/create'}>
								<Icon name="dots-horizontal">
									{data.hasPassword ? 'Change Password' : 'Create a Password'}
								</Icon>
							</Link>
						</Button>
					</div>
					<div className="flex gap-2">
						<SignOutOfSessions />
					</div>
				</div>
			</div>
		</div>
	)
}

async function profileUpdateAction({ userId, formData }: ProfileActionArgs) {
	const submission = await parse(formData, {
		async: true,
		schema: ProfileFormSchema,
	})

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const data = submission.value

	await prisma.user.update({
		where: { id: userId },
		data: { name: data.name },
	})

	return json({ status: 'success', submission } as const)
}

function UpdateProfile() {
	const data = useLoaderData<typeof loader>()

	const fetcher = useFetcher<typeof profileUpdateAction>()

	const [form, fields] = useForm({
		id: 'edit-profile',
		constraint: getFieldsetConstraint(ProfileFormSchema),
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ProfileFormSchema })
		},
		defaultValue: { name: data.user.name ?? '' },
	})

	return (
		<fetcher.Form
			method="POST"
			{...form.props}
			className="flex items-center gap-2"
		>
			<AuthenticityTokenInput />
			<Field
				labelProps={{ htmlFor: fields.name.id, children: 'Name' }}
				inputProps={conform.input(fields.name)}
				errors={fields.name.errors}
				className="flex-grow"
			/>
			<div className="mt-1">
				<Button type="submit" name="intent" value={profileUpdateActionIntent}>
					Save changes
				</Button>
			</div>
		</fetcher.Form>
	)
}

async function signOutOfSessionsAction({ request, userId }: ProfileActionArgs) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	invariantResponse(
		sessionId,
		'You must be authenticated to sign out of other sessions',
	)
	await prisma.session.deleteMany({
		where: {
			userId,
			id: { not: sessionId },
		},
	})
	return json({ status: 'success' } as const)
}

function SignOutOfSessions() {
	const data = useLoaderData<typeof loader>()
	const dc = useDoubleCheck()

	const fetcher = useFetcher<typeof signOutOfSessionsAction>()
	const otherSessionsCount = data.user._count.sessions - 1
	return (
		<div className="flex items-center gap-2">
			{otherSessionsCount ? (
				<fetcher.Form method="POST">
					<AuthenticityTokenInput />
					<StatusButton
						variant="soft"
						className="flex-grow"
						{...dc.getButtonProps({
							type: 'submit',
							name: 'intent',
							value: signOutOfSessionsActionIntent,
						})}
						status={
							fetcher.state !== 'idle'
								? 'pending'
								: fetcher.data?.status ?? 'idle'
						}
					>
						<Icon name="avatar">
							{dc.doubleCheck
								? `Are you sure?`
								: `Sign out of ${otherSessionsCount} other sessions`}
						</Icon>
					</StatusButton>
				</fetcher.Form>
			) : (
				<Icon name="avatar">This is your only session</Icon>
			)}
		</div>
	)
}
