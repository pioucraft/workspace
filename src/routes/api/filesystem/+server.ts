import { readFileOrFolder } from '$lib/server/api/filesystem';
import { loginMiddleware } from '$lib/server/api/login';

export async function GET({ request }: { request: Request }): Promise<Response> {
    if (!(await loginMiddleware(request))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const path = new URL(request.url).searchParams.get('path') || '/';
    try {
        const folderContent = readFileOrFolder(path);

        return new Response(JSON.stringify(folderContent), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        if (error instanceof Error && error.message.startsWith('ENOENT')) {
            return new Response(JSON.stringify({ error: 'Path does not exist' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
