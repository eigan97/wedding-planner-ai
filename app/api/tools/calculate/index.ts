import { z } from 'zod';

// Schema para la herramienta calculate
export const calculateSchema = z.object({
    expression: z.string().describe('Expresión matemática a calcular (ej: "2 + 2", "10 * 5")')
});

// Función de ejecución
export async function executeCalculate(args: z.infer<typeof calculateSchema>) {
    try {
        // Evaluar la expresión matemática de forma segura
        const result = eval(args.expression);
        return `El resultado de ${args.expression} es ${result}`;
    } catch (error) {
        return `Error al calcular: ${args.expression}`;
    }
}

// Configuración de la herramienta
export const calculateTool = {
    name: 'calculate',
    description: 'Realiza cálculos matemáticos básicos',
    parameters: calculateSchema,
    execute: executeCalculate
}; 