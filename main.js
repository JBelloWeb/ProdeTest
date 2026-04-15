const supabaseUrl = 'https://juuwwrzrxensvjjzlpha.supabase.co';
const supabaseKey = 'sb_publishable_v38rCE76Ze5wCobL1uBT9Q_Vs_xxUmU';
window.supabaseClient = window.supabaseClient || window.supabase.createClient(supabaseUrl, supabaseKey);
const supabaseClient = window.supabaseClient;

const formulario = document.getElementById('formularioLogin');
const mensajeDiv = document.getElementById('mensaje');
const btnIngresar = document.getElementById('btnIngresar');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailIngresado = document.getElementById('email').value.trim();
    const claveIngresada = document.getElementById('clave').value.trim();

    btnIngresar.disabled = true;
    mensajeDiv.textContent = "Verificando credenciales...";
    mensajeDiv.className = "";

    try {
        // Le pedimos a Supabase que busque un usuario que coincida con email y clave
        const { data: usuarioEncontrado, error } = await supabaseClient
            .from('usuarios')
            .select('*')
            .eq('email', emailIngresado)
            .eq('clave', claveIngresada)
            .maybeSingle(); // maybeSingle devuelve 1 objeto o null si no existe

        if (error) throw error;

        // 1. Validamos si el usuario existe
        if (!usuarioEncontrado) {
            mensajeDiv.textContent = "Email o clave incorrectos.";
            mensajeDiv.className = "error";
            btnIngresar.disabled = false;
            return; // Cortamos la ejecución aquí
        }

        // 2. Validamos si ya jugó
        if (usuarioEncontrado.ya_participo === true) {
            mensajeDiv.textContent = "Acceso denegado: Ya enviaste tu pronóstico previamente.";
            mensajeDiv.className = "error";
            btnIngresar.disabled = false;
            return; // Cortamos la ejecución aquí
        }

        // 3. Éxito: Guardamos sus datos en el navegador para usarlos en el prode
        mensajeDiv.textContent = "¡Ingreso exitoso! Redirigiendo...";
        mensajeDiv.className = "exito";
        
        // Guardamos el ID y Nombre del usuario en el navegador
        localStorage.setItem('usuarioLogueado', JSON.stringify({
            id: usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre
        }));
        
        setTimeout(() => {
            window.location.href = 'prode.html';
        }, 1000);

    } catch (error) {
        console.error("Error:", error);
        mensajeDiv.textContent = "Hubo un error al conectar con la base de datos.";
        mensajeDiv.className = "error";
        btnIngresar.disabled = false;
    }
});