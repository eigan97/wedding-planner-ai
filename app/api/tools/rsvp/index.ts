import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { RSVP_PROMPT } from './prompt';

// Schema para la herramienta RSVP
export const rsvpSchema = z.object({
    titulo: z.string().optional().default('✅ Confirmar Asistencia').describe('Título de la sección'),
    subtitulo: z.string().optional().default('Nos encantaría que nos acompañes en nuestro día especial').describe('Subtítulo de la sección'),
    opcionesMenu: z.array(z.string()).optional().default(['Vegetariano', 'Carne', 'Pescado']).describe('Opciones de menú disponibles'),
    maxAcompanantes: z.number().optional().default(5).describe('Número máximo de acompañantes permitidos'),
    estilo: z.string().optional().default('minimalista').describe('Estilo visual del formulario (puede ser: minimalista, elegante, moderno, rustico, o cualquier estilo personalizado)')
});

// Función de ejecución
export async function executeRSVP(args: z.infer<typeof rsvpSchema>) {
    const {
        titulo = '✅ Confirmar Asistencia',
        subtitulo = 'Nos encantaría que nos acompañes en nuestro día especial',
        opcionesMenu = ['Vegetariano', 'Carne', 'Pescado'],
        maxAcompanantes = 5,
        estilo = 'minimalista'
    } = args;

    try {
        // Crear el prompt específico con los datos del RSVP
        const userPrompt = `
Crea la sección de "Confirmar Asistencia" para la boda.

DETALLES DEL FORMULARIO:
- Título: ${titulo}
- Subtítulo: ${subtitulo}
- Estilo: ${estilo}
- Máximo de acompañantes: ${maxAcompanantes}

OPCIONES DE MENÚ:
${opcionesMenu.map((opcion, index) => `${index + 1}. ${opcion}`).join('\n')}

Genera el HTML para la sección de RSVP siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: RSVP_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 4000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeRSVP:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
            <div class="container mx-auto px-4">
                <div class="max-w-2xl mx-auto text-center mb-12">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        ${titulo}
                    </h2>
                    <p class="text-xl text-gray-600 leading-relaxed">
                        ${subtitulo}
                    </p>
                </div>
                
                <div class="max-w-2xl mx-auto">
                    <form class="bg-white rounded-xl shadow-xl p-8 border border-rose-200">
                        <!-- Nombre completo -->
                        <div class="mb-6">
                            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                                👤 Nombre completo *
                            </label>
                            <input 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                                placeholder="Tu nombre completo">
                        </div>
                        
                        <!-- Email -->
                        <div class="mb-6">
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                📧 Email *
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                                placeholder="tu@email.com">
                        </div>
                        
                        <!-- Confirmación de asistencia -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-3">
                                ✅ ¿Confirmas tu asistencia? *
                            </label>
                            <div class="flex gap-4">
                                <label class="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="asistencia" 
                                        value="si" 
                                        required
                                        class="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500">
                                    <span class="ml-2 text-gray-700">Sí, asistiré</span>
                                </label>
                                <label class="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="asistencia" 
                                        value="no" 
                                        required
                                        class="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500">
                                    <span class="ml-2 text-gray-700">No podré asistir</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Número de acompañantes -->
                        <div class="mb-6">
                            <label for="acompanantes" class="block text-sm font-medium text-gray-700 mb-2">
                                👥 Número de acompañantes
                            </label>
                            <select 
                                id="acompanantes" 
                                name="acompanantes"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors">
                                ${Array.from({ length: maxAcompanantes + 1 }, (_, i) =>
            `<option value="${i}">${i}</option>`
        ).join('')}
                            </select>
                        </div>
                        
                        <!-- Selección de menú -->
                        <div class="mb-6">
                            <label for="menu" class="block text-sm font-medium text-gray-700 mb-2">
                                🍽️ Selección de menú
                            </label>
                            <select 
                                id="menu" 
                                name="menu"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors">
                                <option value="">Selecciona una opción</option>
                                ${opcionesMenu.map(opcion =>
            `<option value="${opcion}">${opcion}</option>`
        ).join('')}
                            </select>
                        </div>
                        
                        <!-- Comentarios -->
                        <div class="mb-8">
                            <label for="comentarios" class="block text-sm font-medium text-gray-700 mb-2">
                                💭 Comentarios o restricciones alimenticias
                            </label>
                            <textarea 
                                id="comentarios" 
                                name="comentarios" 
                                rows="4"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors resize-none"
                                placeholder="Alergias, preferencias alimenticias, comentarios especiales..."></textarea>
                        </div>
                        
                        <!-- Botón de envío -->
                        <button 
                            type="submit"
                            class="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105">
                            ✨ Confirmar Asistencia
                        </button>
                    </form>
                    
                    <!-- Mensaje de confirmación (oculto inicialmente) -->
                    <div id="mensaje-confirmacion" class="hidden mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <p class="text-green-700 font-medium">¡Gracias por confirmar tu asistencia!</p>
                    </div>
                </div>
            </div>
            
            <script>
                document.querySelector('form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Aquí iría la lógica para enviar los datos
                    console.log('Formulario enviado:', new FormData(this));
                    
                    // Mostrar mensaje de confirmación
                    document.getElementById('mensaje-confirmacion').classList.remove('hidden');
                    
                    // Scroll al mensaje
                    document.getElementById('mensaje-confirmacion').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                    
                    // Resetear formulario después de 2 segundos
                    setTimeout(() => {
                        this.reset();
                        document.getElementById('mensaje-confirmacion').classList.add('hidden');
                    }, 3000);
                });
            </script>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const rsvpTool = {
    name: 'rsvp',
    description: 'Genera la sección de confirmación de asistencia con formulario interactivo',
    parameters: rsvpSchema,
    execute: executeRSVP
}; 