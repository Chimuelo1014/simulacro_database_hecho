const API_URL = "http://localhost:3000/citas"; // Cambia según tu backend
const tbody = document.getElementById("celda");

async function cargarCitas() {
    try {
        const res = await fetch(API_URL);
        const citas = await res.json();

        tbody.innerHTML = "";
        citas.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id_cita}</td>
                    <td>${c.fecha_cita}</td>
                    <td>${c.hora_cita}</td>
                    <td>${c.motivo || ""}</td>
                    <td>${c.descripcion || ""}</td>
                    <td>${c.ubicacion || ""}</td>
                    <td>${c.metodo_pago || ""}</td>
                    <td>${c.estatus_cita || ""}</td>
                    <td>${c.id_medico} - ${c.nombre_medico}</td>
                    <td>${c.id_paciente} - ${c.nombre_paciente}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarCita(${c.id_cita})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarCita(${c.id_cita})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando citas:", error);
    }
}

async function eliminarCita(id) {
    if (confirm("¿Seguro que deseas eliminar esta cita?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            cargarCitas();
        } catch (error) {
            console.error("Error eliminando cita:", error);
        }
    }
}

function editarCita(id) {
    // Aquí abrirías un modal o formulario para editar
    console.log("Editar cita con ID:", id);
}

cargarCitas();
