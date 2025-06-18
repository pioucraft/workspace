import { login } from '$lib/server/api/login';

export async function POST({ request }: { request: Request }): Promise<Response> {
	const { username, password } = await request.json();

	if (!username || !password) {
		return new Response(JSON.stringify({ error: 'Username and password are required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const isOk = await login(username, password);
	if (!isOk) {
		return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ message: 'Login successful' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
