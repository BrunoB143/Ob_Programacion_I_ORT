//Bruno Barcelona 348862 y Rodrigo Carrion 334254
class Carrera {
    constructor(nombre, departamento, departamentoS, fecha, cupo) {
        this.nombre = nombre;
        this.departamento = departamento;
        this.departamentoS = departamentoS;
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
    asociarCarrera(nombreCarrera) {
        this.carrerasP.push(nombreCarrera);
    }
}

class Inscripcion {
    constructor(Icorredores, Icarreras) {
        this.Icorredores = Icorredores;
        this.Icarreras = Icarreras;
        this.numeroInscripcion = 0; 
    }
}

class Sistema {
    constructor() {
        this.listaCarreras = [];
        this.listaCorredores = [];
        this.listaPatrocinadores = [];
        this.listaInscripciones = [];
    }

    agregarCarrera(unaCarrera){
        this.listaCarreras.push(unaCarrera);
    }

    agregarCorredor(unCorredor){
        this.listaCorredores.push(unCorredor);
    }

    agregarPatrocinador(unPatrocinador){
        this.listaPatrocinadores.push(unPatrocinador);
    }

    agregarInscripcion(unaInscripcion){
        this.listaInscripciones.push(unaInscripcion);
    }

    ordenarListaCorredores() {
        this.listaCorredores.sort(function(a, b) {
            return a.nombreC.localeCompare(b.nombreC);
        });
        return this.listaCorredores;
    }

    ordenarListaCarreras() {
        this.listaCarreras.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
        return this.listaCarreras;
    }

    promedioCorredoresElite() {
        let totalCorredores = this.listaCorredores.length;
        let totalElite = 0;
    
        for (let corredor of this.listaCorredores) {
            if (corredor.tipo === "elite") {
                totalElite++;
            }
        }
    
        if (totalCorredores === 0) {
            return "Sin datos";
        }
    
        let porcentaje = (totalElite / totalCorredores * 100).toFixed(2) + "%";
        return porcentaje;
    }

    promedioInscriptosPorCarrera(){
        let totalInscriptos = 0;
        let cantidadCarreras = this.listaCarreras.length;

        for (let carrera of this.listaCarreras) {
            for (let inscripcion of this.listaInscripciones) {
                if (inscripcion.Icarreras === carrera.nombre) {
                    totalInscriptos++;
                }
            }
        }

        if (cantidadCarreras === 0) {
            return "Sin datos";
        }

        let promedio = totalInscriptos / cantidadCarreras;
        return promedio.toFixed(2);
    }
    
    carrerasConMasInscriptos() {
        let totalInscriptos = [];

        for (let i = 0; i < this.listaCarreras.length; i++) {
            totalInscriptos[i] = 0;
        }

        for (let inscripcion of this.listaInscripciones) {
            for (let i = 0; i < this.listaCarreras.length; i++) {
                if (inscripcion.Icarreras === this.listaCarreras[i].nombre) {
                    totalInscriptos[i]++;
                }
            }
        }

        let max = 0;
        for (let i = 0; i < totalInscriptos.length; i++) {
            if (totalInscriptos[i] > max) {
                max = totalInscriptos[i];
            }
        }

        if (max === 0) {
            return "sin datos";
        }

        let resultado = [];
        for (let i = 0; i < totalInscriptos.length; i++) {
            if (totalInscriptos[i] === max) {
                resultado.push({
                carrera: this.listaCarreras[i],
                cantidad: totalInscriptos[i]
            });
        }
    }

    return resultado;
    }

    carrerasSinInscriptosOrdenadas() {
        let lista = [];
        for (let carrera of this.listaCarreras) {
            let tieneInscriptos = false;
            for (let inscripcion of this.listaInscripciones) {
                if (inscripcion.Icarreras === carrera.nombre) {
                    tieneInscriptos = true;
                }
            }
            if (!tieneInscriptos) {
                lista.push(carrera);
            }
        }

        lista.sort(function(a, b) {
            let fechaA = new Date(a.fecha);
            let fechaB = new Date(b.fecha);
            return fechaA - fechaB;
        });

        return lista;
    }

    ordenarInscripciones(inscripcionesCarrera, criterio) {
    let self = this;  // guardo el contexto

    if (criterio === "nombre") {
        inscripcionesCarrera.sort(function(a, b) {
            let corredorA = self.listaCorredores.find(function(c) {
                return c.nombreC === a.Icorredores;
            });

            let corredorB = self.listaCorredores.find(function(c) {
                return c.nombreC === b.Icorredores;
            });

            if (!corredorA || !corredorB) return 0;
            return corredorA.nombreC.localeCompare(corredorB.nombreC);
        });
    } else if (criterio === "numero") {
        inscripcionesCarrera.sort(function(a, b) {
            return a.numeroInscripcion - b.numeroInscripcion;
        });
    }
    return inscripcionesCarrera;
    }

}



