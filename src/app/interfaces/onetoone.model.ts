export interface OneToOneGuardarResponse
{
    idFormularioOneToOne: number;
}

//fila para la tabla de historial
export interface OneToOneResumen
{
    idFormularioOneToOne: number;
    idEmpleado: number;
    idManager: number;
    fecha: string;
    area?: string;
    posicion?: string;
    fechaAntiguedad: string;
    formacion?: string;   
    nombreEmpleado?: string;   
    nombreManager?: string;   
}

// respuesta del get de la lista
export interface OneToOneListaResponse
{
    oneToOnes: OneToOneResumen[];
}

//fila completa para el detalle
//contiene todo el resumen mas el resto de campos
export interface OneToOneDetalle extends OneToOneResumen
{
    titulo?: string;
    estadoTareasProyectos?: string;
    dificultadesAvance?: string;
    puntosFuertes?: string;
    areaDesarrollar?: string;
    queFuncionaBien?: string;
    quePuedeMejorar?: string;
    visionCuatroAnyos?: string;
    habilidadesDesarrollar?: string;
    bienestarMotivacion?: string;
    objetivosIndividuales?: string;
    metasIndividuales?: string;
    objetivosArea?: string;
    kpis?: string;
    firmaResponsable?: string;
    firmaTrabajador?: string;
}