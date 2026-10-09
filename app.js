
let mapa;
let marcadores = [];
let filtroDia = "Todos";
window.localizacaoBusca = null;

// ========================================
// BAIRROS / REGIÕES DE IPATINGA
// ========================================

const bairros = [
    { nome: "Cariru", latitude: -19.4908, longitude: -42.5380 },
    { nome: "Castelo", latitude: -19.4870, longitude: -42.5410 },
    { nome: "Vila Ipanema", latitude: -19.4810, longitude: -42.5480 },
    { nome: "Bairro das Águas", latitude: -19.4860, longitude: -42.5500 },
    { nome: "Bela Vista", latitude: -19.4940, longitude: -42.5580 },
    { nome: "Bom Retiro", latitude: -19.5000, longitude: -42.5580 },
    { nome: "Imbaúbas", latitude: -19.5050, longitude: -42.5650 },
    { nome: "Areal", latitude: -19.5030, longitude: -42.5680 },
    { nome: "Horto", latitude: -19.5055, longitude: -42.5713 },
    { nome: "Santa Mônica", latitude: -19.5080, longitude: -42.5670 },
    { nome: "Usipa", latitude: -19.5100, longitude: -42.5750 },
    { nome: "Iguaçu", latitude: -19.4710, longitude: -42.5620 },
    { nome: "Ferroviários", latitude: -19.4830, longitude: -42.5571 },
    { nome: "Ideal", latitude: -19.4703, longitude: -42.5667 },
    { nome: "Cidade Nobre", latitude: -19.4645, longitude: -42.5587 },
    { nome: "Vila da Paz", latitude: -19.4620, longitude: -42.5600 },
    { nome: "Alto Iguaçu", latitude: -19.4580, longitude: -42.5650 },
    { nome: "Game", latitude: -19.4580, longitude: -42.5650 },
    { nome: "Centro", latitude: -19.4786, longitude: -42.5252 },
    { nome: "Novo Cruzeiro", latitude: -19.4731, longitude: -42.5379 },
    { nome: "Veneza I", latitude: -19.4700, longitude: -42.5290 },
    { nome: "Veneza II", latitude: -19.4655, longitude: -42.5250 },
    { nome: "Morro do Sossego", latitude: -19.4640, longitude: -42.5280 },
    { nome: "Planalto I", latitude: -19.4590, longitude: -42.5310 },
    { nome: "Planalto II", latitude: -19.4580, longitude: -42.5280 },
    { nome: "Caravelas", latitude: -19.4588, longitude: -42.5354 },
    { nome: "Jardim Panorama", latitude: -19.4652, longitude: -42.5404 },
    { nome: "Caçula", latitude: -19.4630, longitude: -42.5380 },
    { nome: "Parque das Águas", latitude: -19.4600, longitude: -42.5290 },
    { nome: "Canaã", latitude: -19.4512, longitude: -42.5511 },
    { nome: "Canaãzinho", latitude: -19.4530, longitude: -42.5480 },
    { nome: "Vila Celeste", latitude: -19.4515, longitude: -42.5620 },
    { nome: "Vale do Sol", latitude: -19.4530, longitude: -42.5670 },
    { nome: "Vista Alegre", latitude: -19.4480, longitude: -42.5650 },
    { nome: "Forquilha", latitude: -19.4420, longitude: -42.5740 },
    { nome: "Chácaras Oliveira", latitude: -19.4430, longitude: -42.5780 },
    { nome: "Bairro das Fontes", latitude: -19.4470, longitude: -42.5610 },
    { nome: "Jardim Santa Clara", latitude: -19.4490, longitude: -42.5580 },
    { nome: "Bethânia", latitude: -19.4355, longitude: -42.5530 },
    { nome: "Taúbas", latitude: -19.4280, longitude: -42.5550 },
    { nome: "Tiradentes", latitude: -19.4310, longitude: -42.5480 },
    { nome: "Morro São Francisco", latitude: -19.4240, longitude: -42.5520 },
    { nome: "Morro do Cruzeiro", latitude: -19.4290, longitude: -42.5600 },
    { nome: "Vila Militar", latitude: -19.4310, longitude: -42.5610 },
    { nome: "Alto Boa Vista", latitude: -19.4260, longitude: -42.5450 },
    { nome: "Granjas Vagalume", latitude: -19.4200, longitude: -42.5400 },
    { nome: "Esperança", latitude: -19.4640, longitude: -42.5780 },
    { nome: "Nova Esperança", latitude: -19.4600, longitude: -42.5820 },
    { nome: "Bom Jardim", latitude: -19.4788, longitude: -42.5802 },
    { nome: "Serra Dourada", latitude: -19.4840, longitude: -42.5840 },
    { nome: "Limoeiro", latitude: -19.4528, longitude: -42.5869 },
    { nome: "Chácaras Madalena", latitude: -19.4480, longitude: -42.5950 },
    { nome: "Barra Alegre", latitude: -19.4380, longitude: -42.6000 },
    { nome: "Córrego Novo", latitude: -19.4250, longitude: -42.6000 },
    { nome: "Recanto", latitude: -19.4200, longitude: -42.5950 },
    { nome: "Vila Formosa", latitude: -19.4400, longitude: -42.5900 },
    { nome: "Pedra Branca", latitude: -19.3900, longitude: -42.6200 },
    { nome: "Tribuna", latitude: -19.3700, longitude: -42.6400 },
    { nome: "Ipaneminha", latitude: -19.4100, longitude: -42.6500 },
    { nome: "Morro Escuro", latitude: -19.4000, longitude: -42.6300 },
    { nome: "Ipanemão", latitude: -19.3950, longitude: -42.6450 }
];

// ========================================
// INICIAR MAPA
// ========================================

function iniciarMapa() {
    mapa = L.map("map").setView([-19.4700, -42.5600], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapa);

    mostrarGCs(gcs);
}

// ========================================
// CALCULAR DISTÂNCIA
// ========================================

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// ========================================
// FILTRAR POR DIA
// ========================================

function filtrarPorDia(lista) {
    if (filtroDia === "Todos") return lista;

    return lista.filter(gc => {
        const dia = normalizarTexto(gc.dia);

        if (filtroDia === "Seg") return dia.includes("segunda");
        if (filtroDia === "Qui") return dia.includes("quinta");
        if (filtroDia === "Sex") return dia.includes("sexta");
        if (filtroDia === "Sáb") return dia.includes("sabado");

        return true;
    });
}

// ========================================
// MOSTRAR GCS E MARCADORES
// ========================================

function mostrarGCs(lista, somenteMaisProximo = false) {
    const listaElemento = document.getElementById("gc-list");
    const totalElemento = document.getElementById("total-gcs");

    listaElemento.innerHTML = "";

    if (totalElemento) {
        totalElemento.textContent = `${lista.length} GC${lista.length === 1 ? "" : "s"}`;
    }

    marcadores.forEach(marcador => mapa.removeLayer(marcador));
    marcadores = [];

    if (lista.length === 0) {
        listaElemento.innerHTML = `
            <div class="gc-empty">
                <h3>Nenhum GC encontrado</h3>
                <p>Tente outro bairro ou altere o filtro de dia.</p>
            </div>
        `;
        return;
    }

    lista.forEach((gc, index) => {
        let distanciaTexto = "";

        if (window.localizacaoBusca) {
            const distancia = calcularDistancia(
                window.localizacaoBusca.latitude,
                window.localizacaoBusca.longitude,
                gc.latitude,
                gc.longitude
            );

            distanciaTexto = `
                <div class="gc-distance">
                    📍 ${distancia.toFixed(1)} km de distância
                </div>
            `;
        }

        const card = document.createElement("div");
        card.className = "gc-card";

        if (somenteMaisProximo && index === 0) {
            card.classList.add("gc-mais-proximo");
        }

        card.innerHTML = `
            <h3>${gc.nome}</h3>
            <div class="gc-info">
                📍 ${gc.bairro}<br>
                📅 ${gc.dia} às ${gc.horario}<br>
                👥 ${gc.faixaEtaria}<br>
                🏠 ${gc.endereco}
            </div>
            ${distanciaTexto}
            <button class="route-button"
                onclick="abrirRota(${gc.latitude}, ${gc.longitude})">
                Como chegar
            </button>
        `;

        listaElemento.appendChild(card);

        // Em pesquisa por bairro, exibe somente o marcador do GC mais próximo.
        if (!somenteMaisProximo || index === 0) {
            const marcador = L.marker([gc.latitude, gc.longitude])
                .addTo(mapa)
                .bindPopup(`
                    <strong>${gc.nome}</strong><br>
                    ${gc.bairro}<br>
                    ${gc.dia} às ${gc.horario}<br>
                    ${gc.faixaEtaria}<br><br>
                    🏠 ${gc.endereco}
                `);

            marcadores.push(marcador);
        }
    });
}

// ========================================
// PESQUISA POR GC OU BAIRRO
// ========================================

function filtrarGCs() {
    const campo = document.getElementById("search");
    const busca = normalizarTexto(campo.value);

    if (busca === "") {
        window.localizacaoBusca = null;
        mostrarGCs(filtrarPorDia(gcs));
        mapa.setView([-19.4700, -42.5600], 12);
        return;
    }

    // Primeiro, procura GCs diretamente pelo nome ou bairro.
    const resultadoDireto = filtrarPorDia(
        gcs.filter(gc =>
            normalizarTexto(gc.nome).includes(busca) ||
            normalizarTexto(gc.bairro).includes(busca)
        )
    );

    if (resultadoDireto.length > 0) {
        window.localizacaoBusca = null;
        mostrarGCs(resultadoDireto);
        return;
    }

    // Depois, procura a referência do bairro.
    const bairroEncontrado = bairros.find(bairro =>
        normalizarTexto(bairro.nome).includes(busca)
    );

    if (!bairroEncontrado) {
        marcadores.forEach(marcador => mapa.removeLayer(marcador));
        marcadores = [];

        document.getElementById("gc-list").innerHTML = `
            <div class="gc-empty">
                <h3>Bairro não encontrado</h3>
                <p>Tente pesquisar pelo nome completo do bairro.</p>
            </div>
        `;

        const totalElemento = document.getElementById("total-gcs");
        if (totalElemento) totalElemento.textContent = "0 GCs";
        return;
    }

    window.localizacaoBusca = bairroEncontrado;

    const ordenados = [...filtrarPorDia(gcs)].sort((a, b) => {
        const distanciaA = calcularDistancia(
            bairroEncontrado.latitude,
            bairroEncontrado.longitude,
            a.latitude,
            a.longitude
        );

        const distanciaB = calcularDistancia(
            bairroEncontrado.latitude,
            bairroEncontrado.longitude,
            b.latitude,
            b.longitude
        );

        return distanciaA - distanciaB;
    });

    mostrarGCs(ordenados, true);

    mapa.setView([
        ordenados[0]?.latitude ?? bairroEncontrado.latitude,
        ordenados[0]?.longitude ?? bairroEncontrado.longitude
    ], 13);
}

// ========================================
// FILTROS DOS DIAS
// Compatível com os onclick do index.html
// ========================================

function filtrarDia(dia, botao) {
    const dias = {
        "todos": "Todos",
        "Segunda-feira": "Seg",
        "Quinta-feira": "Qui",
        "Sexta-feira": "Sex",
        "Sábado": "Sáb"
    };

    filtroDia = dias[dia] || "Todos";

    document.querySelectorAll(".filters .filter").forEach(item => {
        item.classList.remove("active");
    });

    if (botao) botao.classList.add("active");

    if (document.getElementById("search").value.trim() !== "") {
        filtrarGCs();
    } else {
        window.localizacaoBusca = null;
        mostrarGCs(filtrarPorDia(gcs));
    }
}

// ========================================
// BOTÃO ENCONTRAR MEU GC
// ========================================

function irParaMapa() {
    const secaoMapa = document.getElementById("map-section");

    if (secaoMapa) {
        secaoMapa.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// ========================================
// COMO CHEGAR
// ========================================

function abrirRota(latitude, longitude) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
}

// ========================================
// USAR MINHA LOCALIZAÇÃO
// ========================================

function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
        alert("Seu navegador não permite acessar sua localização.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        posicao => {
            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;

            window.localizacaoBusca = { latitude, longitude };

            const ordenados = [...filtrarPorDia(gcs)].sort((a, b) => {
                const distanciaA = calcularDistancia(
                    latitude, longitude, a.latitude, a.longitude
                );

                const distanciaB = calcularDistancia(
                    latitude, longitude, b.latitude, b.longitude
                );

                return distanciaA - distanciaB;
            });

            mostrarGCs(ordenados);

            mapa.setView([latitude, longitude], 13);
        },
        () => {
            alert("Não foi possível acessar sua localização. Confira as permissões do navegador.");
        }
    );
}

// ========================================
// INICIAR SITE
// ========================================

document.addEventListener("DOMContentLoaded", iniciarMapa);
