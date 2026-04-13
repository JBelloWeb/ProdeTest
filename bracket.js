
        document.addEventListener("DOMContentLoaded", () => {
    const bracketContainer = document.getElementById('mundial-bracket');
    
    // Grupos del Mundial 2026
    const grupos = {
        A: ["México", "Uruguay", "Panamá", "Jamaica"],
        B: ["España", "Holanda", "Chile", "Colombia"],
        C: ["Argentina", "Paraguay", "Perú", "Canadá"],
        D: ["Marruecos", "Croacia", "Bélgica", "Eslovaquia"],
        E: ["Francia", "Dinamarca", "Túnez", "Irán"],
        F: ["Brasil", "Suiza", "Camerún", "Serbia"],
        G: ["Portugal", "Hungría", "Turquía", "Uzbekistán"],
        H: ["Alemania", "Nueva Zelanda", "República Checa", "Polonia"],
        I: ["Japón", "Corea del Sur", "Australia", "India"],
        J: ["Tailandia", "Italia", "Ghana", "Marruecos"],
        K: ["Ensenada", "Kazajistán", "Emiratos Árabes", "Líbano"],
        L: ["Salvador", "Costa Rica", "Qatar", "Honduras"]
    };

    // Enfrentamientos de 16avos basados en la fase de grupos
    const enfrentamientos16avos = [
        { teamA: [...grupos.A, ...grupos.B], teamB: [...grupos.B, ...grupos.A] },
        { teamA: [...grupos.B, ...grupos.A], teamB: [...grupos.A, ...grupos.B] },
        { teamA: [...grupos.C, ...grupos.D], teamB: [...grupos.D, ...grupos.C] },
        { teamA: [...grupos.D, ...grupos.C], teamB: [...grupos.C, ...grupos.D] },
        { teamA: [...grupos.E, ...grupos.F], teamB: [...grupos.F, ...grupos.E] },
        { teamA: [...grupos.F, ...grupos.E], teamB: [...grupos.E, ...grupos.F] },
        { teamA: [...grupos.G, ...grupos.H], teamB: [...grupos.H, ...grupos.G] },
        { teamA: [...grupos.H, ...grupos.G], teamB: [...grupos.G, ...grupos.H] },
        { teamA: [...grupos.I, ...grupos.J], teamB: [...grupos.J, ...grupos.I] },
        { teamA: [...grupos.J, ...grupos.I], teamB: [...grupos.I, ...grupos.J] },
        { teamA: [...grupos.K, ...grupos.L], teamB: [...grupos.L, ...grupos.K] },
        { teamA: [...grupos.L, ...grupos.K], teamB: [...grupos.K, ...grupos.L] },
        { teamA: [...grupos.A, ...grupos.B], teamB: [...grupos.B, ...grupos.A] },
        { teamA: [...grupos.C, ...grupos.D], teamB: [...grupos.D, ...grupos.C] },
        { teamA: [...grupos.E, ...grupos.F], teamB: [...grupos.F, ...grupos.E] },
        { teamA: [...grupos.G, ...grupos.H], teamB: [...grupos.H, ...grupos.G] }
    ];

    // Obtener todos los paises
    const todosLoPaises = Object.values(grupos).flat();

    // Nombres de las rondas y cantidad de partidos por ronda (31 partidos en total)
    const rondasInfo = [
        { nombre: "16avos de Final", partidos: 16 },
        { nombre: "Octavos de Final", partidos: 8 },
        { nombre: "Cuartos de Final", partidos: 4 },
        { nombre: "Semifinales", partidos: 2 },
        { nombre: "Gran Final", partidos: 1 }
    ];

    let matchIdCounter = 1;

    // 1. GENERAR EL HTML DINÁMICAMENTE
    rondasInfo.forEach((ronda, index) => {
        const column = document.createElement('div');
        column.className = 'round-column';
        column.innerHTML = `<div class="round-title">${ronda.nombre}</div>`;

        for (let i = 0; i < ronda.partidos; i++) {
            // Solo la primera ronda permite seleccionar el país.
            // Las siguientes rondas son de solo lectura (se llenan solas).
            const isFirstRound = index === 0;

            let matchHTML = `
                <div class="match-card" data-match-id="${matchIdCounter}">
                    <div class="team-row">
            `;

            if (isFirstRound) {
                // Crear selects para 16avos
                const paises16 = enfrentamientos16avos[i];
                const pais1Options = [...new Set(paises16.teamA)].sort();
                const pais2Options = [...new Set(paises16.teamB)].sort();

                matchHTML += `
                        <select class="team-input team-A">
                            <option value="">Seleccionar País 1</option>
                            ${pais1Options.map(p => `<option value="${p}">${p}</option>`).join('')}
                        </select>
                        <input type="number" class="score-input score-A" min="0" placeholder="0">
                    </div>
                    <div class="team-row">
                        <select class="team-input team-B">
                            <option value="">Seleccionar País 2</option>
                            ${pais2Options.map(p => `<option value="${p}">${p}</option>`).join('')}
                        </select>
                `;
            } else {
                // Input readonly para otras rondas
                matchHTML += `
                        <input type="text" class="team-input team-A" readonly placeholder="Esperando...">
                        <input type="number" class="score-input score-A" min="0" placeholder="0">
                    </div>
                    <div class="team-row">
                        <input type="text" class="team-input team-B" readonly placeholder="Esperando...">
                `;
            }

            matchHTML += `
                        <input type="number" class="score-input score-B" min="0" placeholder="0">
                    </div>
                </div>
            `;
            column.insertAdjacentHTML('beforeend', matchHTML);
            matchIdCounter++;
        }
        bracketContainer.appendChild(column);
    });

    // 2. LÓGICA DE AVANCE AUTOMÁTICO
    // Función matemática para saber a qué partido va el ganador
    function getNextMatchId(currentId) {
        if (currentId <= 16) return Math.ceil(currentId / 2) + 16;
        if (currentId <= 24) return Math.ceil((currentId - 16) / 2) + 24;
        if (currentId <= 28) return Math.ceil((currentId - 24) / 2) + 28;
        if (currentId <= 30) return Math.ceil((currentId - 28) / 2) + 30;
        return null; // La final (31) no tiene siguiente partido
    }

    // Escuchamos cualquier cambio en los inputs usando Event Delegation
    bracketContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('score-input') || e.target.classList.contains('team-input')) {
            const matchCard = e.target.closest('.match-card');
            const currentId = parseInt(matchCard.dataset.matchId);
            
            const teamA = matchCard.querySelector('.team-A').value;
            const scoreA = parseInt(matchCard.querySelector('.score-A').value);
            const teamB = matchCard.querySelector('.team-B').value;
            const scoreB = parseInt(matchCard.querySelector('.score-B').value);

            // Determinar ganador
            let winner = "";
            if (!isNaN(scoreA) && !isNaN(scoreB) && teamA !== "" && teamB !== "") {
                if (scoreA > scoreB) winner = teamA;
                else if (scoreB > scoreA) winner = teamB;
                // Si hay empate, por ahora no avanza a nadie hasta que se defina
            }

            // Enviar ganador al siguiente partido
            const nextMatchId = getNextMatchId(currentId);
            if (nextMatchId && winner !== "") {
                const nextMatchCard = document.querySelector(`.match-card[data-match-id="${nextMatchId}"]`);
                
                // Si el ID actual es impar, el ganador va arriba (Team A). Si es par, va abajo (Team B).
                if (currentId % 2 !== 0) {
                    nextMatchCard.querySelector('.team-A').value = winner;
                } else {
                    nextMatchCard.querySelector('.team-B').value = winner;
                }
            }
        }
    });

    // 3. EMPAQUETAR DATOS PARA APPS SCRIPT ANTES DE ENVIAR
    const form = document.querySelector('form');
    if(form) {
        form.addEventListener('submit', () => {
            const allMatches = [];
            document.querySelectorAll('.match-card').forEach(card => {
                allMatches.push({
                    id: card.dataset.matchId,
                    equipoA: card.querySelector('.team-A').value,
                    golesA: card.querySelector('.score-A').value,
                    equipoB: card.querySelector('.team-B').value,
                    golesB: card.querySelector('.score-B').value
                });
            });
            
            // Transformamos todo el torneo a texto JSON y lo metemos al input oculto
            document.getElementById('bracket_data').value = JSON.stringify(allMatches);
        });
    }
});