// Configuración desde config.js
const endpoint = config.computerVision.endpoint;
const apiKey = config.computerVision.apiKey;

window.addEventListener('DOMContentLoaded', () => {
    configurarSubidaArchivos();
});

function configurarSubidaArchivos() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            procesarArchivo(archivo);
        }
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.opacity = '0.8';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.opacity = '1';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.opacity = '1';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            procesarArchivo(file);
        }
    });
}

function procesarArchivo(archivo) {
    if (!archivo.type.startsWith('image/')) {
        mostrarError('Por favor, selecciona una imagen válida');
        return;
    }

    mostrarCargando(true);
    mostrarVistaPrevia(archivo);
    analizarImagen(archivo);
}

function mostrarVistaPrevia(archivo) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const imagen = document.getElementById('imagePreview');
        const container = document.getElementById('imageContainer');
        imagen.src = e.target.result;
        container.classList.remove('d-none');
    };
    
    reader.readAsDataURL(archivo);
}

async function analizarImagen(archivo) {
    ocultarMensajes();

    try {
        const imagenBytes = await archivo.arrayBuffer();

        const url = `${endpoint.replace(/\/$/, '')}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color,Objects,Tags,Faces`;

        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Content-Type': 'application/octet-stream'
            },
            body: imagenBytes
        });

        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            throw new Error(`Error ${respuesta.status}: ${errorTexto}`);
        }

        const datos = await respuesta.json();
        mostrarResultados(datos);

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al analizar la imagen: ' + error.message);
    } finally {
        mostrarCargando(false);
    }
}

function mostrarResultados(datos) {
    const resultadosDiv = document.getElementById('results');
    let html = '';

    if (datos.description && datos.description.captions && datos.description.captions.length > 0) {
        html += '<div class="result-item">';
        html += '<strong>Descripción:</strong><br>';
        datos.description.captions.forEach(caption => {
            if (caption.text) {
                html += `${caption.text}`;
                if (caption.confidence !== undefined) {
                    html += ` (${(caption.confidence * 100).toFixed(0)}%)`;
                }
                html += '<br>';
            }
        });
        html += '</div>';
    }

    if (datos.tags && datos.tags.length > 0) {
        html += '<div class="result-item">';
        html += '<strong>Etiquetas:</strong><br>';
        datos.tags.slice(0, 10).forEach(tag => {
            if (tag.name) {
                html += `${tag.name}`;
                if (tag.confidence !== undefined) {
                    html += ` (${(tag.confidence * 100).toFixed(0)}%)`;
                }
                html += '<br>';
            }
        });
        html += '</div>';
    }

    if (datos.color && datos.color.dominantColors && datos.color.dominantColors.length > 0) {
        html += '<div class="result-item">';
        html += '<strong>Colores:</strong><br>';
        html += `${datos.color.dominantColors.join(', ')}<br>`;
        html += '</div>';
    }

    if (datos.objects && datos.objects.length > 0) {
        html += '<div class="result-item">';
        html += '<strong>Objetos Detectados:</strong><br>';
        datos.objects.forEach(obj => {
            if (obj.object) {
                html += `${obj.object}`;
                if (obj.confidence !== undefined) {
                    html += ` (${(obj.confidence * 100).toFixed(0)}%)`;
                }
                html += '<br>';
            }
        });
        html += '</div>';
    }

    if (datos.faces && datos.faces.length > 0) {
        html += '<div class="result-item">';
        html += `<strong>Caras Detectadas: ${datos.faces.length}</strong><br>`;
        datos.faces.forEach((cara, index) => {
            let texto = `Cara ${index + 1}:`;
            if (cara.age !== undefined && cara.age !== null) {
                texto += ` Edad ~${cara.age} años`;
            }
            if (cara.gender !== undefined && cara.gender !== null) {
                texto += `, ${cara.gender}`;
            }
            html += texto + '<br>';
        });
        html += '</div>';
    }

    if (html === '') {
        html = '<div class="result-item">No se pudieron obtener resultados.</div>';
    }

    resultadosDiv.innerHTML = html;
    mostrarExito('Imagen analizada correctamente');
}

function mostrarCargando(mostrar) {
    const loadingDiv = document.getElementById('loading');
    if (mostrar) {
        loadingDiv.classList.remove('d-none');
    } else {
        loadingDiv.classList.add('d-none');
    }
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = `<div class="alert alert-danger">${mensaje}</div>`;
}

function mostrarExito(mensaje) {
    const exitoDiv = document.getElementById('successMessage');
    exitoDiv.innerHTML = `<div class="alert alert-success">${mensaje}</div>`;
    setTimeout(() => {
        exitoDiv.innerHTML = '';
    }, 3000);
}

function ocultarMensajes() {
    document.getElementById('errorMessage').innerHTML = '';
    document.getElementById('successMessage').innerHTML = '';
}

