import {
	createFile,
	createFolder,
	deleteFileOrFolder,
	modifyFileContent,
	moveFileOrFolder,
	readFileOrFolder
} from '$lib/server/api/filesystem';
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

export async function POST({ request }: { request: Request }): Promise<Response> {
	if (!(await loginMiddleware(request))) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { path, isDirectory } = await request.json();

	try {
		if (isDirectory) {
			createFolder(path);
		} else {
			createFile(path);
		}
		return new Response(JSON.stringify({ success: true }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith('EEXIST')) {
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
}

export async function PATCH({ request }: { request: Request }): Promise<Response> {
	if (!(await loginMiddleware(request))) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { oldPath, newPath } = await request.json();

	try {
		moveFileOrFolder(oldPath, newPath);

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
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
}

export async function DELETE({ request }: { request: Request }): Promise<Response> {
	if (!(await loginMiddleware(request))) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { path } = await request.json();

	try {
		deleteFileOrFolder(path);

		return new Response(JSON.stringify({ success: true }), {
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

export async function PUT({ request }: { request: Request }): Promise<Response> {
    if (!(await loginMiddleware(request))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { path, content } = await request.json();

    try {
        modifyFileContent(path, content);
        return new Response(JSON.stringify({ success: true }), {
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

