import { Form } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
const schema = zod.object({
	name: zod.string().min(1),
	email: zod.string().email().min(1),
});

type FormData = zod.infer<typeof schema>;

const resolver = zodResolver(schema);

export default function ReceitaForm() {
	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useRemixForm<FormData>({
		mode: "onSubmit",
		resolver,
	});
	return (
		<Form onSubmit={handleSubmit}>
			<label>
				Name:
				<input type='text' {...register("name")} />
				{errors.name && <p>{errors.name.message}</p>}
			</label>
			<label>
				Email:
				<input type='email' {...register("email")} />
				{errors.email && <p>{errors.email.message}</p>}
			</label>
			<button type='submit'>Submit</button>
		</Form>
	);
}
