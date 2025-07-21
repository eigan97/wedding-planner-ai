import { z } from 'zod';

// Schema para la herramienta cuenta-regresiva
export const cuentaRegresivaSchema = z.object({
    fechaEvento: z.string().describe('Fecha del evento en formato ISO (YYYY-MM-DDTHH:mm:ss)'),
    titulo: z.string().optional().describe('Título de la sección'),
    subtitulo: z.string().optional().describe('Subtítulo o mensaje'),
    mostrarSegundos: z.boolean().optional().describe('Si se deben mostrar los segundos'),
    estilo: z.enum(['elegante', 'moderno', 'romantico']).optional().describe('Estilo de presentación'),
    colorFondo: z.string().optional().describe('Color de fondo personalizado')
});

// Función de ejecución
export async function executeCuentaRegresiva(args: z.infer<typeof cuentaRegresivaSchema>) {
    const {
        fechaEvento,
        titulo = '⏳ Cuenta Regresiva',
        subtitulo = 'Faltan pocos días para nuestro gran día',
        mostrarSegundos = true,
        estilo = 'elegante',
        colorFondo
    } = args;

    const estilos = {
        elegante: {
            bg: colorFondo || 'bg-gradient-to-br from-rose-50 to-pink-100',
            card: 'bg-white',
            text: 'text-gray-800',
            accent: 'text-rose-500',
            border: 'border-rose-200'
        },
        moderno: {
            bg: colorFondo || 'bg-gradient-to-br from-slate-50 to-gray-100',
            card: 'bg-white',
            text: 'text-gray-800',
            accent: 'text-slate-600',
            border: 'border-slate-200'
        },
        romantico: {
            bg: colorFondo || 'bg-gradient-to-br from-pink-50 to-rose-100',
            card: 'bg-white',
            text: 'text-gray-800',
            accent: 'text-pink-500',
            border: 'border-pink-200'
        }
    };

    const selectedStyle = estilos[estilo];

    return `
    <section class="py-20 ${selectedStyle.bg}">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-light mb-6 ${selectedStyle.text}">
                    ${titulo}
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    ${subtitulo}
                </p>
            </div>
            
            <div class="max-w-4xl mx-auto">
                <div class="${selectedStyle.card} rounded-2xl shadow-xl p-8 md:p-12 border ${selectedStyle.border}">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        <!-- Días -->
                        <div class="text-center">
                            <div class="text-4xl md:text-6xl font-bold ${selectedStyle.accent} mb-2" id="dias">00</div>
                            <div class="text-sm md:text-base text-gray-600 font-medium">Días</div>
                        </div>
                        
                        <!-- Horas -->
                        <div class="text-center">
                            <div class="text-4xl md:text-6xl font-bold ${selectedStyle.accent} mb-2" id="horas">00</div>
                            <div class="text-sm md:text-base text-gray-600 font-medium">Horas</div>
                        </div>
                        
                        <!-- Minutos -->
                        <div class="text-center">
                            <div class="text-4xl md:text-6xl font-bold ${selectedStyle.accent} mb-2" id="minutos">00</div>
                            <div class="text-sm md:text-base text-gray-600 font-medium">Minutos</div>
                        </div>
                        
                        <!-- Segundos -->
                        ${mostrarSegundos ? `
                            <div class="text-center">
                                <div class="text-4xl md:text-6xl font-bold ${selectedStyle.accent} mb-2" id="segundos">00</div>
                                <div class="text-sm md:text-base text-gray-600 font-medium">Segundos</div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Mensaje cuando llegue la fecha -->
                    <div id="mensaje-final" class="hidden text-center mt-8">
                        <div class="text-3xl md:text-4xl font-bold ${selectedStyle.accent} mb-4">
                            🎉 ¡Hoy es el día! 🎉
                        </div>
                        <p class="text-lg text-gray-600">
                            ¡Gracias por acompañarnos en este momento tan especial!
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Fecha objetivo
            const fechaObjetivo = new Date('${fechaEvento}').getTime();
            
            function actualizarCuentaRegresiva() {
                const ahora = new Date().getTime();
                const diferencia = fechaObjetivo - ahora;
                
                if (diferencia <= 0) {
                    // La fecha ya llegó
                    document.getElementById('dias').textContent = '00';
                    document.getElementById('horas').textContent = '00';
                    document.getElementById('minutos').textContent = '00';
                    ${mostrarSegundos ? `document.getElementById('segundos').textContent = '00';` : ''}
                    document.getElementById('mensaje-final').classList.remove('hidden');
                    return;
                }
                
                // Calcular tiempo restante
                const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
                
                // Actualizar elementos
                document.getElementById('dias').textContent = dias.toString().padStart(2, '0');
                document.getElementById('horas').textContent = horas.toString().padStart(2, '0');
                document.getElementById('minutos').textContent = minutos.toString().padStart(2, '0');
                ${mostrarSegundos ? `document.getElementById('segundos').textContent = segundos.toString().padStart(2, '0');` : ''}
            }
            
            // Actualizar cada segundo
            actualizarCuentaRegresiva();
            setInterval(actualizarCuentaRegresiva, 1000);
            
            // Animación de entrada
            document.addEventListener('DOMContentLoaded', function() {
                const elementos = document.querySelectorAll('#dias, #horas, #minutos, #segundos');
                elementos.forEach((elemento, index) => {
                    setTimeout(() => {
                        elemento.style.opacity = '0';
                        elemento.style.transform = 'translateY(20px)';
                        elemento.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            elemento.style.opacity = '1';
                            elemento.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
            });
        </script>
    </section>
    `;
}

// Configuración de la herramienta
export const cuentaRegresivaTool = {
    name: 'cuenta_regresiva',
    description: 'Genera la sección de cuenta regresiva hacia la fecha del evento',
    parameters: cuentaRegresivaSchema,
    execute: executeCuentaRegresiva
}; 