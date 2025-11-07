# Servicios Azure AI - Proyecto de Integración

Proyecto de demostración que integra tres servicios de Azure AI: **Computer Vision**, **Translator** y **Chatbot** utilizando JavaScript, HTML y Bootstrap.

![Azure Services](https://img.shields.io/badge/Azure-AI%20Services-0078D4?style=for-the-badge&logo=microsoft-azure)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

## 📋 Descripción

Este proyecto demuestra cómo integrar servicios de **Azure Cognitive Services** en una aplicación web frontend utilizando JavaScript puro. Incluye tres módulos independientes:

### 🔹 Computer Vision
Analiza imágenes con inteligencia artificial para:
- Generar descripciones automáticas
- Detectar objetos y etiquetas
- Reconocer texto (OCR)
- Identificar rostros
- Analizar colores

### 🔹 Translator
Traduce texto entre más de 100 idiomas con:
- Detección automática de idioma
- Traducción en tiempo real
- Soporte para múltiples idiomas
- Intercambio de idiomas

### 🔹 Chatbot
Bot conversacional con tema de Harry Potter:
- Interfaz de chat moderna
- Integración con Azure Bot Framework
- Conversaciones naturales

## 🚀 Requisitos Previos

Antes de comenzar, necesitas:

1. **Cuenta de Azure** (puedes crear una cuenta gratuita en [azure.microsoft.com](https://azure.microsoft.com/free/))
2. **Navegador web moderno** (Chrome, Firefox, Edge, Safari)
3. **Recursos creados en Azure Portal:**
   - Azure Computer Vision
   - Azure Translator
   - Azure Bot Service

## 📦 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd servicios-azure
```

### Paso 2: Configurar las Credenciales de Azure

1. **Copia el archivo de ejemplo:**
   ```bash
   cp config.js.example config.js
   ```

2. **Abre el archivo `config.js` y reemplaza los valores:**

```javascript
const config = {
    computerVision: {
        // 👉 Reemplaza con tu endpoint de Computer Vision
        endpoint: 'https://TU-RECURSO.cognitiveservices.azure.com/',
        // 👉 Reemplaza con tu clave de API
        apiKey: 'TU_API_KEY_AQUI'
    },
    translator: {
        // 👉 Reemplaza con tu clave de Translator
        key: 'TU_TRANSLATOR_KEY_AQUI',
        endpoint: 'https://api.cognitive.microsofttranslator.com',
        // 👉 Reemplaza con tu región (ejemplo: eastus, westeurope)
        location: 'TU_LOCATION_AQUI'
    },
    chatbot: {
        // 👉 Reemplaza con tu secret key del bot
        secretKey: 'TU_CHATBOT_SECRET_KEY_AQUI',
        // 👉 Reemplaza con el nombre de tu bot
        botName: 'TU_BOT_NAME_AQUI'
    }
};
```

## 🔑 Cómo Obtener las Credenciales de Azure

### Computer Vision

1. Ve a [Azure Portal](https://portal.azure.com)
2. Busca "Computer Vision" y crea un nuevo recurso
3. Una vez creado, ve a **"Claves y punto de conexión"**
4. Copia:
   - **Punto de conexión** → `endpoint`
   - **Clave 1 o Clave 2** → `apiKey`

### Translator

1. En Azure Portal, busca "Translator" y crea un nuevo recurso
2. Ve a **"Claves y punto de conexión"**
3. Copia:
   - **Clave 1 o Clave 2** → `key`
   - **Ubicación/Región** → `location` (ejemplo: `eastus`)

### Chatbot

1. En Azure Portal, busca "Azure Bot" y crea un nuevo recurso
2. Configura tu bot con QnA Maker o Language Understanding
3. Ve a **"Canales"** → **"Web Chat"**
4. En **"Default Site"**, copia:
   - **Secret keys** → `secretKey`
   - El nombre de tu bot → `botName`

## 🏃‍♂️ Cómo Ejecutar el Proyecto

### Opción 1: Usando Live Server (Visual Studio Code)

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 📁 Estructura del Proyecto

```
servicios-azure/
│
├── index.html              # Página principal con navegación
├── styles.css              # Estilos globales
├── config.js               # ⚙️ Configuración de credenciales (NO subir a Git)
├── config.js.example       # Plantilla de configuración
│
├── vision/                 # Módulo Computer Vision
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── traductor/              # Módulo Translator
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
└── chatbot/                # Módulo Chatbot
    ├── index.html
    ├── app.js
    └── styles.css
```

## 🎯 Uso de los Servicios

### Computer Vision
1. Ve a la sección "Computer Vision"
2. Ingresa una URL de imagen o sube un archivo
3. Haz clic en "Analizar Imagen"
4. Revisa los resultados: descripción, objetos, tags, caras y texto

### Translator
1. Ve a la sección "Translator"
2. Selecciona idioma de origen (o detección automática)
3. Selecciona idioma de destino
4. Escribe o pega el texto a traducir
5. Haz clic en "Traducir"
6. Copia el resultado de la traducción

### Chatbot
1. Ve a la sección "Chatbot"
2. Escribe tu mensaje sobre Harry Potter
3. Presiona Enter o el botón de enviar
4. Espera la respuesta del bot

**Ejemplos de preguntas que puedes hacerle al bot:**
- ¿Quién es el protagonista de la saga?
- ¿Quién es el director de Hogwarts?
- ¿En qué casa está Harry?
- ¿Qué hechizo enciende la punta de la varita?
- ¿Qué hechizo hace que los objetos leviten?
- ¿Qué deporte juegan los magos en el aire?
- ¿Quién es el guardabosques de Hogwarts?
- ¿Qué objeto decide en qué casa irá cada estudiante?
- ¿Qué ave mágica renace de sus cenizas?
- ¿Qué objeto permite volverse invisible?
- ¿Dónde se guarda el dinero de los magos?
- ¿Qué criatura gigante vive en la Cámara de los Secretos?

## ⚠️ Seguridad Importante

### ⚡ NO SUBAS EL ARCHIVO `config.js` A GIT

Este archivo contiene tus claves secretas. Para evitar subirlo:

```bash
# Asegúrate de que esté en .gitignore
echo "config.js" >> .gitignore
```

### 🔒 Mejores Prácticas

- **En desarrollo:** Usa el archivo `config.js` local
- **En producción:** Usa variables de entorno del servidor o Azure Key Vault
- **Nunca compartas** tus claves API en repositorios públicos
- **Regenera las claves** si fueron expuestas accidentalmente

## 🐛 Solución de Problemas

### Computer Vision no analiza la imagen
- Verifica que la URL de la imagen sea accesible públicamente
- Si subes archivo, asegúrate que sea una imagen válida (JPG, PNG)

### Translator no traduce
- Confirma que la clave y la región sean correctas
- Verifica que ambos idiomas sean diferentes (o usa detección automática)

### Chatbot no responde
- Asegúrate de que el bot esté publicado en Azure
- Verifica que el canal Web Chat esté habilitado
- Comprueba que el Secret Key sea válido

## 📚 Tecnologías Utilizadas

- **HTML5** - Estructura
- **CSS3** - Estilos personalizados
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Bootstrap 5.3** - Framework CSS
- **Azure Computer Vision API v3.2** - Análisis de imágenes
- **Azure Translator API v3.0** - Traducción de texto
- **Azure Bot Framework** - Chatbot conversacional