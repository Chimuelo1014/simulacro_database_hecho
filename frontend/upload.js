async function subirArchivo(formId, tipo) {
    const form = document.getElementById(formId);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputFile = form.querySelector("input[type='file']");
        const file = inputFile.files[0];
        if (!file) {
            alert("Por favor selecciona un archivo CSV");
            return;
        }

        const formData = new FormData();
        formData.append("archivo", file);
        formData.append("tipo", tipo);

        try {
            const res = await fetch("http://localhost:3000/subir-archivo", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message);
            } else {
                alert("Error: " + (data.error || "No se pudo subir el archivo"));
            }
        } catch (error) {
            console.error("Error en la subida:", error);
            alert("Error de conexión con el servidor");
        }
    });
}

// Asignar a cada formulario
subirArchivo("formPacientes", "pacientes");
subirArchivo("formMedicos", "medicos");
subirArchivo("formCitas", "citas");
