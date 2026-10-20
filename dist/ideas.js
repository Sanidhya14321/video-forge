import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
export async function shotIdeas(id) {
    const data = JSON.parse(await readFile(fileURLToPath(new URL('../skills/video-forge/assets/shot-recipes.json', import.meta.url)), 'utf8'));
    if (id === 'list')
        return { authorship: data.authorship, recipes: data.recipes.map(({ id, name, tags }) => ({ id, name, tags })), usage: 'ideas <id> loads one recipe. Choose by the brief; this index does not score taste.' };
    const recipe = data.recipes.find((r) => r.id === id);
    if (!recipe)
        throw new Error(`Unknown shot recipe: ${id}. Run ideas list.`);
    return { authorship: data.authorship, ...recipe };
}
