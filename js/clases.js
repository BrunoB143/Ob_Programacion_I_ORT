class Carrera {
    constructor(nombre, departamento, fecha, cupo) {
        this.nombre = nombre;
        this.departamento = departamento;
        this.fecha = fecha;
        this.cupo = cupo;
    }
}

class Corredores {
    constructor(nombreC, edad, cedula, fechaVenc, tipo) {
        this.nombreC = nombreC;
        this.edad = edad;
        this.cedula = cedula;
        this.fechaVenc = fechaVenc;
        this.tipo = tipo;
    }
}

class Patrocinador {
    constructor(nombreP, rubro) {
        this.nombreP = nombreP;
        this.rubro = rubro;
        this.carrerasP = [];
    }
    asociarCarrera(carreraNombre) {
        if (!this.carrerasP.includes(carreraNombre)) {
            this.carrerasP.push(carreraNombre);
        }
    }
}

class Inscripcion {
    constructor(Icorredores, Icarreras) {
        this.Icorredores = Icorredores;
        this.Icarreras = Icarreras;
        this.numeroInscripcion = 0; // Se asignará al crear la inscripción
    }
}

class Sistema {
    constructor() {
        this.listaCarreras = [];
        this.listaCorredores = [];
        this.listaPatrocinadores = [];
        this.listaInscripciones = [];
    }
    agregarCarrera(carrera){
        this.listaCarreras.push(carrera)
    }
    agregarCorredor(corredor){
        this.listaCorredores.push(corredor)
    }

    agregarPatrocinador(patrocinador){
        this.listaPatrocinadores.push(patrocinador)
    }
    
    agregarInscripcion(inscripcion){
        this.listaInscripciones.push(inscripcion)
    }

}