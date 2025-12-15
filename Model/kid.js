const connection = require('./connection');

class Kid {
    async getAll(parameters = {}) {
        try {
            let selectSql = `SELECT id, name, arduino_id FROM kid_names WHERE 1=1`,
                queryParams = [];
            if (parameters.name){
                selectSql += ` AND name LIKE ?`;
                queryParams.push(`%${parameters.name}%`);
            }
            return await connection.query(selectSql, queryParams);
        }
        catch (error) {
            console.error("Error fetching kids: ", error);
            throw error;
        }
    }

    async create(parameters) {
        try{
            const insertSql = `
                INSERT INTO kid_names (name, arduino_id)
                VALUES (?, ?)
            `;
            const insertParams = [
                parameters.name,
                parameters.arduino_id
            ];
            const result =  await connection.query(insertSql, insertParams);
            return { id: result.insertId, ...parameters };
        }
        catch (error) {
            console.error("Error creating kid: ", error);
            throw error;
        }
    }

    async edit(id, parameters) {
        try {
            const updateSql = `
                UPDATE kid_names
                SET name = ?, arduino_id = ?
                WHERE id = ?
            `;
            const updateParams = [
                parameters.name,
                parameters.arduino_id,
                id
            ];
            await connection.query(updateSql, updateParams);
            return { id, ...parameters };
        }
        catch (error) {
            console.error("Error updating kid: ", error);
            throw error;
        }    
    }
    async remove(name) {
        try {
            const deleteSql = `DELETE FROM kid_names WHERE name = ?`;
            const deleteParams = [name];
            await connection.query(deleteSql, deleteParams);
            return { name };
        }
        catch (error) {
            console.error("Error deleting kid: ", error);
            throw error;
        }
    }
}

module.exports = Kid;
