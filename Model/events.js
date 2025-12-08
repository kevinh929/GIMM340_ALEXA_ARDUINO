const connection = require('./connection');

class Events {
    async getAll(parameters = {}) {
        try {
            let selectSql = `SELECT id, arduino_id, sensor_id, event_time FROM sensor_events WHERE 1=1`,
                queryParams = [];
            if (parameters.arduino_id){
                selectSql += ` AND arduino_id LIKE ?`;
                queryParams.push(`%${parameters.arduino_id}%`);
            }
            if (parameters.sensor_id){
                selectSql += ` AND sensor_id LIKE ?`;
                queryParams.push(`%${parameters.sensor_id}%`);
            }
            if (parameters.event_time){
                selectSql += ` AND event_time LIKE ?`;
                queryParams.push(`%${parameters.event_time}%`);
            }
            return await connection.query(selectSql, queryParams);
        }
        catch (error) {
            console.error("Error fetching events: ", error);
            throw error;
        }
    }
    async create(parameters) {
        try{
            const insertSql = `
                INSERT INTO sensor_events (arduino_id, sensor_id, event_time)
                VALUES (?, ?, ?)
            `;
            const insertParams = [
                parameters.arduino_id,
                parameters.sensor_id,
                parameters.event_time
            ];
            const result =  await connection.query(insertSql, insertParams);
            return { id: result.insertId, ...parameters };
        }
        catch (error) {
            console.error("Error creating event: ", error);
            throw error;
        }
    }
    async edit(id, parameters) {
        try {
            const updateSql = `
                UPDATE sensor_events
                SET arduino_id = ?, sensor_id = ?, event_time = ?
                WHERE id = ?
            `;
            const updateParams = [
                parameters.arduino_id,
                parameters.sensor_id,
                parameters.event_time,
                id
            ];
            await connection.query(updateSql, updateParams);
            return { id, ...parameters };
        }
        catch (error) {
            console.error("Error updating event: ", error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const deleteSql = `DELETE FROM sensor_events WHERE id = ?`;
            const deleteParams = [id];
            await connection.query(deleteSql, deleteParams);
            return { id };
        }
        catch (error) {
            console.error("Error deleting event: ", error);
            throw error;
        }
    }
}

module.exports = Events;