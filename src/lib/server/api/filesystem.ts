import { statSync, readFileSync, readdirSync, writeFileSync, renameSync, mkdirSync } from 'fs';

export function readFileOrFolder(path: string): {fileContent?: string, folderContent?: {name: string, stats: ReturnType<typeof statSync>}[]} {
    let formatedPath = "./data" + path

    const stats = statSync(formatedPath);
    if(stats.isFile()) {
        const fileContent = readFileSync(formatedPath, 'utf-8');
        return { fileContent };

    } else if (stats.isDirectory()) {
        const folder = readdirSync(formatedPath);
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

export function modifyFileContent(path: string, content: string) {
    let formatedPath = "./data" + path;

    writeFileSync(formatedPath, content, 'utf-8')
}

export function moveFileOrFolder(source: string, destination: string) {
    let formatedSource = "./data" + source;
    let formatedDestination = "./data" + destination;

    renameSync(formatedSource, formatedDestination);
}

export function createFile(path: string) {
    let formatedPath = "./data" + path;

    writeFileSync(formatedPath, '', 'utf-8');
}

export function createFolder(path: string) {
    let formatedPath = "./data" + path;

    mkdirSync(formatedPath, { recursive: true });
}
