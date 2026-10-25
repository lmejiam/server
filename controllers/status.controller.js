import jwt from 'jsonwebtoken'
import { execFile } from 'child_process'
import { isIP } from 'net'
import pool from '../config/db.config.js'


async function getStatus(req, res){
    try{
        const result = await pool.query('SELECT * FROM status.systemstatus;');
        res.json(result.rows[0]);

    } catch(error){
        console.log(error)
        res.status(400).json(error)
    }

}

async function getCounts(req, res){
    try{
        const result = await pool.query(`
                                        SELECT
                                            COUNT(*) FILTER (WHERE outputlane = '0')::int AS lane0,
                                            COUNT(*) FILTER (WHERE outputlane = '1')::int AS lane1,
                                            COUNT(*) FILTER (WHERE outputlane = '2')::int AS lane2,
                                            COUNT(*) FILTER (WHERE outputlane = '3')::int AS lane3,
                                            COUNT(*) FILTER (WHERE outputlane = '4')::int AS lane4,
                                            COUNT(*)::int                          AS total
                                        FROM sorting.fish
                                        WHERE "timestamp"::date = CURRENT_DATE
                                        `);
        res.json(result.rows[0]);

    }  catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch counts' });
    }

}

async function updateActiveTagFile(tagfilename) {
    const result = await pool.query(
        `UPDATE status.systemstatus
            SET activetagfile = $1
        WHERE id = 1
        RETURNING *;`,
        [tagfilename]
    );
    return result.rows[0];
}

function getRemoteConnectionStatus(req, res){
    const ip = process.env.REMOTE_IP;
    if (!isIP(ip)) {
        console.error('REMOTE_IP is missing or invalid in .env')
        return res.json({ remoteConnectionStatus : "NOT FOUND"});
    }

    const countFlag = process.platform === 'win32' ? '-n' : '-c';
    execFile('ping', [countFlag, '1', ip], { timeout: 1000 }, (error) => {
        res.json({ remoteConnectionStatus : error ? "NOT FOUND" : "FOUND"});
    });
}

export {
    getStatus,
    getRemoteConnectionStatus,
    getCounts,
    updateActiveTagFile
}