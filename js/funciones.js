 //Bruno Barcelona 348862 y Rodrigo Carrion 334254
window.addEventListener("load", inicio);

let sistema = new Sistema();

function inicio() {
    document.getElementById("btnAgregarCarrera").addEventListener("click", agregarCarrera);
    document.getElementById("btnInscribir").addEventListener("click", inscribir);
    document.getElementById("btnAgregarCorredor").addEventListener("click", agregarCorredor);
    document.getElementById("btnPatrocinador").addEventListener("click", agregarPatrocinador);
    document.getElementById("btnDatos").addEventListener("click", mostrarDatos);
    document.getElementById("btnEstadistica").addEventListener("click", mostrarEstadisticas);
    document.getElementById("idOrdenarNombre").addEventListener("change", mostrarInscriptos);
    document.getElementById("idOrdenarNumero").addEventListener("change", mostrarInscriptos);
    document.getElementById("idInscriptosCarrera").addEventListener("change", mostrarInscriptos);
}

function mostrarDatos() {
    document.getElementById("idDatos").style.display = "block";
    document.getElementById("idEstadisticas").style.display = "none";
    document.getElementById("btnDatos").className = "btnActivo";
    document.getElementById("btnEstadistica").className = "btnInactivo";
}

function mostrarEstadisticas() {
    document.getElementById("idDatos").style.display = "none";
    document.getElementById("idEstadisticas").style.display = "block";
    document.getElementById("btnDatos").className = "btnInactivo";
    document.getElementById("btnEstadistica").className = "btnActivo";
    mostrarPromedioInscriptosPorCarrera();
    mostrarCarrerasMasInscriptos();
    mostrarCarrerasSinInscriptosOrdenadas();
    mostrarPorcentajeElite();
    mostrarInscriptos();
    dibujarMapa();
}

function mostrarPorcentajeElite() {
    let porcentaje = sistema.promedioCorredoresElite();
    document.getElementById("pjCorredoresElite").innerHTML = porcentaje;
}

function actualizarComboCarreras() {
    let select = document.getElementById("idCarrerasInscripcion");
    select.innerHTML = "";
    let carrerasOrdenadas = sistema.ordenarListaCarreras();

    for (let carrera of carrerasOrdenadas) {
        let option = document.createElement("option");
        option.text = carrera.nombre;
        option.value = carrera.nombre;
        select.appendChild(option);
    }
}

function actualizarComboCarrerasInscripcion() {
    let select = document.getElementById("idInscriptosCarrera");
    select.innerHTML = "";

    let carrerasOrdenadas = sistema.ordenarListaCarreras();

    for (let carrera of carrerasOrdenadas) {
        let tieneInscriptos = false;

        for (let i = 0; i < sistema.listaInscripciones.length; i++) {
            if (sistema.listaInscripciones[i].Icarreras === carrera.nombre) {
                tieneInscriptos = true;
                break;
            }
        }

        if (tieneInscriptos) {
            let option = document.createElement("option");
            option.text = carrera.nombre;
            option.value = carrera.nombre;
            select.appendChild(option);
        }
    }
}

function actualizarListaCorredores() {
    let select = document.getElementById("idCorredoresInscripcion");
    select.innerHTML = "";
    let corredoresOrdenados = sistema.ordenarListaCorredores();

    for (let corredor of corredoresOrdenados) {
        let option = document.createElement("option");
        option.text = corredor.nombreC + " (CI: " + corredor.cedula + ")";
        option.value = corredor.nombreC;
        select.appendChild(option);
    }
}

function actualizarListaCarrerasP() {
    let select = document.getElementById("idCarrerasAPatrocinar");
    select.innerHTML = "";
    let carrerasOrdenadas = sistema.ordenarListaCarreras();

    for (let carrera of carrerasOrdenadas) {
        let option = document.createElement("option");
        option.text = carrera.nombre;
        option.value = carrera.nombre;
        select.appendChild(option);
    }
}

function limpiar() {
    document.getElementById("idFormCarreras").reset();
    document.getElementById("idFormCorredores").reset();
    document.getElementById("idFormPatrocinadores").reset();
    document.getElementById("idFormInscripciones").reset();

    actualizarComboCarreras();
    actualizarComboCarrerasInscripcion();
    actualizarListaCorredores();
    actualizarListaCarrerasP();
}

function agregarCarrera() {
    let formulario = document.getElementById("idFormCarreras");
    if (formulario.reportValidity()) {
        let nombre = document.getElementById("idNombreCarrera").value;
        let departamentoSelect = document.getElementById("idDepartamento");
        let departamento = departamentoSelect.options[departamentoSelect.selectedIndex].text;
        let departamentoS = departamentoSelect.options[departamentoSelect.selectedIndex].value;

        let fecha = document.getElementById("idFecha").value;
        let cupo = document.getElementById("idCupo").value;
        let existe = false;
        for (let i = 0; i < sistema.listaCarreras.length; i++) {
            if (sistema.listaCarreras[i].nombre.toLowerCase() === nombre.toLowerCase()) {
                existe = true;
                break;
            }
        }
        if (existe) {
            alert("La carrera ya existe");
        } else {
            let nuevaCarrera = new Carrera(nombre, departamento, departamentoS, fecha, cupo);
            sistema.agregarCarrera(nuevaCarrera);
            actualizarComboCarreras();
            actualizarComboCarrerasInscripcion();
            actualizarListaCarrerasP();
            dibujarMapa();
        }
        limpiar();
    }
}

function agregarCorredor() {
    let formulario = document.getElementById("idFormCorredores");
    if (formulario.reportValidity()) {
        let nombreC = document.getElementById("idNombreCorredor").value;
        let cedula = document.getElementById("idCedula").value;
        let edad = document.getElementById("idEdadCorredor").value;
        let fechaVenc = document.getElementById("idFichaMedica").value;
        let tipo = "";
        if (document.getElementById("idCorredorElite").checked) {
            tipo = "elite";
        } else if (document.getElementById("idCorredorComun").checked) {
            tipo = "común";
        }
        let cedulaExistente = false;
        for (let i = 0; i < sistema.listaCorredores.length; i++) {
            if (sistema.listaCorredores[i].cedula === cedula) {
                cedulaExistente = true;
                break;
            }
        }
        if (cedulaExistente) {
            alert("Ya existe un corredor con esa cédula.");
        } else {
            let nuevoCorredor = new Corredores(nombreC, edad, cedula, fechaVenc, tipo);
            sistema.agregarCorredor(nuevoCorredor);
            actualizarListaCorredores();
            limpiar();
        }
    }
}

function agregarPatrocinador() {
    let formulario = document.getElementById("idFormPatrocinadores");
    if (formulario.reportValidity()) {
        let nombreP = document.getElementById("idNombrePatrocinador").value;
        let rubro = document.getElementById("idRubro").value;
        let carrerasSelect = document.getElementById("idCarrerasAPatrocinar");
        let carrerasSeleccionadas = [];
        let opcionesSeleccionadas = carrerasSelect.options;
        for (let i = 0; i < opcionesSeleccionadas.length; i++) {
            if (opcionesSeleccionadas[i].selected) {
                carrerasSeleccionadas.push(opcionesSeleccionadas[i].value);
            }
        }
        if (carrerasSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una carrera");
            return;
        }
        let patrocinadorExistente = null;
        for (let i = 0; i < sistema.listaPatrocinadores.length; i++) {
            if (sistema.listaPatrocinadores[i].nombreP === nombreP) {
                patrocinadorExistente = sistema.listaPatrocinadores[i];
                break;
            }
        }

        if (patrocinadorExistente !== null) {
            patrocinadorExistente.rubro = rubro;
            // Limpiar la lista de carreras existente y reemplazar con las nuevas
            patrocinadorExistente.carrerasP = [];
            for (let i = 0; i < carrerasSeleccionadas.length; i++) {
                patrocinadorExistente.asociarCarrera(carrerasSeleccionadas[i]);
            }
        } else {
            let nuevoPatrocinador = new Patrocinador(nombreP, rubro);
            for (let i = 0; i < carrerasSeleccionadas.length; i++) {
                nuevoPatrocinador.asociarCarrera(carrerasSeleccionadas[i]);
            }
            sistema.agregarPatrocinador(nuevoPatrocinador);
        }
        formulario.reset();
    }
}

function inscribir() {
    let formulario = document.getElementById("idFormInscripciones");
    if (formulario.reportValidity()) {
        let nombreCorredorSeleccionado = document.getElementById("idCorredoresInscripcion").value;
        let nombreCarreraSeleccionada = document.getElementById("idCarrerasInscripcion").value;

        let corredorInscripcion = null;
        for (let i = 0; i < sistema.listaCorredores.length; i++) {
            if (sistema.listaCorredores[i].nombreC === nombreCorredorSeleccionado) {
                corredorInscripcion = sistema.listaCorredores[i];
                break;
            }
        }

        let carreraInscripcion = null;
        for (let i = 0; i < sistema.listaCarreras.length; i++) {
            if (sistema.listaCarreras[i].nombre === nombreCarreraSeleccionada) {
                carreraInscripcion = sistema.listaCarreras[i];
                break;
            }
        }

        let mostrarError = false;
        let mensajeError = "";

        if (!corredorInscripcion || !carreraInscripcion) {
            mostrarError = true;
            mensajeError = "Por favor, selecciona un corredor y una carrera válidos.";
        }

        let fechaVencimientoFicha = null;
        let fechaCarrera = null;
        if (!mostrarError) {
            fechaVencimientoFicha = new Date(corredorInscripcion.fechaVenc);
            fechaCarrera = new Date(carreraInscripcion.fecha);
            if (fechaVencimientoFicha < fechaCarrera) {
                mostrarError = true;
                mensajeError = "La ficha médica del corredor no está vigente para la fecha de la carrera.";
            }
        }

        if (!mostrarError) {
            let inscripcionesEnEstaCarrera = 0;
            for (let i = 0; i < sistema.listaInscripciones.length; i++) {
                if (sistema.listaInscripciones[i].Icarreras === carreraInscripcion.nombre) {
                    inscripcionesEnEstaCarrera++;
                }
            }
            if (inscripcionesEnEstaCarrera >= carreraInscripcion.cupo) {
                mostrarError = true;
                mensajeError = "No hay cupo disponible en la carrera seleccionada.";
            }
        }

        if (!mostrarError) {
            let yaInscripto = false;
            for (let i = 0; i < sistema.listaInscripciones.length; i++) {
                if (sistema.listaInscripciones[i].Icorredores === corredorInscripcion.nombreC &&
                    sistema.listaInscripciones[i].Icarreras === carreraInscripcion.nombre) {
                    yaInscripto = true;
                    break;
                }
            }
            if (yaInscripto) {
                mostrarError = true;
                mensajeError = "El corredor ya está inscripto en esta carrera.";
            }
        }

        if (mostrarError) {
            alert(mensajeError);
        } else {
            let nuevaInscripcion = new Inscripcion(corredorInscripcion.nombreC, carreraInscripcion.nombre);

            // Calcular el número consecutivo para esta carrera
            let numeroConsecutivo = 1;
            for (let i = 0; i < sistema.listaInscripciones.length; i++) {
                if (sistema.listaInscripciones[i].Icarreras === carreraInscripcion.nombre) {
                    numeroConsecutivo++;
                }
            }
            nuevaInscripcion.numeroInscripcion = numeroConsecutivo;

            sistema.agregarInscripcion(nuevaInscripcion);
            dibujarMapa();
            limpiar();
            mostrarInscripciones();
            generarYGuardarPDFinscripciones();
        }
    }
}

function mostrarInscripciones() {
    let mensaje = "";

    let insc = sistema.listaInscripciones[sistema.listaInscripciones.length - 1];

    let corredor = null;
    for (let i = 0; i < sistema.listaCorredores.length; i++) {
        if (sistema.listaCorredores[i].nombreC === insc.Icorredores) {
            corredor = sistema.listaCorredores[i];
            break;
        }
    }

    let carrera = null;
    for (let i = 0; i < sistema.listaCarreras.length; i++) {
        if (sistema.listaCarreras[i].nombre === insc.Icarreras) {
            carrera = sistema.listaCarreras[i];
            break;
        }
    }

    if (corredor && carrera) {
        mensaje += " Número: " + insc.numeroInscripcion + "\n";
        mensaje += " Nombre: " + corredor.nombreC + " ";
        mensaje +=  corredor.edad + " años, ";
        mensaje += " CI: " + corredor.cedula;
        mensaje += " Ficha Médica: " + corredor.fechaVenc + "\n";
        mensaje += corredor.tipo + "\n";
        mensaje += " Carrera: " + carrera.nombre + " en " + carrera.departamento + " el " + carrera.fecha + " Cupo: " + carrera.cupo + "\n";

        for (let p of sistema.listaPatrocinadores) {
            for (let nombreCarrera of p.carrerasP) {
                if (nombreCarrera === carrera.nombre) {
                    mensaje += p.nombreP + " (" + p.rubro + ")\n";
                }
            }
        }
    }
    alert(mensaje);
}

function mostrarPromedioInscriptosPorCarrera() {
    let promedio = sistema.promedioInscriptosPorCarrera();
    document.getElementById("idPromedioPorCarrera").innerText = promedio;
}

function mostrarCarrerasMasInscriptos() {
    let lista = document.getElementById("idListaMasInscriptos");
    lista.innerHTML = "";

    let carreras = sistema.carrerasConMasInscriptos();

    if (typeof carreras == "string") {
        let nodo = document.createElement("li");
        nodo.textContent = carreras;
        lista.appendChild(nodo);
    } else {
        for (let elem of carreras) {
            let carrera = elem.carrera;
            let cantidad = elem.cantidad;

            let nodo = document.createElement("li");
            nodo.textContent = carrera.nombre  + " en " + carrera.departamento  + " el " + carrera.fecha + " Cupo: " + carrera.cupo + " inscriptos: " + cantidad;
            lista.appendChild(nodo);
        }
    }
}

function mostrarCarrerasSinInscriptosOrdenadas() {
    let lista = document.getElementById("idListaSinInscriptos");
    lista.innerHTML = "";

    let carreras = sistema.carrerasSinInscriptosOrdenadas();

    if (carreras.length === 0) {
        let nodo = document.createElement("li");
        nodo.textContent = "sin datos";
        lista.appendChild(nodo);
    } else {
        for (let carrera of carreras) {
            let nodo = document.createElement("li");
            nodo.textContent = carrera.nombre + " en " + carrera.departamento + " el " + carrera.fecha + " Cupo: " + carrera.cupo;
            lista.appendChild(nodo);
        }
    }
}

function mostrarInscriptos() {
    let selectCarrera = document.getElementById("idInscriptosCarrera");
    let carreraSeleccionada = selectCarrera.value;
    let tbody = document.getElementById("idTablaInscriptos").getElementsByTagName("tbody")[0]
    tbody.innerHTML = "";

    if (carreraSeleccionada === "" || carreraSeleccionada === null) {
        return; // No hacer nada si no hay carrera seleccionada
    }

    // Buscar inscripciones de la carrera seleccionada
    let inscripcionesCarrera = sistema.listaInscripciones.filter(insc => insc.Icarreras === carreraSeleccionada);

    if (inscripcionesCarrera.length === 0) {
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.colSpan = 5;
        celda.textContent = "No hay inscriptos para esta carrera.";
        fila.appendChild(celda);
        tbody.appendChild(fila);
        return;
    }

    // Determinar criterio de orden
    let ordenarPorNombre = document.getElementById("idOrdenarNombre").checked;
    let criterio = ordenarPorNombre ? "nombre" : "numero";

    // Usar método de Sistema para ordenar inscripciones
    sistema.ordenarInscripciones(inscripcionesCarrera, criterio);

    // Llenar la tabla con los inscriptos ordenados
    for (let i = 0; i < inscripcionesCarrera.length; i++) {
        let inscripcion = inscripcionesCarrera[i];
        let corredor = sistema.listaCorredores.find(c => c.nombreC === inscripcion.Icorredores);

        if (corredor !== null) {
            let fila = document.createElement("tr");

            if (corredor.tipo === "elite") {
                fila.style.backgroundColor = "red";
            }

            let celdaNombre = document.createElement("td");
            celdaNombre.textContent = corredor.nombreC;
            fila.appendChild(celdaNombre);

            let celdaEdad = document.createElement("td");
            celdaEdad.textContent = corredor.edad;
            fila.appendChild(celdaEdad);

            let celdaCedula = document.createElement("td");
            celdaCedula.textContent = corredor.cedula;
            fila.appendChild(celdaCedula);

            let celdaFicha = document.createElement("td");
            celdaFicha.textContent = corredor.fechaVenc;
            fila.appendChild(celdaFicha);

            let celdaNumero = document.createElement("td");
            celdaNumero.textContent = inscripcion.numeroInscripcion;
            fila.appendChild(celdaNumero);

            tbody.appendChild(fila);
        }
    }
}










