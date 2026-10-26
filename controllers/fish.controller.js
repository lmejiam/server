import jwt from 'jsonwebtoken'
import pool from '../config/db.config.js'
import { writeFile, mkdir} from 'fs/promises'
import path from 'path'

async function getFish(req, res){
    try{
        const result = await pool.query('SELECT * FROM sorting.fish ORDER BY whooshh_id DESC LIMIT 10;');
        res.json(result.rows);

    } catch(error){
        console.log(error)
        res.status(400).json(error)
    }

}

function toCsvValue(value){
    if (value === null || value === undefined) return '';
    if (value instanceof Date){
        const year  = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day   = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
    };

    const text = String(value);
    if (/[";\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

async function buildFishCsv(){

    const result = await pool.query(`
        SELECT date, whooshh_id AS FISH, tag_num AS TAG, site, priority, prioritygate AS Assigned_Gate, outputlane AS Fish_Outlet, outlet_label, weight, length, circumference, condition, maturity, filename1, filename2, file_id_aris AS FILE_ID
        FROM sorting.fish
        WHERE "timestamp"::date = CURRENT_DATE;
    `);

    const headers = result.fields.map(field => field.name);
    const lines = [
        headers.join(';'),
        ...result.rows.map(row => headers.map(h => toCsvValue(row[h])).join(';'))
    ];
    return lines.join('\n');

}

let lastExportedID = null;
let exportRunning = false;

async function checkDailyExport(){
    if (exportRunning) return;
    exportRunning = true;

    try{
        // On startup, start counting from the newest fish already in the table
        if(lastExportedID === null){
            const start = await pool.query('SELECT COALESCE(MAX(whooshh_id), 0) AS max_id FROM sorting.fish');
            lastExportedID = start.rows[0].max_id;
            return;
        }

        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*)::int FROM sorting.fish WHERE whooshh_id > $1) AS new_count,
                (SELECT MAX(whooshh_id) FROM sorting.fish WHERE whooshh_id > $1) AS max_id,
                (SELECT sorting FROM status.systemstatus WHERE id = 1) AS sorting,
                (SELECT site_name FROM status.systemstatus WHERE id = 1) AS site
        `, [lastExportedID]);
        const { new_count, max_id, sorting, site } = result.rows[0];

        const batchReady = new_count >= 10;
        const sortingStopped = Number(sorting) === 0 && new_count > 0;

        if (batchReady || sortingStopped) {
            const dir = process.env.CSV_EXPORT_DIR;
            await mkdir(dir, { recursive: true });

            const stamp = new Date().toISOString().replace(/[:.]/g, '-');
            const safeSite = String(site || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_')
            const filePath = path.join(dir, `${safeSite}_${stamp}.csv`);
            await writeFile(filePath, await buildFishCsv());

            lastExportedID = max_id;
            console.log(`Exported ${filePath} (${new_count} new fish, ${batchReady ? 'batch of 10' : 'sorting stopped'})`);
        }
    } catch(error){
        console.error('CSV export failed:', error);
    } finally {
        exportRunning = false;
    }
}

export {

    getFish,
    checkDailyExport

}
