import { statSync, readFileSync, readdirSync } from 'fs';

export function readFileOrFolder(path: string): {fileContent?: string, folderContent?: {name: string, stats: ReturnType<typeof statSync>}[]} {
    const stats = statSync(path)
    if(stats.isFile()) {
        const fileContent = readFileSync(path, 'utf-8');
        return { fileContent };

    } else if (stats.isDirectory()) {
        const folder = readdirSync(path);
        let folderContent: {name: string, stats: ReturnType<typeof statSync>}[] = [];

        for (const item of folder) {
            const itemPath = `${path}/${item}`;
            const itemStats = statSync(itemPath);
            folderContent.push({ name: item, stats: itemStats });
        }

        return { folderContent };
    }
    throw new Error("Path does not exist")

}

