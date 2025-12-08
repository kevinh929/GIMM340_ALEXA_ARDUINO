const mysql = require('mysql2/promise');

let connection = null;

async function  query(sql, params) {
    try {
        if (connection === null) {
            connection = await mysql.createConnection({
                host: "",
                user: "kevinhoagland929",
                password: "PUsAFL43yNffxmSRIdSzOMhTT7GO8ayAQ8l",
                database: "kevinhoagland929"
            });
            console.log("Connection established");
        }

        const [results,] = await connection.execute(sql, params);
        return results;
    }
    catch (error) {
        console.error("Database queery error: ", error);
        throw error;
    }
}

module.exports = {
    query
};