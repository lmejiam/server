import jwt from 'jsonwebtoken'
import pool from '../config/db.config.js'


async function getFish(req, res){
    try{
        const result = await pool.query('SELECT * FROM sorting.fish ORDER BY whooshh_id DESC LIMIT 30;');
        res.json(result.rows);

    } catch(error){
        console.log(error)
        res.status(400).json(error)
    }

}

export {

    getFish

}