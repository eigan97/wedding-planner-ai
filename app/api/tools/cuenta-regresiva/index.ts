import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { CUENTA_REGRESIVA_PROMPT } from './prompt';

// Schema para la herramienta cuenta regresiva
export const cuentaRegresivaSchema = z.object({
    fechaBoda: z.string().optional().default('2024-12-15T15:00:00').describe('Fecha y hora de la boda (ISO string)'),
    titulo: z.string().optional().default('⏰ Cuenta Regresiva').describe('Título de la sección'),
    mensaje: z.string().optional().default('Faltan solo unos días para nuestro gran día').describe('Mensaje de la cuenta regresiva'),
    estilo: z.string().optional().default('cards').describe('Estilo de presentación del contador (puede ser: cards, circle, minimal, elegant, o cualquier estilo personalizado)'),
    mostrarSegundos: z.boolean().optional().default(true).describe('Mostrar segundos en el contador')
});

// Función de ejecución
export async function executeCuentaRegresiva(args: z.infer<typeof cuentaRegresivaSchema>) {
    const {
        fechaBoda = '2024-12-15T15:00:00',
        titulo = '⏰ Cuenta Regresiva',
        mensaje = 'Faltan solo unos días para nuestro gran día',
        estilo = 'cards',
        mostrarSegundos = true
    } = args;

    try {
        // Crear el prompt específico con los datos de la cuenta regresiva
        const userPrompt = `
Crea la sección de "Cuenta Regresiva" para la boda.

DETALLES DE LA CUENTA REGRESIVA:
- Fecha de la boda: ${fechaBoda}
- Título: ${titulo}
- Mensaje: ${mensaje}
- Estilo: ${estilo}
- Mostrar segundos: ${mostrarSegundos}

Genera el HTML para la sección de cuenta regresiva siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: CUENTA_REGRESIVA_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeCuentaRegresiva:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        ${titulo}
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        ${mensaje}
                    </p>
                </div>
                
                <div class="flex justify-center">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div id="dias" class="text-4xl md:text-5xl font-bold text-rose-500 mb-2">00</div>
                            <div class="text-gray-600 font-medium">Días</div>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div id="horas" class="text-4xl md:text-5xl font-bold text-rose-500 mb-2">00</div>
                            <div class="text-gray-600 font-medium">Horas</div>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div id="minutos" class="text-4xl md:text-5xl font-bold text-rose-500 mb-2">00</div>
                            <div class="text-gray-600 font-medium">Minutos</div>
                        </div>
                        
                        ${mostrarSegundos ? `
                            <div class="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                                <div id="segundos" class="text-4xl md:text-5xl font-bold text-rose-500 mb-2">00</div>
                                <div class="text-gray-600 font-medium">Segundos</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div id="mensaje-final" class="hidden text-center mt-8">
                    <h3 class="text-3xl font-bold text-rose-500 mb-4">¡Hoy es el día!</h3>
                    <p class="text-xl text-gray-600">¡Nos vemos en la boda!</p>
                </div>
            </div>
            
            <script>
                const fechaBoda = new Date('${fechaBoda}').getTime();
                
                function actualizarContador() {
                    const ahora = new Date().getTime();
                    const diferencia = fechaBoda - ahora;
                    
                    if (diferencia <= 0) {
                        // La boda ya llegó
                        document.querySelector('.grid').style.display = 'none';
                        document.getElementById('mensaje-final').classList.remove('hidden');
                        return;
                    }
                    
                    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
                    
                    document.getElementById('dias').textContent = dias.toString().padStart(2, '0');
                    document.getElementById('horas').textContent = horas.toString().padStart(2, '0');
                    document.getElementById('minutos').textContent = minutos.toString().padStart(2, '0');
                    ${mostrarSegundos ? `document.getElementById('segundos').textContent = segundos.toString().padStart(2, '0');` : ''}
                }
                
                // Actualizar cada segundo
                actualizarContador();
                setInterval(actualizarContador, 1000);
            </script>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const cuentaRegresivaTool = {
    name: 'cuenta_regresiva',
    description: 'Genera la sección de cuenta regresiva con contador en tiempo real',
    parameters: cuentaRegresivaSchema,
    execute: executeCuentaRegresiva
}; 