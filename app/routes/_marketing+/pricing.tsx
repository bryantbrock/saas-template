import {
	Heading,
	Text,
	Link as RadixLink,
	InfoCircledIcon,
	Tooltip,
} from '#app/components/radix'
import { Spacer } from '#app/components/spacer'

export default function PrivacyRoute() {
	return (
		<main className="relative mx-auto flex h-full max-w-screen-2xl flex-col p-2 md:px-8 md:py-4">
			<section className="flex flex-grow flex-col gap-4 lg:max-h-[700px] lg:flex-row">
				<div className="flex h-full w-full flex-col justify-between rounded-2xl bg-[--indigo-5] p-8">
					<div>
						<div className="mb-8 flex justify-between">
							<Heading className="text-[--indigo-12]" size="8">
								MVP
							</Heading>
							<div className="flex items-center gap-2">
								<Heading as="h3" size="7" className="">
									$9,900
								</Heading>
								<Text
									as="span"
									className="rounded-full bg-[--yellow-3] px-2 dark:bg-[--yellow-8]"
								>
									one time
								</Text>
							</div>
						</div>
						<Text size="5">
							Don't re-invent the wheel. Building a SaaS MVP product has been
							done many times before. It's time to stand on the shoulders of
							those giants. Based on our Core, build a custom app in 1 month for
							less than $10k.
						</Text>
					</div>
					<Spacer size="3xs" />
					<div>
						<Heading as="h5" size="5" className="pb-2">
							Tech stack
						</Heading>
						<Text as="p" size="5">
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
					<Spacer size="3xs" />
					<div>
						<Heading as="h5" size="5" className="pb-2">
							What's included
						</Heading>
						<div className="flex justify-between">
							<ul>
								<li className="mt-2">
									<div className="flex items-center gap-3">
										<span>{'>'}</span>
										<div className="flex items-center gap-1">
											<Text size="5">The Core</Text>
											<Tooltip
												content={
													<Text size="2">
														Our core software contains all of the <br />
														main features needed for a modern SaaS <br />{' '}
														product and a production-ready setup.
													</Text>
												}
											>
												<InfoCircledIcon />
											</Tooltip>
										</div>
									</div>
									<ul className="ml-6">
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">Authentication</Text>
											</div>
										</li>
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">Role Based Access Control</Text>
											</div>
										</li>
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">
													Security (CSRF, rate limiting, etc)
												</Text>
											</div>
										</li>
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">Email notifications</Text>
											</div>
										</li>
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">Light and dark mode</Text>
											</div>
										</li>
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">Minimal, simple design</Text>
											</div>
										</li>
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">CI/CD</Text>
											</div>
										</li>
										<li>
											<div className="flex items-center gap-3">
												<span>{'-'}</span>
												<Text size="5">Optimized for mobile (PWA)</Text>
											</div>
										</li>
									</ul>
								</li>
							</ul>
							<ul>
								<li className="mt-2 flex items-center gap-3">
									<span>{'>'}</span> <Text size="5">1 month timeline</Text>
								</li>
								<li className="mt-2 flex items-center gap-3">
									<span>{'>'}</span>{' '}
									<Text size="5">Contract outlining scope</Text>
								</li>
								<li className="mt-2 flex items-center gap-3">
									<span>{'>'}</span>{' '}
									<Text size="5">Custom branding and colors</Text>
								</li>
								<li className="mt-2 flex items-center gap-3">
									<span>{'>'}</span> <Text size="5"></Text>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="flex h-full w-full flex-col justify-between rounded-2xl bg-[--gray-3] p-8">
					<Heading className="text-[--gray-12]" size="8">
						Contact us
					</Heading>
				</div>
			</section>
		</main>
	)
}
