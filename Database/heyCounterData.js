const { Pool, Client } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION,
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

// ADD a new hey guys user in database
module.exports.addUser = async function (discord_id) {

    const query_string =
        `INSERT INTO public."lina_hey_counter"
        (discord_id, last_message) 
        VALUES($1, NOW())
        ON CONFLICT (discord_id)
        DO NOTHING`;

    const values = [discord_id];
    try {
        const res = await pool.query(query_string, values);
    } catch (err) {
        console.log(err.stack)
    }
}

// UPDATE hey guys user in database
module.exports.updateUserPoints = async function (discord_id) {

    const query_string =
        `UPDATE public."lina_hey_counter" 
        SET count = count + 1,
        total = total + 1,
        last_message = NOW()
        WHERE discord_id = $1`;

    const values = [discord_id];
    try {
        const res = await pool.query(query_string, values);
    } catch (err) {
        console.log(err.stack)
    }
}

// UPDATE hey guys user in database
module.exports.updateUserErrors = async function (discord_id) {

    const query_string =
        `UPDATE public."lina_hey_counter" 
        SET error = error + 1
        WHERE discord_id = $1`;

    const values = [discord_id];
    try {
        const res = await pool.query(query_string, values);
    } catch (err) {
        console.log(err.stack)
    }
}

// GET hey guys user data from database
module.exports.getUser = async function (discord_id) {

    const query_string =
        `SELECT * FROM public."lina_hey_counter"
        WHERE discord_id = $1`;

    const values = [discord_id];
    try {
        const res = await pool.query(query_string, values);
        return res.rows[0];
    } catch (err) {
        console.log(err.stack)
    }

}

// GET all hey guys user info from database
module.exports.getAllUser = async function () {

    const query_string =
        `SELECT * FROM public."lina_hey_counter"
        ORDER BY total ASC
        LIMIT 20`;

    const values = [];
    try {
        const res = await pool.query(query_string, values);
        return res.rows;
    } catch (err) {
        console.log(err.stack)
    }

}