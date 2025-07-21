import { z } from 'zod';

// Schema para la herramienta mesa de regalos
export const mesaRegalosSchema = z.object({
    titulo: z.string().optional().default('🎁 Mesa de Regalos').describe('Título de la sección'),
    mensaje: z.string().optional().default('Tu presencia es nuestro mejor regalo, pero si deseas hacernos un detalle, aquí tienes algunas opciones').describe('Mensaje principal'),
    opciones: z.array(z.object({
        nombre: z.string().optional().default('Tienda de Departamentos').describe('Nombre de la opción'),
        descripcion: z.string().optional().default('Artículos para el hogar y más').describe('Descripción de la opción'),
        enlace: z.string().optional().default('https://tiendadepartamentos.com/mesa-regalos').describe('Enlace para la opción'),
        icono: z.string().optional().default('🛍️').describe('Icono de la opción'),
        tipo: z.enum(['tienda', 'transferencia', 'otro']).optional().default('tienda').describe('Tipo de opción'),
        mensajeAgradecimiento: z.string().optional().default('¡Gracias por ser parte de nuestro día especial!').describe('Mensaje de agradecimiento')
    })).optional().default([
        {
            nombre: 'Tienda de Departamentos',
            descripcion: 'Artículos para el hogar y más',
            enlace: 'https://tiendadepartamentos.com/mesa-regalos',
            icono: '🛍️',
            tipo: 'tienda',
            mensajeAgradecimiento: '¡Gracias por ser parte de nuestro día especial!'
        },
        {
            nombre: 'Transferencia Bancaria',
            descripcion: 'Contribuye a nuestra luna de miel',
            enlace: 'https://banco.com/transferencia',
            icono: '💳',
            tipo: 'transferencia',
            mensajeAgradecimiento: '¡Gracias por ser parte de nuestro día especial!'
        }
    ]).describe('Array de opciones de regalos'),
    mensajeAgradecimiento: z.string().optional().default('¡Gracias por ser parte de nuestro día especial!').describe('Mensaje de agradecimiento general'),
    estilo: z.enum(['elegante', 'moderno', 'rustico']).optional().default('elegante').describe('Estilo visual de la sección')
});

// Función de ejecución
export async function executeMesaRegalos(args: z.infer<typeof mesaRegalosSchema>) {
    const {
        titulo = '🎁 Mesa de Regalos',
        mensaje = 'Tu presencia es nuestro mejor regalo, pero si deseas hacernos un detalle, aquí tienes algunas opciones',
        opciones = [
            {
                nombre: 'Tienda de Departamentos',
                descripcion: 'Artículos para el hogar y más',
                enlace: 'https://tiendadepartamentos.com/mesa-regalos',
                icono: '🛍️',
                tipo: 'tienda',
                mensajeAgradecimiento: '¡Gracias por ser parte de nuestro día especial!'
            },
            {
                nombre: 'Transferencia Bancaria',
                descripcion: 'Contribuye a nuestra luna de miel',
                enlace: 'https://banco.com/transferencia',
                icono: '💳',
                tipo: 'transferencia',
                mensajeAgradecimiento: '¡Gracias por ser parte de nuestro día especial!'
            }
        ],
        mensajeAgradecimiento = '¡Gracias por ser parte de nuestro día especial!',
        estilo = 'elegante'
    } = args;

    const getEstiloColores = (estilo: string) => {
        switch (estilo) {
            case 'elegante':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
                    card: 'bg-white',
                    button: 'bg-amber-500 hover:bg-amber-600',
                    text: 'text-amber-700'
                };
            case 'moderno':
                return {
                    bg: 'bg-gradient-to-br from-slate-50 to-gray-100',
                    card: 'bg-white',
                    button: 'bg-slate-500 hover:bg-slate-600',
                    text: 'text-slate-700'
                };
            case 'rustico':
                return {
                    bg: 'bg-gradient-to-br from-rose-50 to-pink-100',
                    card: 'bg-white',
                    button: 'bg-rose-500 hover:bg-rose-600',
                    text: 'text-rose-700'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
                    card: 'bg-white',
                    button: 'bg-amber-500 hover:bg-amber-600',
                    text: 'text-amber-700'
                };
        }
    };

    const colors = getEstiloColores(estilo);

    return `
    <section class="py-20 ${colors.bg}">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                    ${titulo}
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    ${mensaje}
                </p>
                <p class="text-lg ${colors.text} font-medium">
                    ${mensajeAgradecimiento}
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                ${opciones.map((opcion, index) => `
                    <div class="${colors.card} rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                        <div class="text-center mb-6">
                            <div class="text-5xl mb-4">${opcion.icono}</div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">${opcion.nombre}</h3>
                            <p class="text-gray-600">${opcion.descripcion}</p>
                        </div>
                        
                        <div class="text-center">
                            <a href="${opcion.enlace}" 
                               target="_blank" 
                               class="inline-block ${colors.button} text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 transform hover:scale-105">
                                ${opcion.tipo === 'transferencia' ? '💳 Transferir' : '🛍️ Ver Opciones'}
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
}

// Configuración de la herramienta
export const mesaRegalosTool = {
    name: 'mesa_regalos',
    description: 'Genera la sección de mesa de regalos con opciones de regalos',
    parameters: mesaRegalosSchema,
    execute: executeMesaRegalos
}; 