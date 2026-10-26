import { readdir, stat } from 'fs/promises'
import os from 'os'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const IMAGES_DIR = path.resolve(os.homedir(), process.env.IMAGES_PATH || 'images');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

async function getImages(req, res){
    try{
        const files = await readdir(IMAGES_DIR);

        const images = await Promise.all(
            files
                .filter(name => IMAGE_EXTENSIONS.includes(path.extname(name).toLowerCase()))
                .map(async name => {
                    const info = await stat(path.join(IMAGES_DIR, name));
                    return { name, url: `/api/images/${encodeURIComponent(name)}`, modified: info.mtime };
                })
        );

        images.sort((a, b) => b.modified - a.modified);
        res.json(images);

    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to read images' });
    }
}

export {
    IMAGES_DIR,
    getImages
}
