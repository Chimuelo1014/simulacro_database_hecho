const API_URL = "http://localhost:3000/medicos";
let modal;
document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("modalMedico"));
    cargarMedicos();
});

function cargarMedicos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#tablaMedicos tbody");
            tbody.innerHTML = "";
            data.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td>${p.id_medico}</td>
                        <td>${p.nombre_medico}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarMedico(${p.id_medico})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${p.id_medico})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function abrirModal() {
    document.getElementById("tituloModal").textContent = "Nuevo Medico";
    document.getElementById("id_medico").value = "";
    document.getElementById("nombre_medico").value = "";
    modal.show();
}

function editarMedico(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(p => {
            document.getElementById("tituloModal").textContent = "Editar Medico";
            document.getElementById("id_medico").value = p.id_medico;
            document.getElementById("nombre_medico").value = p.nombre_medico;
            modal.show();
        });
}

function guardarMedico() {
  const id = document.getElementById("id_medico").value;
  const nombre = document.getElementById("nombre_medico").value.trim();

  if (!nombre) {
    alert("El nombre del médico es obligatorio");
    return;
  }

  const medico = { nombre_medico: nombre };
  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medico)
  })
  .then(res => {
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
    return res.json();
  })
  .then(() => {
    modal.hide();
    cargarMedicos();
  })
  .catch(err => {
    alert("Error al guardar médico: " + err.message);
  });
}


function eliminarMedico(id) {
    if (confirm("¿Eliminar este medico?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => cargarMedicos());
    }
}
