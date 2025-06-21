import { copyFileOrFolder } from "$lib/server/api/filesystem";
import { loginMiddleware } from "$lib/server/api/login";

export async function POST({ request }: { request: Request }): Promise<Response> {
    if (!(await loginMiddleware(request))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { oldPath, newPath } = await request.json();
        copyFileOrFolder(oldPath, newPath);
    } catch (error) {
        if (error instanceof Error && error.message.startsWith('ENOENT')) {
            return new Response(JSON.stringify({ error: 'Path does not exist' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        } else if (error instanceof Error && error.message.startsWith('EEXIST')) {
            return new Response(JSON.stringify({ error: 'Path already exists' }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }
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
