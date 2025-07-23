// Importar herramientas de utilidad
import { getWeatherTool } from './get-weather';
import { calculateTool } from './calculate';
import { getCurrentTimeTool } from './get-current-time';

// Importar herramientas de boda
import { portadaTool } from './portada';
import { nuestraHistoriaTool } from './nuestra-historia';
import { itinerarioTool } from './itinerario';
import { ubicacionesTool } from './ubicaciones';
import { rsvpTool } from './rsvp';
import { hospedajeTool } from './hospedaje';
import { mesaRegalosTool } from './mesa-regalos';
import { galeriaTool } from './galeria';
import { cuentaRegresivaTool } from './cuenta-regresiva';
import { footerTool } from './footer';

// Exportar todas las herramientas de boda
export const tools = [
    portadaTool,
    nuestraHistoriaTool,
    itinerarioTool,
    ubicacionesTool,
    rsvpTool,
    hospedajeTool,
    mesaRegalosTool,
    galeriaTool,
    cuentaRegresivaTool,
    footerTool
];

// Exportar herramientas individuales
export {
    getWeatherTool,
    calculateTool,
    getCurrentTimeTool,
    portadaTool,
    nuestraHistoriaTool,
    itinerarioTool,
    ubicacionesTool,
    rsvpTool,
    hospedajeTool,
    mesaRegalosTool,
    galeriaTool,
    cuentaRegresivaTool,
    footerTool
};

// Exportar funciones de ejecución
export { executeGetWeather } from './get-weather';
export { executeCalculate } from './calculate';
export { executeGetCurrentTime } from './get-current-time';
export { executePortada } from './portada';
export { executeNuestraHistoria } from './nuestra-historia';
export { executeItinerario } from './itinerario';
export { executeUbicaciones } from './ubicaciones';
export { executeRSVP } from './rsvp';
export { executeHospedaje } from './hospedaje';
export { executeMesaRegalos } from './mesa-regalos';
export { executeGaleria } from './galeria';
export { executeCuentaRegresiva } from './cuenta-regresiva';
export { executeFooter } from './footer';

// Crear objeto con todas las herramientas para streamText
export const allTools = {
    [getWeatherTool.name]: {
        description: getWeatherTool.description,
        parameters: getWeatherTool.parameters
    },
    [calculateTool.name]: {
        description: calculateTool.description,
        parameters: calculateTool.parameters
    },
    [getCurrentTimeTool.name]: {
        description: getCurrentTimeTool.description,
        parameters: getCurrentTimeTool.parameters
    },
    [portadaTool.name]: {
        description: portadaTool.description,
        parameters: portadaTool.parameters
    },
    [nuestraHistoriaTool.name]: {
        description: nuestraHistoriaTool.description,
        parameters: nuestraHistoriaTool.parameters
    },
    [itinerarioTool.name]: {
        description: itinerarioTool.description,
        parameters: itinerarioTool.parameters
    },
    [ubicacionesTool.name]: {
        description: ubicacionesTool.description,
        parameters: ubicacionesTool.parameters
    },
    [rsvpTool.name]: {
        description: rsvpTool.description,
        parameters: rsvpTool.parameters
    },
    [hospedajeTool.name]: {
        description: hospedajeTool.description,
        parameters: hospedajeTool.parameters
    },
    [mesaRegalosTool.name]: {
        description: mesaRegalosTool.description,
        parameters: mesaRegalosTool.parameters
    },
    [galeriaTool.name]: {
        description: galeriaTool.description,
        parameters: galeriaTool.parameters
    },
    [cuentaRegresivaTool.name]: {
        description: cuentaRegresivaTool.description,
        parameters: cuentaRegresivaTool.parameters
    },
    [footerTool.name]: {
        description: footerTool.description,
        parameters: footerTool.parameters
    }
};

// Función para ejecutar cualquier herramienta
export async function executeTool(name: string, args: any) {
    switch (name) {
        case getWeatherTool.name:
            return await getWeatherTool.execute(args);
        case calculateTool.name:
            return await calculateTool.execute(args);
        case getCurrentTimeTool.name:
            return await getCurrentTimeTool.execute(args);
        case portadaTool.name:
            return await portadaTool.execute(args);
        case nuestraHistoriaTool.name:
            return await nuestraHistoriaTool.execute(args);
        case itinerarioTool.name:
            return await itinerarioTool.execute(args);
        case ubicacionesTool.name:
            return await ubicacionesTool.execute(args);
        case rsvpTool.name:
            return await rsvpTool.execute(args);
        case hospedajeTool.name:
            return await hospedajeTool.execute(args);
        case mesaRegalosTool.name:
            return await mesaRegalosTool.execute(args);
        case galeriaTool.name:
            return await galeriaTool.execute(args);
        case cuentaRegresivaTool.name:
            return await cuentaRegresivaTool.execute(args);
        case footerTool.name:
            return await footerTool.execute(args);
        default:
            return `Herramienta ${name} no encontrada`;
    }
} 