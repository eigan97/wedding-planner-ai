import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, generateWebsite } = body;

        if (action === 'start') {
            return NextResponse.json({
                success: true,
                message: "¡Excelente! Has completado toda la información necesaria para tu sitio web de boda. Ahora puedo generar tu sitio web personalizado con todos los datos que me has proporcionado. ¿Te gustaría que proceda a crear tu sitio web?",
                component: "finalize-form",
                title: "Finalizar y Generar Sitio Web"
            });
        }

        if (action === 'submit') {
            if (generateWebsite) {
                return NextResponse.json({
                    success: true,
                    message: "¡Perfecto! Estoy generando tu sitio web personalizado. En unos momentos tendrás tu página web de boda lista con toda la información que me has proporcionado. ¡Gracias por confiar en mí para crear algo tan especial!",
                    nextTool: null // No hay más herramientas
                });
            } else {
                return NextResponse.json({
                    success: true,
                    message: "Entendido. Puedes volver en cualquier momento para generar tu sitio web cuando estés listo. ¡Ha sido un placer ayudarte a recolectar toda la información de tu boda!",
                    nextTool: null
                });
            }
        }

        return NextResponse.json({ success: false, message: "Acción no válida" });
    } catch (error) {
        console.error('Error en finalize tool:', error);
        return NextResponse.json({ success: false, message: "Error interno del servidor" });
    }
} 