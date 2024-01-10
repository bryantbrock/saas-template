import { redirect, type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [{ title: 'saas-template' }]

export async function loader() {
	return redirect('/app')
}
