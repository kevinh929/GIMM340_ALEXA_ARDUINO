const connection = require('./connection');

class Bedtimes {
    async getAll(parameters = {}) {
        try {
            let selectSql = `SELECT id, kid_id, bedtime_start, bedtime_end FROM bedtime WHERE 1=1`,
                queryParams = [];
            if (parameters.kid_id){
                selectSql += ` AND kid_id LIKE ?`;
                queryParams.push(`%${parameters.kid_id}%`);
            }
            if (parameters.bedtime_start){
                selectSql += ` AND bedtime_start LIKE ?`;
                queryParams.push(`%${parameters.bedtime_start}%`);
            }
            if (parameters.bedtime_end){
                selectSql += ` AND bedtime_end LIKE ?`;
                queryParams.push(`%${parameters.bedtime_end}%`);
            }
            return await connection.query(selectSql, queryParams);
        }
        catch (error) {
            console.error("Error fetching bedtimes: ", error);
            throw error;
        }
    }
    
    async innerJoinAll(parameters = {}) {
        try {
            let selectSql = `SELECT bedtime.id, bedtime.bedtime_start, bedtime.bedtime_end, kid_names.name, kid_names.arduino_id FROM bedtime INNER JOIN kid_names ON bedtime.kid_id = kid_names.id WHERE 1=1`,
                queryParams = [];
            if (parameters.bedtime_start) {
                selectSql += ` AND bedtime.bedtime_start LIKE ?`;
                queryParams.push(`%${parameters.bedtime_start}%`);
            }
            if (parameters.bedtime_end) {
                selectSql += ` AND bedtime.bedtime_end LIKE ?`;
                queryParams.push(`%${parameters.bedtime_end}%`);
            }
            if (parameters.name) {
                selectSql += ` AND kid_names.name LIKE ?`;
                queryParams.push(`%${parameters.name}%`);
            }
            if (parameters.arduino_id) {
                selectSql += ` AND kid_names.arduino_id LIKE ?`;
                queryParams.push(`%${parameters.arduino_id}%`);
            }
            return await connection.query(selectSql, queryParams);
        }
        catch (error) {
            console.error("Error fetching all data: ", error);
            throw error;
        }
    }
    async create(parameters) {
        try{
            const insertSql = `
                INSERT INTO bedtime (kid_id, bedtime_start, bedtime_end)
                VALUES (?, ?, ?)
            `;
            const insertParams = [
                parameters.kid_id,
                parameters.bedtime_start,
                parameters.bedtime_end
            ];
            const result =  await connection.query(insertSql, insertParams);
            return { id: result.insertId, ...parameters };
        }
        catch (error) {
            console.error("Error creating bedtime: ", error);
            throw error;
        }
    }
    async edit(id, parameters) {
        try {
            const updateSql = `
                UPDATE bedtime
                SET kid_id = ?, bedtime_start = ?, bedtime_end = ?
                WHERE id = ?
            `;
            const updateParams = [
                parameters.kid_id,
                parameters.bedtime_start,
                parameters.bedtime_end,
                id
            ];
            await connection.query(updateSql, updateParams);
            return { id, ...parameters };
        }
        catch (error) {
            console.error("Error updating bedtime: ", error);
            throw error;
        }    
    }
    async remove(id) {
        try {
            const deleteSql = `DELETE FROM bedtime WHERE id = ?`;
            const deleteParams = [id];
            await connection.query(deleteSql, deleteParams);
            return { id };
        }
        catch (error) {
            console.error("Error deleting bedtime: ", error);
            throw error;
        }
    }
}

module.exports = Bedtimes;