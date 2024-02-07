import type { LoaderFunctionArgs } from "@remix-run/node";
import { getDespesas } from "./utils/despesas.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const despesas = await getDespesas();
	return despesas;
};

// export default function RouteComponent(){
//   const data = useLoaderData<typeof loader>()
//   return (
//     <div />
//   );
// }