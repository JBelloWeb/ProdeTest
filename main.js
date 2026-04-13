const urlAppScript = "https://script.google.com/macros/s/AKfycbyhqVmTJF0cwOLga5nWUqwxa00AstSoC-cfIA3d9gVg62ZcL4Nf3r7lfvvrVdlmGzRW/exec";

const formulario = document.getElementById('formularioLogin');
        const mensajeDiv = document.getElementById('mensaje');
        const btnIngresar = document.getElementById('btnIngresar');

        formulario.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue al enviar el formulario

            const emailIngresado = document.getElementById('email').value.trim();
            const claveIngresada = document.getElementById('clave').value.trim();

            // Deshabilitar el botón y mostrar mensaje de carga
            btnIngresar.disabled = true;
            mensajeDiv.textContent = "Verificando credenciales...";
            mensajeDiv.className = "";

            try {
                // 1. Descargar los datos desde el Google Sheet
                // Reemplazá el fetch simple por este:
                const respuesta = await fetch(urlAppScript, {
                    redirect: "follow" 
                });
                const usuarios = await respuesta.json();

                // 2. Buscar si existe una coincidencia exacta de mail y clave
                const usuarioValido = usuarios.find(
                    (usuario) => usuario.mail === emailIngresado && usuario.clave === claveIngresada
                );

                // 3. Evaluar el resultado
                if (usuarioValido) {
                    mensajeDiv.textContent = "¡Ingreso exitoso! Redirigiendo...";
                    mensajeDiv.className = "exito";
                    
                    // Redirigir a prode.html después de 1 segundo
                    setTimeout(() => {
                        window.location.href = 'prode.html';
                    }, 1000);
                    
                } else {
                    mensajeDiv.textContent = "Email o clave incorrectos.";
                    mensajeDiv.className = "error";
                    btnIngresar.disabled = false; // Vuelve a habilitar el botón
                }

            } catch (error) {
                console.error("Error:", error);
                mensajeDiv.textContent = "Hubo un error al conectar con la base de datos.";
                mensajeDiv.className = "error";
                btnIngresar.disabled = false;
            }
        });