let mapa;

let marcadores = [];

let filtroAtual = "todos";

let localizacaoUsuario = null;


/* =========================
   INICIAR MAPA
========================= */

function iniciarMapa() {

    mapa = L.map("map").setView(
        [-19.47, -42.52],
        12
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(mapa);


    mostrarGCs(gcs);
}


/* =========================
   MOSTRAR GCS
========================= */

function mostrarGCs(lista) {

    marcadores.forEach(
        marcador => mapa.removeLayer(marcador)
    );

    marcadores = [];


    lista.forEach(gc => {

        const marcador = L.marker([
            gc.latitude,
            gc.longitude
        ]).addTo(mapa);


        marcador.bindPopup(`
            <strong>${gc.nome}</strong><br>
            ${gc.dia} • ${gc.horario}<br>
            ${gc.bairro}
        `);


        marcador.on(
            "click",
            () => abrirGC(gc)
        );


        marcadores.push(marcador);

    });


    mostrarLista(lista);
}


/* =========================
   LISTA
========================= */

function mostrarLista(lista) {

    const container =
        document.getElementById("gc-list");

    const contador =
        document.getElementById("total-gcs");


    contador.textContent =
        `${lista.length} GC${lista.length !== 1 ? "s" : ""}`;


    container.innerHTML = "";


    if (lista.length === 0) {

        container.innerHTML = `
            <div class="gc-card">
                <h3>Nenhum GC encontrado</h3>

                <div class="gc-info">
                    Tente outro bairro ou dia.
                </div>
            </div>
        `;

        return;
    }


    lista.forEach(gc => {

        let distanciaHTML = "";


        if (localizacaoUsuario) {

            const distancia =
                calcularDistancia(
                    localizacaoUsuario.lat,
                    localizacaoUsuario.lng,
                    gc.latitude,
                    gc.longitude
                );


            distanciaHTML = `
                <div class="gc-distance">
                    ${distancia.toFixed(1)} km de você
                </div>
            `;
        }


        const card =
            document.createElement("div");

        card.className = "gc-card";


        card.innerHTML = `

            <h3>${gc.nome}</h3>

            <div class="gc-info">

                📅 ${gc.dia}<br>

                🕐 ${gc.horario}<br>

                📍 ${gc.bairro}<br>

                👥 ${gc.faixaEtaria}

            </div>

            ${distanciaHTML}

        `;


        card.onclick =
            () => abrirGC(gc);


        container.appendChild(card);

    });

}


/* =========================
   ABRIR GC
========================= */

function abrirGC(gc) {

    const url =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gc.endereco)}`;


    const popup =
        L.popup()
        .setLatLng([
            gc.latitude,
            gc.longitude
        ])
        .setContent(`

            <div style="
                min-width:220px;
                font-family:Arial;
            ">

                <h3 style="
                    margin:0 0 10px;
                ">
                    ${gc.nome}
                </h3>

                <p>
                    📅 ${gc.dia}
                </p>

                <p>
                    🕐 ${gc.horario}
                </p>

                <p>
                    👥 ${gc.faixaEtaria}
                </p>

                <p>
                    📍 ${gc.bairro}
                </p>

                <br>

                <a
                    href="${url}"
                    target="_blank"
                    style="
                        display:block;
                        text-align:center;
                        padding:10px;
                        background:#168cff;
                        color:white;
                        text-decoration:none;
                        border-radius:7px;
                        font-weight:bold;
                    "
                >
                    COMO CHEGAR
                </a>

            </div>

        `)
        .openOn(mapa);

}


/* =========================
   BUSCA
========================= */

function filtrarGCs() {

    const busca =
        document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();


    const resultado =
        gcs.filter(gc => {

            const correspondeBusca =
                gc.nome
                    .toLowerCase()
                    .includes(busca)

                ||

                gc.bairro
                    .toLowerCase()
                    .includes(busca);


            const correspondeDia =
                filtroAtual === "todos"

                ||

                gc.dia === filtroAtual;


            return correspondeBusca && correspondeDia;

        });


    mostrarGCs(resultado);

}


/* =========================
   FILTRO POR DIA
========================= */

function filtrarDia(dia, botao) {

    filtroAtual = dia;


    document
        .querySelectorAll(".filter")
        .forEach(
            b => b.classList.remove("active")
        );


    botao.classList.add("active");


    filtrarGCs();
}


/* =========================
   LOCALIZAÇÃO
========================= */

function usarMinhaLocalizacao() {

    if (!navigator.geolocation) {

        alert(
            "Seu navegador não permite acessar sua localização."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        posicao => {

            localizacaoUsuario = {

                lat:
                    posicao.coords.latitude,

                lng:
                    posicao.coords.longitude

            };


            mapa.setView(
                [
                    localizacaoUsuario.lat,
                    localizacaoUsuario.lng
                ],
                14
            );


            L.circleMarker(
                [
                    localizacaoUsuario.lat,
                    localizacaoUsuario.lng
                ],
                {
                    radius: 8,
                    color: "#168cff",
                    fillColor: "#168cff",
                    fillOpacity: 0.9
                }
            ).addTo(mapa);


            ordenarPorDistancia();

        },

        () => {

            alert(
                "Não foi possível acessar sua localização."
            );

        }

    );

}


/* =========================
   ORDENAR POR DISTÂNCIA
========================= */

function ordenarPorDistancia() {

    if (!localizacaoUsuario) {
        return;
    }


    const ordenados =
        [...gcs].sort(
            (a, b) => {

                const distanciaA =
                    calcularDistancia(
                        localizacaoUsuario.lat,
                        localizacaoUsuario.lng,
                        a.latitude,
                        a.longitude
                    );


                const distanciaB =
                    calcularDistancia(
                        localizacaoUsuario.lat,
                        localizacaoUsuario.lng,
                        b.latitude,
                        b.longitude
                    );


                return distanciaA - distanciaB;

            }
        );


    mostrarGCs(ordenados);

}


/* =========================
   CALCULAR DISTÂNCIA
========================= */

function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;


    const dLat =
        grausParaRad(
            lat2 - lat1
        );


    const dLon =
        grausParaRad(
            lon2 - lon1
        );


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(
            grausParaRad(lat1)
        )

        *

        Math.cos(
            grausParaRad(lat2)
        )

        *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;
}


function grausParaRad(graus) {

    return graus *
        (Math.PI / 180);

}


/* =========================
   IR PARA O MAPA
========================= */

function irParaMapa() {

    document
        .getElementById("map-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   INICIAR
========================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciarMapa
);
