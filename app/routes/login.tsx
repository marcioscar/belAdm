import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { login } from "./utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const credentials = Object.fromEntries(formData);
	return await login(credentials);
};

export default function RouteComponent() {
	const errors = useActionData<typeof action>();
	console.log(errors?.email);

	return (
		<div className='flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2
					id='login-header'
					className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Log in
				</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
				<div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
					<div className=' text-sm text-red-500'>{errors?.email}</div>
					<Form className='space-y-6' method='post'>
						<div>
							<Label htmlFor='email'>
								Nome de Usuário
								{/* {actionResult?.errors?.email && (
									<span id='email-error' className='text-brand-red'>
										{actionResult.errors.email}
									</span>
								)} */}
							</Label>
							<Input
								autoFocus
								id='email'
								name='email'
								type='text'
								autoComplete='email'
								// aria-describedby={
								// 	actionResult?.errors?.email ? "email-error" : "login-header"
								// }
								required
							/>
						</div>

						<div>
							<Label htmlFor='password'>
								Senha
								{/* {actionResult?.errors?.password && (
									<span id='password-error' className='text-brand-red'>
										{actionResult.errors.password}
									</span>
								)} */}
							</Label>
							<Input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								aria-describedby='password-error'
								required
							/>
						</div>

						<div>
							<Button type='submit'>Entrar</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
}
