import { z } from 'zod';

// Schema para la herramienta get-weather
export const getWeatherSchema = z.object({
    city: z.string().describe('Nombre de la ciudad')
});

// Función de ejecución
export async function executeGetWeather(args: z.infer<typeof getWeatherSchema>) {
    // Simulación de API del clima
    return `El clima en ${args.city} está soleado con 25°C`;
}

// Configuración de la herramienta
export const getWeatherTool = {
    name: 'get_weather',
    description: 'Obtiene el clima actual de una ciudad específica',
    parameters: getWeatherSchema,
    execute: executeGetWeather
}; 