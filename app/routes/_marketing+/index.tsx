import { type MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Button, Heading, Text, Link as RadixLink } from '#app/components/radix'
import { Spacer } from '#app/components/spacer'

export const meta: MetaFunction = () => [{ title: 'saas-template' }]

export default function Index() {
	return (
		<main className="relative mx-auto flex h-full max-w-screen-2xl flex-col p-2 md:px-8 md:py-4">
			<section className="mx-auto">
				<Heading size="9" trim="both" className="text-center">
					Build a MVP SaaS product <br></br>
					for{' '}
					<mark className="bg-[--yellow-4] text-current dark:bg-[--ruby-8]">
						under $10k
					</mark>
				</Heading>
			</section>
			<Spacer size="2xs" />
			<section className="mx-auto">
				<div className="flex items-center gap-4">
					<Button size="4" radius="full" asChild>
						<Link to="/signup">Let's build</Link>
					</Button>
					<Text className="w-48" as="p" size="2">
						Have questions?
						<br />
						<RadixLink weight="bold" asChild>
							<Link to="/products">Contact us</Link>
						</RadixLink>{' '}
						for more info.
					</Text>
				</div>
			</section>
			<Spacer size="2xs" />
			<section className="flex max-h-[500px] flex-grow flex-col gap-4 lg:flex-row">
				<div className="flex h-full w-full flex-col justify-between rounded-2xl bg-[--ruby-3] p-8 dark:bg-[--yellow-6]">
					<Heading
						className="pb-14 text-[--ruby-12] dark:text-[--yellow-12]"
						size="7"
					>
						How does it work?
					</Heading>
					<ol>
						<li className="mt-2">
							<Text size="5">
								1.{' '}
								<RadixLink asChild>
									<Link to="/login">Sign in</Link>
								</RadixLink>
							</Text>
						</li>
						<li className="mt-2">
							<Text size="5">2. Create a project</Text>
						</li>
						<li className="mt-2">
							<Text size="5">3. Fill in the questionnaire</Text>
						</li>
						<li className="mt-2">
							<Text size="5">4. Receive a contract</Text>
						</li>
						<li className="mt-2">
							<Text size="5">5. We build and deliver in 1 month</Text>
						</li>
					</ol>
				</div>
				<div className="flex h-full w-full flex-col justify-between rounded-2xl bg-[--sky-3] p-8">
					<Heading className="pb-14 text-[--sky-12]" size="7">
						What do I get?
					</Heading>
					<div>
						<Text size="5">
							<strong>A production-ready, web application</strong>. Collect
							payments, build an AI agent, or manage your inventory - whatever
							you need, we have the infrastructure to build it.
						</Text>
						<Spacer size="3xs" />
						<Text as="p" size="5">
							Stack:{' '}
							<RadixLink target="_blank" href="https://remix.run">
								Remix (React)
							</RadixLink>
							,{' '}
							<RadixLink target="_blank" href="https://tailwindcss.com/">
								Tailwind CSS
							</RadixLink>
							,{' '}
							<RadixLink target="_blank" href="https://fly.io">
								Fly.io
							</RadixLink>
							,{' '}
							<RadixLink
								target="_blank"
								href="https://www.sqlite.org/index.html"
							>
								SQLite
							</RadixLink>
							,{' '}
							<RadixLink target="_blank" href="https://prisma.io">
								Prisma
							</RadixLink>
							,{' '}
							<RadixLink target="_blank" href="https://www.radix-ui.com/">
								Radix UI
							</RadixLink>
							,{' '}
							<RadixLink target="_blank" href="https://sentry.io/welcome/">
								Sentry
							</RadixLink>
							, and{' '}
							<RadixLink target="_blank" href="https://stripe.com/">
								Stripe
							</RadixLink>
							.
						</Text>
					</div>
				</div>
				<div className="flex h-full w-full flex-col justify-between rounded-2xl bg-[--green-3] p-8">
					<Heading className="pb-14 text-[--green-12]" size="7">
						How much does it cost?
					</Heading>
					<Text size="5">
						The MVP package costs <strong>$9,900</strong> (see{' '}
						<RadixLink asChild>
							<Link to="/pricing">pricing</Link>
						</RadixLink>
						). For additional work,{' '}
						<RadixLink asChild>
							<Link to="/contact">contact us</Link>
						</RadixLink>{' '}
						to learn more.
					</Text>
				</div>
			</section>
		</main>
	)
}
