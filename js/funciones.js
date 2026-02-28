window.addEventListener("load", inicio);

let sistema = new Sistema();

function inicio() {
    document.getElementById("btnAgregarCarrera").addEventListener("click", agregarCarrera);
    document.getElementById("btnInscribir").addEventListener("click", inscribir);
    document.getElementById("btnAgregarCorredor").addEventListener("click", agregarCorredor);
    document.getElementById("btnPatrocinador").addEventListener("click", agregarPatrocinador);
    document.getElementById("btnDatos").addEventListener("click", mostrarDatos);
    document.getElementById("btnEstadistica").addEventListener("click", mostrarEstadisticas);
}

function agregarCarrera() {
    let formulario = document.getElementById("idFormCarreras");
    if (formulario.reportValidity()) {
        let nombre = document.getElementById("idNombreCarrera").value;
        let departamento = document.getElementById("idDepartamento").value;
        let fecha = document.getElementById("idFecha").value;
        let cupo = document.getElementById("idCupo").value;
        let existe = false;
        for (let i = 0; i < sistema.listaCarreras.length; i++) {
            if (sistema.listaCarreras[i].nombre === nombre) {
                existe = true;
                break;
            }
        }
        if (existe) {
            alert("La carrera ya existe");
        } else {
            let nuevaCarrera = new Carrera(nombre, departamento, fecha, cupo);
            sistema.agregarCarrera(nuevaCarrera);
            actualizarListaCarreras();
            actualizarListaCarrerasP();
        }
        formulario.reset();
    }
}

function agregarCorredor() {
    let formulario = document.getElementById("idFormCorredores")
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
            formulario.reset()
        }
    }
}

function agregarPatrocinador() {
    let formulario = document.getElementById("idFormPatrocinadores");
    if (formulario.reportValidity()) {
        let nombreP = document.getElementById("idNombrePatrocinador").value;
        let rubro = document.getElementById("idRubro").value;
        let carrerasSelect = document.getElementById("idDepartamentoCarreras");
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
        let patrocinadorExistente;
        for (let i = 0; i < sistema.listaPatrocinadores.length; i++) {
            if (sistema.listaPatrocinadores[i].nombreP === nombreP) {
                patrocinadorExistente = sistema.listaPatrocinadores[i];
        
                break;
            }
        }

        if (patrocinadorExistente) {
            patrocinadorExistente.rubro = rubro;
            for (let carrera of carrerasSeleccionadas) {
                patrocinadorExistente.asociarCarrera(carrera);
            }
        } else {
            let nuevoPatrocinador = new Patrocinador(nombreP, rubro);
            for (let carrera of carrerasSeleccionadas) {
                nuevoPatrocinador.asociarCarrera(carrera);
            }
            sistema.agregarPatrocinador(nuevoPatrocinador);
        }
        formulario.reset();
    }
}

function actualizarListaCarreras() {
    let select = document.getElementById("idCarrerasInscripcion");
    select.innerHTML = "";
    let carrerasOrdenadas = [];
    for (let i = 0; i < sistema.listaCarreras.length; i++) {
        carrerasOrdenadas.push(sistema.listaCarreras[i]);
    }
    

    carrerasOrdenadas.sort(function (a, b) {
        if (a.nombre < b.nombre) {
            return -1;
        }
        if (a.nombre > b.nombre) {
            return 1;
        }
        return 0;
    });

    for (let carrera of carrerasOrdenadas) {
        let option = document.createElement("option");
        option.text = carrera.nombre;
        option.value = carrera.nombre;
        select.appendChild(option);
    }
}

function actualizarListaCorredores() {
    let select = document.getElementById("idCorredoresInscripcion");
    select.innerHTML = "";
    let corredoresOrdenados = [];
    for (let i = 0; i < sistema.listaCorredores.length; i++) {
        corredoresOrdenados.push(sistema.listaCorredores[i]);
    }
    

    corredoresOrdenados.sort(function (a, b) {
        if (a.nombreC < b.nombreC) {
            return -1;
        }
        if (a.nombreC > b.nombreC) {
            return 1;
        }
        return 0;
    });
    for (let corredor of corredoresOrdenados) {
        let option = document.createElement("option");
        option.text = corredor.nombreC + "(CI:" + corredor.cedula + ")";
        option.value = corredor.nombreC;
        select.appendChild(option);
    }
}

function actualizarListaCarrerasP() {
    let select = document.getElementById("idDepartamentoCarreras");
    select.innerHTML = "";
    for (let carrera of sistema.listaCarreras) {
        let option = document.createElement("option");
        option.text = carrera.nombre;
        option.value = carrera.nombre;
        select.appendChild(option);
    }
}

function inscribir() {
    let formulario = document.getElementById("idFormInscripciones");
    if (formulario.reportValidity()) {
        let nombreCorredorSeleccionado = document.getElementById("idCorredoresInscripcion").value;
        let nombreCarreraSeleccionada = document.getElementById("idCarrerasInscripcion").value;

        let corredorInscripcion;
        for (let i = 0; i < sistema.listaCorredores.length; i++) {
            if (sistema.listaCorredores[i].nombreC === nombreCorredorSeleccionado) {
                corredorInscripcion = sistema.listaCorredores[i];
        
                break;
            }
        }

        let carreraInscripcion;
        for (let i = 0; i < sistema.listaCarreras.length; i++) {
            if (sistema.listaCarreras[i].nombre === nombreCarreraSeleccionada) {        
                carreraInscripcion = sistema.listaCarreras[i];
                break;
            }
        }

        if (!corredorInscripcion || !carreraInscripcion) {
            alert("Por favor, selecciona un corredor y una carrera válidos.");
            return;
        }

        let fechaVencimientoFicha = new Date(corredorInscripcion.fechaVenc);
        let fechaCarrera = new Date(carreraInscripcion.fecha);
        if (fechaVencimientoFicha < fechaCarrera) {
            alert("La ficha médica del corredor no está vigente para la fecha de la carrera.");
            return;
        }

        let inscripcionesEnEstaCarrera = 0;
        for (let i = 0; i < sistema.listaInscripciones.length; i++) {
            if (sistema.listaInscripciones[i].Icarreras === carreraInscripcion.nombre) {
                inscripcionesEnEstaCarrera++;
            }
        }

        if (inscripcionesEnEstaCarrera >= carreraInscripcion.cupo) {
            alert("No hay cupo disponible en la carrera seleccionada.");
            return;
        }

        let yaInscripto = false;
        for (let i = 0; i < sistema.listaInscripciones.length; i++) {
            if (sistema.listaInscripciones[i].Icorredores === corredorInscripcion.nombreC &&
                sistema.listaInscripciones[i].Icarreras === carreraInscripcion.nombre) {
                yaInscripto = true;
                break;
            }
        }
        if (yaInscripto) {
            alert("El corredor ya está inscripto en esta carrera.");
            return;
        }

        let nuevaInscripcion = new Inscripcion(corredorInscripcion.nombreC, carreraInscripcion.nombre);
        sistema.agregarInscripcion(nuevaInscripcion);

        let numeroInscripcion = sistema.listaInscripciones.length;
        formulario.reset();
        mostrarInscripciones();
    }
}

function mostrarInscripciones() {
    let mensaje = "ULTIMA INSCRIPCION \n\n";

    let insc = sistema.listaInscripciones[sistema.listaInscripciones.length - 1];

    let corredor = sistema.listaCorredores.find(function (c) {
        if (c.nombreC === insc.Icorredores) {
            return true;
        }
        return false;
    });

    let carrera = sistema.listaCarreras.find(function (c) {
        if (c.nombre === insc.Icarreras) {
            return true;
        }
        return false;
    });

    if (corredor && carrera) {
        mensaje += " Corredor: " + corredor.nombreC;
        mensaje += " Cédula: " + corredor.cedula;
        mensaje += " Edad: " + corredor.edad + "\n";
        mensaje += " Ficha médica vence: " + corredor.fechaVenc;
        mensaje += " Tipo: " + corredor.tipo + "\n";
        mensaje += " Carrera: " + carrera.nombre + " (" + carrera.departamento + ")";
        mensaje += " Fecha: " + carrera.fecha + " - Cupo: " + carrera.cupo + "\n";
        mensaje += "Patrocinadores:\n";

        for (let p of sistema.listaPatrocinadores) {
            for (let nombreCarrera of p.carrerasP) {
                if (nombreCarrera === carrera.nombre) {
                    mensaje += " - " + p.nombreP + " (" + p.rubro + ")\n";
                }
            }
        }
    }
    alert(mensaje);
}


function mostrarPromedioInscriptosPorCarrera() {
    
}


function mostrarDatos() {
    document.getElementById("idDatos").style.display = "block";
    document.getElementById("idEstadisticas").style.display = "none";
}

function mostrarEstadisticas() {
    document.getElementById("idDatos").style.display = "none";
    document.getElementById("idEstadisticas").style.display = "block";
}
