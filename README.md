# 🎭 Sistema de Agentes para Sitios Web de Boda

Este proyecto implementa un sistema modular de agentes especializados para crear sitios web de bodas de forma individual y colaborativa.

## 🏗️ Arquitectura

### Agentes Disponibles

1. **🏠 Portada** (`portada`)
   - Genera la sección principal con nombres de los novios
   - Incluye fecha de la boda y diseño elegante
   - Múltiples estilos: romántico, elegante, rústico, moderno

2. **💌 Nuestra Historia** (`nuestra_historia`)
   - Crea timeline de momentos importantes
   - Estilos: timeline, cards, story
   - Soporte para imágenes y fechas

3. **⏰ Itinerario** (`itinerario`)
   - Genera horarios y actividades del evento
   - Estilos: timeline, cards, list
   - Iconos personalizables por evento

4. **📍 Ubicaciones** (`ubicaciones`)
   - Información de lugares del evento
   - Integración con Google Maps
   - Instrucciones de transporte y estacionamiento

5. **✅ RSVP** (`rsvp`)
   - Formulario de confirmación de asistencia
   - Selección de menú y acompañantes
   - Validación y mensajes de confirmación

6. **🏨 Hospedaje** (`hospedaje`)
   - Hoteles recomendados cercanos
   - Enlaces de reserva y contacto
   - Estilos: cards, list, grid

7. **🎁 Mesa de Regalos** (`mesa_regalos`)
   - Opciones de compra y transferencias
   - Enlaces a tiendas online
   - Mensajes de agradecimiento

8. **📸 Galería** (`galeria`)
   - Galería de fotos con lightbox
   - Estilos: grid, masonry, carousel
   - Soporte para títulos y descripciones

9. **⏳ Cuenta Regresiva** (`cuenta_regresiva`)
   - Contador hacia la fecha del evento
   - Animaciones y estilos personalizables
   - Mensaje especial cuando llega la fecha

10. **🪪 Footer** (`footer`)
    - Información de contacto
    - Redes sociales
    - Créditos y mensajes románticos

## 🚀 Uso

### Endpoint Principal
```
POST /api/wedding-chat
```

### Ejemplo de Uso
```javascript
const response = await fetch('/api/wedding-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Crea la portada para la boda de Juan y María' }]
  })
});
```

### Ejemplos de Solicitudes

#### Crear Portada
```
"Crea la portada para la boda de Juan y María el 15 de diciembre de 2024"
```

#### Generar Itinerario
```
"Crea el itinerario para nuestra boda con ceremonia a las 4pm, cóctel a las 5pm y recepción a las 7pm"
```

#### Sitio Web Completo
```
"Crea un sitio web completo para la boda de Ana y Carlos el 20 de junio de 2024. Incluye todas las secciones necesarias."
```

## 🛠️ Tecnologías

- **Framework**: Next.js 14 con App Router
- **IA**: OpenAI GPT-4 con AI SDK
- **Herramientas**: Zod para validación de esquemas
- **Estilos**: Tailwind CSS
- **Streaming**: Respuestas en tiempo real

## 📁 Estructura de Archivos

```
app/api/tools/
├── portada/index.ts
├── nuestra-historia/index.ts
├── itinerario/index.ts
├── ubicaciones/index.ts
├── rsvp/index.ts
├── hospedaje/index.ts
├── mesa-regalos/index.ts
├── galeria/index.ts
├── cuenta-regresiva/index.ts
├── footer/index.ts
└── index.ts (exporta todas las herramientas)

app/api/
├── wedding-chat/route.ts (endpoint principal)
└── main-chat/route.ts (chat general)

app/prompts/
└── system.ts (prompts del sistema)

app/
├── agents/page.tsx (página de demostración)
└── wedding-agents-demo.tsx (componente de demo)
```

## 🎨 Características

### Modularidad
- Cada agente es independiente y especializado
- Fácil agregar nuevos agentes
- Reutilización de código

### Flexibilidad
- Múltiples estilos por agente
- Parámetros personalizables
- HTML semántico y accesible

### Integración
- Uso de herramientas de AI SDK
- Streaming de respuestas
- Manejo de errores robusto

## 🔧 Configuración

### Variables de Entorno
```env
OPENAI_API_KEY=tu_api_key_aqui
```

### Dependencias
```json
{
  "ai": "^3.0.0",
  "@ai-sdk/openai": "^0.0.0",
  "zod": "^3.22.0"
}
```

## 🚀 Demo

Accede a la demostración en: `/agents`

La demo incluye:
- Interfaz de chat con agentes
- Ejemplos predefinidos
- Vista previa en tiempo real
- Información sobre todos los agentes

## 📝 Ejemplos de Respuestas

### Portada
```html
<section class="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
  <!-- Contenido de la portada -->
</section>
```

### Itinerario
```html
<section class="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
  <!-- Timeline de eventos -->
</section>
```

## 🤝 Contribución

Para agregar un nuevo agente:

1. Crear directorio en `app/api/tools/nuevo-agente/`
2. Implementar `index.ts` con schema y función de ejecución
3. Exportar en `app/api/tools/index.ts`
4. Actualizar prompts del sistema

## 📄 Licencia

Este proyecto está bajo la licencia MIT. 
