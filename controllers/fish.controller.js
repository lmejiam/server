import jwt from 'jsonwebtoken'


async function getFish(req, res){
    try{
        const result = await pool.query('SELECT * FROM sorting.fish');
        res.json(result.rows);

    } catch(error){
        console.log(error)
        res.status(400).json(error)
    }

}

export {

    getFish

}