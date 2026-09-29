import jwt from 'jsonwebtoken'
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

export {

    getStatus

}