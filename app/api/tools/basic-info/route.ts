import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, novioNombre, noviaNombre, fechaBoda, horaBoda } = body;

        if (action === 'start') {
            return NextResponse.json({
                success: true,
                message: "¡Perfecto! Vamos a recolectar la información básica de tu boda. Necesito que me proporciones los datos de la pareja y el evento.",
                component: "basic-info-form",
                title: "Información Básica de la Boda",
                fields: [
                    "Nombre completo del novio",
                    "Nombre completo de la novia",
                    "Fecha de la boda",
                    "Hora de inicio del evento"
                ]
            });
        }

        if (action === 'submit') {
            // Aquí puedes guardar los datos en tu base de datos
            console.log('Datos básicos recibidos:', { novioNombre, noviaNombre, fechaBoda, horaBoda });

            return NextResponse.json({
                success: true,
                message: `¡Excelente! He guardado la información básica de ${novioNombre} y ${noviaNombre}. Su boda será el ${fechaBoda} a las ${horaBoda}. ¿Te gustaría continuar con la siguiente sección?`,
                nextTool: "event-details"
            });
        }

        return NextResponse.json({ success: false, message: "Acción no válida" });
    } catch (error) {
        console.error('Error en basic-info tool:', error);
        return NextResponse.json({ success: false, message: "Error interno del servidor" });
    }
} 