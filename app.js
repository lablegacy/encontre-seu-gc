let mapa;

let marcadores = [];

let filtroAtual = "todos";

let localizacaoUsuario = null;

let localizacaoBusca = null;

let marcadorLocalizacao = null;


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
            ${gc.bairro}<br>
            ${gc.endereco}
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


        const pontoReferencia =
            localizacaoUsuario || localizacaoBusca;


        if (pontoReferencia) {

            const distancia =
                calcularDistancia(
                    pontoReferencia.lat,
                    pontoReferencia.lng,
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

                🏠 ${gc.endereco}<br>

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
                min-width:240px;
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

                <p>
                    🏠 ${gc.endereco}
                </p>

                <br>

                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
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


    /*
       Se a busca estiver vazia,
       mostra todos os GCs.
    */

    if (busca === "") {

        localizacaoBusca = null;

        mostrarGCs(
            filtrarPorDia(gcs)
        );

        return;
    }


    /*
       Primeiro tenta encontrar
       pelo nome ou bairro.
    */

    const resultadoDireto =
        filtrarPorDia(
            gcs.filter(gc => {

                return (

                    gc.nome
                        .toLowerCase()
                        .includes(busca)

                    ||

                    gc.bairro
                        .toLowerCase()
                        .includes(busca)

                );

            })
        );


    /*
       Se encontrou algum resultado,
       mostra normalmente.
    */

    if (resultadoDireto.length > 0) {

        localizacaoBusca = null;

        mostrarGCs(resultadoDireto);

        return;
    }


    /*
       Se não encontrou nenhum GC,
       não mostra "zero" imediatamente.
       A pessoa pode procurar o bairro
       apertando ENTER.
    */

    mostrarListaMensagem(`
        <h3>Buscar este bairro</h3>

        <div class="gc-info">
            Não encontramos um GC exatamente nesse bairro.
            <br><br>
            Pressione <strong>Enter</strong> para encontrar
            os GCs mais próximos.
        </div>
    `);

}


/* =========================
   FILTRAR POR DIA
========================= */

function filtrarPorDia(lista) {

    return lista.filter(gc => {

        return (
            filtroAtual === "todos"
            ||
            gc.dia === filtroAtual
        );

    });

}


/* =========================
   MENSAGEM NA LISTA
========================= */

function mostrarListaMensagem(conteudo) {

    const container =
        document.getElementById("gc-list");

    const contador =
        document.getElementById("total-gcs");


    contador.textContent = "";


    container.innerHTML = `

        <div class="gc-card">

            ${conteudo}

        </div>

    `;

}


/* =========================
   BUSCAR BAIRRO
========================= */

async function buscarBairro() {

    const input =
        document.getElementById("search");

    const busca =
        input.value.trim();


    if (busca.length < 2) {
        return;
    }


    mostrarListaMensagem(`
        <h3>Procurando...</h3>

        <div class="gc-info">
            Encontrando os GCs mais próximos de
            <strong>${busca}</strong>.
        </div>
    `);


    try {

        const url =
            `https://nominatim.openstreetmap.org/search?` +
            `format=jsonv2` +
            `q=${encodeURIComponent(
                busca + ", Ipatinga, Minas Gerais, Brasil"
            )}` +
            `&limit=5`;


        const resposta =
            await fetch(url, {
                headers: {
                    "Accept-Language": "pt-BR"
                }
            });


        if (!resposta.ok) {
            throw new Error("Erro na busca");
        }


        const resultados =
            await resposta.json();


        if (!resultados.length) {

            mostrarListaMensagem(`
                <h3>Bairro não encontrado</h3>

                <div class="gc-info">
                    Não conseguimos localizar
                    <strong>${busca}</strong>.
                    <br><br>
                    Tente escrever o nome completo do bairro.
                </div>
            `);

            return;
        }


        /*
           Preferimos resultados que estejam
           em Ipatinga ou Timóteo.
        */

        const resultadoLocal =
            resultados.find(resultado => {

                const nome =
                    resultado.display_name
                    .toLowerCase();

                return (
                    nome.includes("ipatinga")
                    ||
                    nome.includes("timóteo")
                );

            }) || resultados[0];


        localizacaoBusca = {

            lat:
                parseFloat(
                    resultadoLocal.lat
                ),

            lng:
                parseFloat(
                    resultadoLocal.lon
                )

        };


        /*
           Ordena os GCs pela distância
           até o bairro pesquisado.
        */

        const ordenados =
            filtrarPorDia(
                [...gcs].sort(
                    (a, b) => {

                        const distanciaA =
                            calcularDistancia(
                                localizacaoBusca.lat,
                                localizacaoBusca.lng,
                                a.latitude,
                                a.longitude
                            );


                        const distanciaB =
                            calcularDistancia(
                                localizacaoBusca.lat,
                                localizacaoBusca.lng,
                                b.latitude,
                                b.longitude
                            );


                        return (
                            distanciaA -
                            distanciaB
                        );

                    }
                )
            );


        /*
           Mostra os GCs no mapa.
        */

        mostrarGCs(ordenados);


        /*
           Centraliza o mapa no bairro pesquisado.
        */

        mapa.setView(
            [
                localizacaoBusca.lat,
                localizacaoBusca.lng
            ],
            13
        );


    } catch (erro) {

        console.error(erro);


        mostrarListaMensagem(`
            <h3>Não foi possível localizar o bairro</h3>

            <div class="gc-info">
                Tente novamente ou procure pelo nome
                de um GC.
            </div>
        `);

    }

}


/* =========================
   ENTER NA BUSCA
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const campoBusca =
            document.getElementById("search");


        campoBusca.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Enter"
                ) {

                    const busca =
                        campoBusca.value
                        .trim();


                    /*
                       Só faz a busca externa
                       quando não existe um
                       resultado direto.
                    */

                    const resultadoDireto =
                        filtrarPorDia(
                            gcs.filter(gc => {

                                return (

                                    gc.nome
                                        .toLowerCase()
                                        .includes(
                                            busca.toLowerCase()
                                        )

                                    ||

                                    gc.bairro
                                        .toLowerCase()
                                        .includes(
                                            busca.toLowerCase()
                                        )

                                );

                            })
                        );


                    if (
                        busca.length >= 2 &&
                        resultadoDireto.length === 0
                    ) {

                        buscarBairro();

                    }

                }

            }

        );

    }
);


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


            localizacaoBusca = null;


            mapa.setView(
                [
                    localizacaoUsuario.lat,
                    localizacaoUsuario.lng
                ],
                14
            );


            if (marcadorLocalizacao) {

                mapa.removeLayer(
                    marcadorLocalizacao
                );

            }


            marcadorLocalizacao =
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
        filtrarPorDia(
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


                    return (
                        distanciaA -
                        distanciaB
                    );

                }
            )
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
