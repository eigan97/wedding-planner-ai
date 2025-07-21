import { z } from 'zod';

// Schema para la herramienta get-current-time
export const getCurrentTimeSchema = z.object({
    timezone: z.string().optional().describe('Zona horaria (opcional, por defecto UTC)')
});

// Función de ejecución
export async function executeGetCurrentTime(args: z.infer<typeof getCurrentTimeSchema>) {
    const timezone = args.timezone || 'UTC';
    const now = new Date().toLocaleString('es-ES', {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return `La hora actual en ${timezone} es: ${now}`;
}

// Configuración de la herramienta
export const getCurrentTimeTool = {
    name: 'get_current_time',
    description: 'Obtiene la hora actual',
    parameters: getCurrentTimeSchema,
    execute: executeGetCurrentTime
}; 