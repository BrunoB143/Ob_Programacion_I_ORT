function generarYGuardarPDFinscripciones() {
    window.jsPDF = window.jspdf.jsPDF;
    let doc = new jsPDF();
    let y = 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Lista de Inscripciones:", 10, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    for (let insc of sistema.listaInscripciones) {
        let corredor = sistema.listaCorredores.find(c => c.nombreC === insc.Icorredores);
        let carrera = sistema.listaCarreras.find(c => c.nombre === insc.Icarreras);
        if (!corredor || !carrera) continue;

        doc.text("Número: " + insc.numeroInscripcion, 10, y); y += 7;
        doc.text("Nombre: " + corredor.nombreC + ", " + corredor.edad + " años, CI: " + corredor.cedula, 10, y); y += 7;
        doc.text("Ficha Médica: " + corredor.fechaVenc, 10, y); y += 7;
        doc.text("Tipo: " + corredor.tipo, 10, y); y += 7;
        doc.text("Carrera: " + carrera.nombre + " en " + carrera.departamento + " el " + carrera.fecha + " (Cupo: " + carrera.cupo + ")", 10, y); y += 7;
        doc.text("Patrocinadores:", 10, y); y += 7;

        for (let p of sistema.listaPatrocinadores) {
            if (p.carrerasP.includes(carrera.nombre)) {
                doc.text(" - " + p.nombreP + " (" + p.rubro + ")", 12, y);
                y += 7;
            }
        }

        y += 5;
        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    }

    doc.save("inscripciones.pdf");
}