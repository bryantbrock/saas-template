import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { invariant } from '@epic-web/invariant'
import { Heading, Text } from '@radix-ui/themes'
import {
	json,
	redirect,
	type DataFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import {
	Form,
	useActionData,
	useLoaderData,
	useSearchParams,
} from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { safeRedirect } from 'remix-utils/safe-redirect'
import { z } from 'zod'
import { CheckboxField, ErrorList, Field } from '#app/components/forms.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { StatusButton } from '#app/components/status-button.tsx'
import { requireAnonymous, sessionKey, signup } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { authSessionStorage } from '#app/utils/session.server.ts'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import {
	NameSchema,
	PasswordAndConfirmPasswordSchema,
} from '#app/utils/user-validation.ts'
import { verifySessionStorage } from '#app/utils/verification.server.ts'
import { type VerifyFunctionArgs } from './verify.tsx'

const onboardingEmailSessionKey = 'onboardingEmail'

const SignupFormSchema = z
	.object({
		name: NameSchema,
		remember: z.boolean().optional(),
		redirectTo: z.string().optional(),
	})
	.and(PasswordAndConfirmPasswordSchema)

async function requireOnboardingEmail(request: Request) {
	await requireAnonymous(request)
	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const email = verifySession.get(onboardingEmailSessionKey)
	if (typeof email !== 'string' || !email) {
		throw redirect('/signup')
	}
	return email
}
export async function loader({ request }: DataFunctionArgs) {
	const email = await requireOnboardingEmail(request)
	return json({ email })
}

export async function action({ request }: DataFunctionArgs) {
	const email = await requireOnboardingEmail(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)
	checkHoneypot(formData)
	const submission = await parse(formData, {
		schema: intent =>
			SignupFormSchema.transform(async data => {
				if (intent !== 'submit') return { ...data, session: null }

				const session = await signup({ ...data, email })
				return { ...data, session }
			}),
		async: true,
	})

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value?.session) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { session, remember, redirectTo } = submission.value

	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	authSession.set(sessionKey, session.id)
	const verifySession = await verifySessionStorage.getSession()
	const headers = new Headers()
	headers.append(
		'set-cookie',
		await authSessionStorage.commitSession(authSession, {
			expires: remember ? session.expirationDate : undefined,
		}),
	)
	headers.append(
		'set-cookie',
		await verifySessionStorage.destroySession(verifySession),
	)

	return redirectWithToast(
		safeRedirect(redirectTo),
		{ title: 'Welcome', description: 'Thanks for signing up!' },
		{ headers },
	)
}

export async function handleVerification({ submission }: VerifyFunctionArgs) {
	invariant(submission.value, 'submission.value should be defined by now')
	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(onboardingEmailSessionKey, submission.value.target)
	return redirect('/onboarding', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}

export const meta: MetaFunction = () => {
	return [{ title: 'Setup saas-template Account' }]
}

export default function SignupRoute() {
	const data = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'onboarding-form',
		constraint: getFieldsetConstraint(SignupFormSchema),
		defaultValue: { redirectTo },
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: SignupFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="mx-auto w-full max-w-md pt-20">
			<div className="flex flex-col gap-3 text-center">
				<Heading size="8">Welcome, {data.email}!</Heading>
				<Text>Please enter your details.</Text>
			</div>
			<Spacer size="xs" />
			<Form
				method="POST"
				className="mx-auto min-w-full max-w-sm sm:min-w-[368px]"
				{...form.props}
			>
				<AuthenticityTokenInput />
				<HoneypotInputs />
				<Field
					labelProps={{ htmlFor: fields.name.id, children: 'Name' }}
					inputProps={{
						...conform.input(fields.name),
						autoComplete: 'name',
					}}
					errors={fields.name.errors}
				/>
				<Field
					labelProps={{ htmlFor: fields.password.id, children: 'Password' }}
					inputProps={{
						...conform.input(fields.password, { type: 'password' }),
						autoComplete: 'new-password',
					}}
					errors={fields.password.errors}
				/>

				<Field
					labelProps={{
						htmlFor: fields.confirmPassword.id,
						children: 'Confirm Password',
					}}
					inputProps={{
						...conform.input(fields.confirmPassword, { type: 'password' }),
						autoComplete: 'new-password',
					}}
					errors={fields.confirmPassword.errors}
				/>

				<CheckboxField
					labelProps={{
						htmlFor: fields.remember.id,
						children: 'Remember me',
					}}
					buttonProps={conform.input(fields.remember, { type: 'checkbox' })}
					errors={fields.remember.errors}
				/>

				<input {...conform.input(fields.redirectTo, { type: 'hidden' })} />
				<ErrorList errors={form.errors} id={form.errorId} />

				<div className="flex items-center justify-between gap-6">
					<StatusButton
						className="w-full"
						status={isPending ? 'pending' : actionData?.status ?? 'idle'}
						type="submit"
						disabled={isPending}
					>
						Create an account
					</StatusButton>
				</div>
			</Form>
		</div>
	)
}
