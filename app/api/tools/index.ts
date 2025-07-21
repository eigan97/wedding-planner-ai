// Exportar todas las herramientas
export { getWeatherTool } from './get-weather';
export { calculateTool } from './calculate';
export { getCurrentTimeTool } from './get-current-time';

// Exportar todas las funciones de ejecución
export { executeGetWeather } from './get-weather';
export { executeCalculate } from './calculate';
export { executeGetCurrentTime } from './get-current-time';

// Crear objeto con todas las herramientas para streamText
import { getWeatherTool } from './get-weather';
import { calculateTool } from './calculate';
import { getCurrentTimeTool } from './get-current-time';

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
        default:
            return `Herramienta ${name} no encontrada`;
    }
} 