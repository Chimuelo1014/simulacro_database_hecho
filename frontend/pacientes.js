const API_URL = "http://localhost:3000/pacientes";
let modal;
document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("modalPaciente"));
    cargarPacientes();
});

function cargarPacientes() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#tablaPacientes tbody");
            tbody.innerHTML = "";
            data.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td>${p.id_paciente}</td>
                        <td>${p.nombre_paciente}</td>
                        <td>${p.correo_paciente}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarPaciente(${p.id_paciente})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${p.id_paciente})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function abrirModal() {
    document.getElementById("tituloModal").textContent = "Nuevo Paciente";
    document.getElementById("id_paciente").value = "";
    document.getElementById("nombre_paciente").value = "";
    document.getElementById("correo_paciente").value = "";
    modal.show();
}

function editarPaciente(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(p => {
            document.getElementById("tituloModal").textContent = "Editar Paciente";
            document.getElementById("id_paciente").value = p.id_paciente;
            document.getElementById("nombre_paciente").value = p.nombre_paciente;
            document.getElementById("correo_paciente").value = p.correo_paciente;
            modal.show();
        });
}

function guardarPaciente() {
    const id = document.getElementById("id_paciente").value;
    const paciente = {
        nombre_paciente: document.getElementById("nombre_paciente").value,
        correo_paciente: document.getElementById("correo_paciente").value
    };

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente)
    })
    .then(res => res.json())
    .then(() => {
        modal.hide();
        cargarPacientes();
    });
}

function eliminarPaciente(id) {
    if (confirm("¿Eliminar este paciente?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => cargarPacientes());
    }
}
