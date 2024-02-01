import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { requireUserSession, signup } from "./utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const credentials = Object.fromEntries(formData);

	return await signup(credentials);
};

export default function Novousuario() {
	return (
		<div className='flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2
					id='login-header'
					className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Novo Usuário{" "}
				</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
				<div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
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
