import { useInputEvent } from '@conform-to/react'
import { Checkbox, TextField, Text, TextArea } from '@radix-ui/themes'
import React, { useId, useRef } from 'react'
import { cn } from '#app/utils/misc'

export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function ErrorList({
	id,
	errors,
}: {
	errors?: ListOfErrors
	id?: string
}) {
	const errorsToRender = errors?.filter(Boolean)
	if (!errorsToRender?.length) return null
	return (
		<ul id={id} className="flex flex-col gap-1">
			{errorsToRender.map(e => (
				<Text asChild key={e} color="red">
					<li className="text-[10px]">{e}</li>
				</Text>
			))}
		</ul>
	)
}

export function Field({
	labelProps,
	inputProps,
	errors,
	className,
}: {
	labelProps: Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color'>
	inputProps: Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'color' | 'size'
	>
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const id = inputProps.id ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div className={cn('flex flex-col gap-1', className)}>
			<Text as="label" htmlFor={id} {...labelProps} />
			<TextField.Input
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				color={errorId ? 'red' : undefined}
				variant={errorId ? 'soft' : undefined}
				{...inputProps}
			/>
			<div className="min-h-5">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	)
}

export function TextareaField({
	labelProps,
	textareaProps,
	errors,
	className,
}: {
	labelProps: Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color'>
	textareaProps: Omit<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		'color' | 'size'
	>
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const id = textareaProps.id ?? textareaProps.name ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div className={className}>
			<Text as="label" htmlFor={id} {...labelProps} />
			<TextArea
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				color={errorId ? 'red' : undefined}
				variant={errorId ? 'soft' : undefined}
				{...textareaProps}
			/>
			<div className="min-h-5">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	)
}

export function CheckboxField({
	labelProps,
	buttonProps,
	errors,
	className,
}: {
	labelProps: JSX.IntrinsicElements['label']
	buttonProps: Omit<
		React.InputHTMLAttributes<HTMLButtonElement>,
		'color' | 'size' | 'type'
	> & { onCheckedChange?: (state: boolean | 'indeterminate') => void }
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const buttonRef = useRef<HTMLButtonElement>(null)
	// To emulate native events that Conform listen to:
	// See https://conform.guide/integrations
	const control = useInputEvent({
		// Retrieve the checkbox element by name instead as Radix does not expose the internal checkbox element
		// See https://github.com/radix-ui/primitives/discussions/874
		ref: () =>
			buttonRef.current?.form?.elements.namedItem(buttonProps.name ?? ''),
		onFocus: () => buttonRef.current?.focus(),
	})
	const id = buttonProps.id ?? buttonProps.name ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div className={className}>
			<div className="flex items-center gap-2">
				<Checkbox
					id={id}
					ref={buttonRef}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					{...buttonProps}
					onCheckedChange={state => {
						control.change(Boolean(state.valueOf()))
						buttonProps.onCheckedChange?.(state)
					}}
					onFocus={event => {
						control.focus()
						buttonProps.onFocus?.(event)
					}}
					onBlur={event => {
						control.blur()
						buttonProps.onBlur?.(event)
					}}
					color={errorId ? 'red' : undefined}
					variant={errorId ? 'soft' : undefined}
					type="button"
				/>
				<label
					htmlFor={id}
					{...labelProps}
					className="text-body-xs text-muted-foreground self-center"
				/>
			</div>
			<div className="min-h-5">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	)
}
