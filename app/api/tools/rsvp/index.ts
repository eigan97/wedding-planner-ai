import { z } from 'zod';

// Schema para la herramienta RSVP
export const rsvpSchema = z.object({
    titulo: z.string().optional().describe('Título de la sección RSVP'),
    subtitulo: z.string().optional().describe('Subtítulo o descripción'),
    opcionesMenu: z.array(z.string()).optional().describe('Opciones del menú para seleccionar'),
    fechaLimite: z.string().optional().describe('Fecha límite para confirmar asistencia'),
    mensajeConfirmacion: z.string().optional().describe('Mensaje de confirmación después del envío'),
    estilo: z.enum(['elegante', 'moderno', 'romantico']).optional().describe('Estilo del formulario')
});

// Función de ejecución
export async function executeRSVP(args: z.infer<typeof rsvpSchema>) {
    const {
        titulo = '✅ Confirmar Asistencia',
        subtitulo = 'Nos encantaría que nos acompañes en nuestro día especial',
        opcionesMenu = ['Opción 1', 'Opción 2', 'Opción 3'],
        fechaLimite,
        mensajeConfirmacion = '¡Gracias por confirmar tu asistencia!',
        estilo = 'elegante'
    } = args;

    const estilos = {
        elegante: {
            bg: 'bg-gradient-to-br from-rose-50 to-pink-100',
            formBg: 'bg-white',
            button: 'bg-rose-500 hover:bg-rose-600',
            border: 'border-rose-200'
        },
        moderno: {
            bg: 'bg-gradient-to-br from-slate-50 to-gray-100',
            formBg: 'bg-white',
            button: 'bg-slate-600 hover:bg-slate-700',
            border: 'border-slate-200'
        },
        romantico: {
            bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
            formBg: 'bg-white',
            button: 'bg-pink-500 hover:bg-pink-600',
            border: 'border-pink-200'
        }
    };

    const selectedStyle = estilos[estilo];

    return `
    <section class="py-20 ${selectedStyle.bg}">
        <div class="container mx-auto px-4">
            <div class="max-w-2xl mx-auto text-center mb-12">
                <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                    ${titulo}
                </h2>
                <p class="text-xl text-gray-600 leading-relaxed">
                    ${subtitulo}
                </p>
                ${fechaLimite ? `
                    <p class="text-sm text-rose-600 font-medium mt-4">
                        📅 Fecha límite: ${fechaLimite}
                    </p>
                ` : ''}
            </div>
            
            <div class="max-w-2xl mx-auto">
                <form class="${selectedStyle.formBg} rounded-xl shadow-xl p-8 border ${selectedStyle.border}">
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
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
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
                            ${opcionesMenu.map(opcion => `
                                <option value="${opcion}">${opcion}</option>
                            `).join('')}
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
                        class="w-full ${selectedStyle.button} text-white font-medium py-4 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105">
                        ✨ Confirmar Asistencia
                    </button>
                </form>
                
                <!-- Mensaje de confirmación (oculto inicialmente) -->
                <div id="mensaje-confirmacion" class="hidden mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p class="text-green-700 font-medium">${mensajeConfirmacion}</p>
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

// Configuración de la herramienta
export const rsvpTool = {
    name: 'rsvp',
    description: 'Genera la sección de formulario RSVP para confirmar asistencia a la boda',
    parameters: rsvpSchema,
    execute: executeRSVP
}; 