import { uploadFiles } from '$lib/server/api/filesystem';
import { loginMiddleware } from '$lib/server/api/login';

export async function POST({ request }: { request: Request }): Promise<Response> {
	if (!(await loginMiddleware(request))) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	try {
		const formData = await request.formData();
		const path = formData.get('path') as string;
		const files = formData.getAll('files') as File[];

		await uploadFiles(path, files);
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
