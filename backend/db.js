import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import fs from 'fs'
import csv from 'csv-parser'
import multer from 'multer'

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'Qwe.123*',
    database : 'CrudClinic'
});
const app = express(); 
app.use(cors());
app.use(express.json());


connection.connect(
    (error)=>{
        if (error) throw error;
        
        console.log('conexion exitosa');
        
    })





// RUTAS PARA LOGIN USERS



app.get('/users', (req,res)=>{

    connection.query('SELECT * FROM CrudClinic.users',(error,result)=>{
        if (error) throw error;
        res.json(result);

});

})
app.get('/users/:id' , (req,res)=>{
    const id = req.params.id;
    connection.query('SELECT * FROM CrudClinic WHERE id = ?', [id], (error, result) =>{
        if(error) throw error;
        res.json(result);
    });
})














// RUTAS PARA PACIENTES 


/* ------------------ CRUD PACIENTES ------------------ */

// Obtener todos los pacientes
app.get('/pacientes', (req, res) => {
    connection.query('SELECT * FROM pacientes', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Obtener un paciente por ID
app.get('/pacientes/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM pacientes WHERE id_paciente = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result[0]);
    });
});

// Crear paciente
app.post('/pacientes', (req, res) => {
    const { nombre_paciente, correo_paciente } = req.body;
    connection.query(
        'INSERT INTO pacientes (nombre_paciente, correo_paciente) VALUES (?, ?)',
        [nombre_paciente, correo_paciente],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Paciente agregado', id: result.insertId });
        }
    );
});

// Actualizar paciente
app.put('/pacientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_paciente, correo_paciente } = req.body;
    connection.query(
        'UPDATE pacientes SET nombre_paciente = ?, correo_paciente = ? WHERE id_paciente = ?',
        [nombre_paciente, correo_paciente, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Paciente actualizado' });
        }
    );
});

// Eliminar paciente
app.delete('/pacientes/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM pacientes WHERE id_paciente = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Paciente eliminado' });
    });
});









// RUTAS PARA CRUD MEDICOS

/* ------------------ CRUD Medicos ------------------ */

// obtener todos los medicos
app.get('/medicos', (req,res) => {
    connection.query('SELECT * FROM medicos', (err,results) => {
        if(err) return res.status(500).json({ error: err});
        res.json(results);
    });
});


// obtener medico por id
app.get('/medicos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM medicos WHERE id_medico = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});


// Crear medico
app.post('/medicos', (req,res)=>{
    const { nombre_medico } = req.body;
    connection.query(
        'INSERT INTO medicos (nombre_medico) values(?)',
        [nombre_medico],
        (err, results) => {
            if(err) return res.status(500).json({ error:err });
            res.json({message : 'Medico agregado', id: results.insertId });
        } 
    )
})

// Actualizar medico
app.put('/medicos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_medico } = req.body;
    connection.query(
        'UPDATE medicos SET nombre_medico = ? WHERE id_medico = ?',
        [nombre_medico, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Medico actualizado' });
        }
    );
});

// Eliminar medico
app.delete('/medicos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM medicos WHERE id_medico = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'medico eliminado' });
    });
});












//RUTAS PARA CITAS 

/* ------------------ CRUD CItas ------------------ */
// Obtener todas las citas
app.get('/citas', (req, res) => {
    const query = `
        SELECT 
            c.id_cita,
            DATE_FORMAT(c.fecha_cita, '%Y-%m-%d') AS fecha_cita,
            c.hora_cita,
            c.motivo,
            c.descripcion,
            c.ubicacion,
            c.metodo_pago,
            c.estatus_cita,
            c.id_medico,
            m.nombre_medico,
            c.id_paciente,
            p.nombre_paciente
        FROM cita c
        JOIN medicos m ON c.id_medico = m.id_medico
        JOIN pacientes p ON c.id_paciente = p.id_paciente
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Obtener una cita por ID
app.get('/citas/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM cita WHERE id_cita = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result[0]);
    });
});

// Crear nueva cita
app.post('/citas', (req, res) => {
    const { fecha_cita, hora_cita, motivo, descripcion, ubicacion, metodo_pago, estatus_cita, id_medico, id_paciente } = req.body;
    connection.query(
        `INSERT INTO cita 
        (fecha_cita, hora_cita, motivo, descripcion, ubicacion, metodo_pago, estatus_cita, id_medico, id_paciente) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fecha_cita, hora_cita, motivo, descripcion, ubicacion, metodo_pago, estatus_cita, id_medico, id_paciente],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Cita creada', id: result.insertId });
        }
    );
});

// Actualizar cita
app.put('/citas/:id', (req, res) => {
    const { id } = req.params;
    const { fecha_cita, hora_cita, motivo, descripcion, ubicacion, metodo_pago, estatus_cita, id_medico, id_paciente } = req.body;
    connection.query(
        `UPDATE cita 
        SET fecha_cita = ?, hora_cita = ?, motivo = ?, descripcion = ?, ubicacion = ?, metodo_pago = ?, estatus_cita = ?, id_medico = ?, id_paciente = ? 
        WHERE id_cita = ?`,
        [fecha_cita, hora_cita, motivo, descripcion, ubicacion, metodo_pago, estatus_cita, id_medico, id_paciente, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Cita actualizada' });
        }
    );
});

// Eliminar cita
app.delete('/citas/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM cita WHERE id_cita = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Cita eliminada' });
    });
});












/* ------------------ CSV PAciente ------------------ */
//RUTA PARA UPLOAD PACIENTE



// const updload = multer({dest: 'uploads/'})
// app.post('/subir-archivo', updload.single('archivo'), async(req,res)=>{
//     const tipo = req.body.tipo;
//     const archivoCSV = req.file?.path;
//     const pacientes = []
//     fs.createReadStream(archivoCSV)
//     .pipe(csv())
//     .on('data', (data)=>{
//         console.log('estos son los datos', data);
//         pacientes.push(data);
        
//     })
//     .on('end', async ()=>{
//         try{
//             for( const paciente of pacientes){
//                 const query = `INSERT INTO pacientes (nombre_paciente,correo_paciente)
//                 VALUES(?,?)
//                 ON DUPLICATE KEY UPDATE id = id`;
//                 const values = [
//                     paciente.nombre_paciente,
//                     paciente.correo_paciente
//                 ]
//                 connection.execute(query,values)
//             }  
//         console.log('Usuarios cargados correctamente');
//         }catch(error){
//             console.error('error al insertar usuarios');
            
//         }

//     })

    
// })


const upload = multer({ dest: 'uploads/' });

app.post('/subir-archivo', upload.single('archivo'), async (req, res) => {
    const tipo = req.body.tipo; // 'pacientes', 'medicos', 'citas'
    const archivoCSV = req.file?.path;
    const registros = [];

    if (!tipo) return res.status(400).json({ error: 'Debes enviar el tipo en el body' });

    fs.createReadStream(archivoCSV)
        .pipe(csv())
        .on('data', (data) => {
            console.log(`Datos recibidos (${tipo}):`, data);
            registros.push(data);
        })
        .on('end', async () => {
            try {
                for (const item of registros) {
                    let query = '';
                    let values = [];

                    if (tipo === 'pacientes') {
                        query = `INSERT INTO pacientes (nombre_paciente, correo_paciente)
                                 VALUES (?, ?)
                                 ON DUPLICATE KEY UPDATE id_paciente = id_paciente`;
                        values = [item.nombre_paciente, item.correo_paciente];
                    } 
                    else if (tipo === 'medicos') {
                        query = `INSERT INTO medicos (nombre_medico)
                                 VALUES (?)
                                 ON DUPLICATE KEY UPDATE id_medico = id_medico`;
                        values = [item.nombre_medico];
                    } 
                    else if (tipo === 'citas') {
                        query = `INSERT INTO cita (fecha_cita, hora_cita, motivo, descripcion, ubicacion, metodo_pago, estatus_cita, id_medico, id_paciente)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                                 ON DUPLICATE KEY UPDATE id_cita = id_cita`;
                        values = [
                            item.fecha_cita,
                            item.hora_cita,
                            item.motivo,
                            item.descripcion,
                            item.ubicacion,
                            item.metodo_pago,
                            item.estatus_cita,
                            item.id_medico,
                            item.id_paciente
                        ];
                    } 
                    else {
                        return res.status(400).json({ error: 'Tipo no válido' });
                    }

                    await connection.execute(query, values);
                }

                console.log(`Registros de ${tipo} cargados correctamente`);
                res.json({ message: `Registros de ${tipo} cargados correctamente` });

            } catch (error) {
                console.error(`Error al insertar ${tipo}:`, error);
                res.status(500).json({ error: 'Error al insertar registros' });
            }
        });
});



app.listen(3000, (error) =>{
    if(error) throw error;

    console.log('api corriendo en puerto 3000');
    
})