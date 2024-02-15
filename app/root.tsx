// import { cssBundleHref } from "@remix-run/css-bundle";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import type { LinksFunction } from "@vercel/remix";

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ];

// import stylesheet from "~/tailwind.css";
import styles from "./globals.css";
import Sidebar from "./routes/components/Sidebar";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				<div className='flex min-h-screen'>
					<Sidebar />
					<div className='mt-0 flex-1  bg-zinc-300'>
						<Outlet />
					</div>
				</div>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				<Analytics />
			</body>
		</html>
	);
}
