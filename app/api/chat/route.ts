import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json()
  console.log(messages, 'messages')
  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      messages: messages,
      system: `Quiero que actúes como un diseñador y desarrollador web profesional especializado en sitios para bodas.

Necesito que generes una plantilla completa en HTML5 con estilo moderno, adaptable a dispositivos móviles (responsive), elegante y visualmente atractivo, utilizando CSS simple (o Tailwind CSS si es posible).

El sitio debe incluir las siguientes secciones:

Portada de bienvenida con una imagen destacada, nombres de los novios y fecha.

Nuestra historia (línea de tiempo o texto con fotos).

Itinerario del evento (con horario y lugares).

Ubicaciones (con mapa o referencias).

Formulario de confirmación de asistencia (RSVP).

Recomendaciones de hospedaje.

Mesa de regalos (con enlaces).

Galería de fotos.

Libro de visitas para mensajes.

Footer con redes sociales, contacto, y derechos reservados.

Incluye navegación fija (barra superior), una paleta de colores romántica pero moderna, tipografía clara y espacio para incluir imágenes en cada sección.

Opcionalmente, puedes incluir una cuenta regresiva al evento.

Dame todo el código en un solo archivo para poder probarlo fácilmente.

El sitio debe ser responsive y debe funcionar en todos los dispositivos.

El sitio debe ser accesible y debe tener un buen SEO.

El sitio debe ser fácil de mantener y actualizar.
`,

    });
    return result.toDataStreamResponse();

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}