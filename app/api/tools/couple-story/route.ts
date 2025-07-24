import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, comoSeConocieron, momentoEspecial1, momentoEspecial2, momentoEspecial3, propuestaMatrimonio } = body;

        if (action === 'start') {
            return NextResponse.json({
                success: true,
                message: "Ahora vamos a recolectar la historia de la pareja. Cuéntame sobre momentos especiales de su relación.",
                component: "couple-story-form",
                title: "Historia de la Pareja",
                fields: [
                    "¿Cómo se conocieron?",
                    "Momento especial 1",
                    "Momento especial 2",
                    "Momento especial 3",
                    "La propuesta de matrimonio"
                ]
            });
        }

        if (action === 'submit') {
            // Aquí puedes guardar los datos en tu base de datos
            console.log('Historia de la pareja recibida:', { comoSeConocieron, momentoEspecial1, momentoEspecial2, momentoEspecial3, propuestaMatrimonio });

            return NextResponse.json({
                success: true,
                message: `¡Hermoso! He guardado la historia de la pareja. Es increíble cómo se conocieron: ${comoSeConocieron}. ¿Continuamos con la siguiente sección?`,
                nextTool: "finalize"
            });
        }

        return NextResponse.json({ success: false, message: "Acción no válida" });
    } catch (error) {
        console.error('Error en couple-story tool:', error);
        return NextResponse.json({ success: false, message: "Error interno del servidor" });
    }
} 