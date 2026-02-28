google.charts.load('current', {
    'packages': ['geochart'],
    'mapsApiKey': '' // No se necesita clave para geochart simple
});

google.charts.setOnLoadCallback(inicializarMapa);

function inicializarMapa() {
    document.getElementById("idVerPorCarreras").addEventListener("change", dibujarMapa);
    document.getElementById("idVerPorInscripciones").addEventListener("change", dibujarMapa);
    dibujarMapa();
}

function dibujarMapa() {
    let tipo;
    if (document.getElementById("idVerPorCarreras").checked) {
        tipo = "carreras";
    } else {
        tipo = "inscripciones";
    }

    let conteo = contarPorDepartamento(tipo);

    if (Object.keys(conteo).length === 0) {
        document.getElementById('divMapa').innerHTML = "<p>No hay datos para mostrar.</p>";
        return;
    }

    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Departamento');
    data.addColumn('number', 'Cantidad');

    for (let i = 0; i < Object.entries(conteo).length; i++) {
        let entry = Object.entries(conteo)[i];
        let codigoISO = entry[0];
        let cantidad = entry[1];
        data.addRow([codigoISO, cantidad]);
    }

    let options = {
        region: 'UY',
        displayMode: 'regions',
        resolution: 'provinces',
        colorAxis: { colors: ['#e0f3f8', '#08306b'] },
        tooltip: { isHtml: true }
    };

    let contenedor = document.getElementById('divMapa');
    contenedor.innerHTML = "";
    let chart = new google.visualization.GeoChart(contenedor);
    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'regionClick', function(event) {
    let codigoISO = event.region; // ej: "UY-MO"
    let nombreLimpio = convertirCodigoADepartamento(codigoISO);
    let cantidad = conteo[codigoISO];
    if (!cantidad) cantidad = 0;
    alert("Departamento: " + nombreLimpio + "\nCantidad: " + cantidad);
    });

}


function contarPorDepartamento(tipo) {
    let mapaDepartamentos = {
        1: "UY-MO", 2: "UY-CA", 3: "UY-MA", 4: "UY-RO",
        5: "UY-TT", 6: "UY-CL", 7: "UY-RV", 8: "UY-AR",
        9: "UY-SA", 10: "UY-PA", 11: "UY-RN", 12: "UY-SO",
        13: "UY-CO", 14: "UY-SJ", 15: "UY-FS", 16: "UY-FD",
        17: "UY-LA", 18: "UY-DU", 19: "UY-TA"
    };

    let resultado = {};

    if (tipo === "carreras") {
        for (let carrera of sistema.listaCarreras) {
            let codigoISO = mapaDepartamentos[carrera.departamentoS];
            resultado[codigoISO] = (resultado[codigoISO] || 0) + 1;
        }
    } else {
        for (let inscripcion of sistema.listaInscripciones) {
            let carrera = sistema.listaCarreras.find(function(c) {
                return c.nombre === inscripcion.Icarreras;
            });
            if (carrera) {
                let codigoISO = mapaDepartamentos[carrera.departamentoS];
                resultado[codigoISO] = (resultado[codigoISO] || 0) + 1;
            }
        }
    }

    return resultado;
}


function convertirCodigoADepartamento(codigo) {
    let codigos = {
        "UY-AR": "Artigas",
        "UY-CA": "Canelones",
        "UY-CL": "Cerro Largo",
        "UY-CO": "Colonia",
        "UY-DU": "Durazno",
        "UY-FD": "Florida",
        "UY-FS": "Flores",
        "UY-LA": "Lavalleja",
        "UY-MA": "Maldonado",
        "UY-MO": "Montevideo",
        "UY-PA": "Paysandú",
        "UY-RN": "Río Negro",
        "UY-RV": "Rivera",
        "UY-RO": "Rocha",
        "UY-SA": "Salto",
        "UY-SJ": "San José",
        "UY-SO": "Soriano",
        "UY-TA": "Tacuarembó",
        "UY-TT": "Treinta y Tres"
    };
    return codigos[codigo] || codigo;
}
