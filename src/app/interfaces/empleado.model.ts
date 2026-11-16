export interface Empleado {
    id: number;
    nombreCompleto: string;
    fechaInicioAntiguedad?: string;
    idManager?: number;
    nombreManager?: string;
    posicion?: string;
}

export interface EmpleadosResponse {
    empleados: Empleado[];
}