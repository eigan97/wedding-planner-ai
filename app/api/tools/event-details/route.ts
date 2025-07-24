import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, tipoCeremonia, lugarCeremonia, direccionCeremonia, lugarRecepcion, direccionRecepcion, temaBoda, coloresBoda } = body;

        if (action === 'start') {
            return NextResponse.json({
                success: true,
                message: "Ahora vamos a recolectar los detalles del evento. Necesito información sobre los lugares y el estilo de la boda.",
                component: "event-details-form",
                title: "Detalles del Evento",
                fields: [
                    "Tipo de ceremonia",
                    "Lugar de la ceremonia",
                    "Dirección de la ceremonia",
                    "Lugar de la recepción",
                    "Dirección de la recepción",
                    "Tema o estilo de la boda",
                    "Paleta de colores"
                ]
            });
        }

        if (action === 'submit') {
            // Aquí puedes guardar los datos en tu base de datos
            console.log('Detalles del evento recibidos:', { tipoCeremonia, lugarCeremonia, direccionCeremonia, lugarRecepcion, direccionRecepcion, temaBoda, coloresBoda });

            return NextResponse.json({
                success: true,
                message: `¡Perfecto! He guardado los detalles del evento. La ceremonia será ${tipoCeremonia} en ${lugarCeremonia} y la recepción en ${lugarRecepcion}. El tema será ${temaBoda} con colores ${coloresBoda}. ¿Continuamos con la siguiente sección?`,
                nextTool: "couple-story"
            });
        }

        return NextResponse.json({ success: false, message: "Acción no válida" });
    } catch (error) {
        console.error('Error en event-details tool:', error);
        return NextResponse.json({ success: false, message: "Error interno del servidor" });
    }
} 