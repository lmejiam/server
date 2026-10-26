import { readdir } from 'fs/promises'
import os from 'os'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const IMAGES_DIR = path.resolve(os.homedir(), process.env.IMAGES_PATH || 'images');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

async function getImages(req, res){
    try{
        const offset = Math.max(0, parseInt(req.query.offset) || 0);
        const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit) || DEFAULT_LIMIT));

        // File names start with the date and time (20260917_192111_...), so sorting
        // by name newest-first avoids a slow stat() per file on the Samba share
        const names = (await readdir(IMAGES_DIR))
            .filter(name => IMAGE_EXTENSIONS.includes(path.extname(name).toLowerCase()))
            .sort()
            .reverse();

        const images = names
            .slice(offset, offset + limit)
            .map(name => ({ name, url: `/api/images/${encodeURIComponent(name)}` }));

        res.json({
            images,
            total: names.length,
            hasMore: offset + limit < names.length
        });

    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to read images' });
    }
}

export {
    IMAGES_DIR,
    getImages
}
