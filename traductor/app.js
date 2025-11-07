const translatorKey = config.translator.key;
const translatorEndpoint = config.translator.endpoint;
const translatorRegion = config.translator.location;

const nombresIdiomas = {
    'auto': 'Detectado automáticamente',
    'es': 'Español',
    'en': 'Inglés',
    'fr': 'Francés',
    'de': 'Alemán',
    'it': 'Italiano',
    'pt': 'Portugués',
    'ru': 'Ruso',
    'ja': 'Japonés',
    'zh': 'Chino',
    'ko': 'Coreano',
    'ar': 'Árabe'
};

function obtenerElemento(id) {
    return document.getElementById(id);
}

function mostrarError(mensaje) {
    const errorDiv = obtenerElemento('errorMessage');
    errorDiv.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
        '<strong>Error:</strong> ' + mensaje +
        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
        '</div>';
}

function generarUUID() {
    if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return uuid.replace(/[xy]/g, function(caracter) {
        const numeroAleatorio = Math.random() * 16 | 0;
        const valor = (caracter === 'x') ? numeroAleatorio : (numeroAleatorio & 0x3 | 0x8);
        return valor.toString(16);
    });
}

obtenerElemento('textInput').addEventListener('input', function() {
    const texto = this.value;
    const cantidad = texto.length;
    const contador = obtenerElemento('charCount');
    
    contador.textContent = cantidad;
    
    if (cantidad > 4500) {
        contador.classList.add('text-danger');
    } else {
        contador.classList.remove('text-danger');
    }
});

obtenerElemento('swapLanguages').addEventListener('click', function() {
    const selectOrigen = obtenerElemento('fromLanguage');
    const selectDestino = obtenerElemento('toLanguage');
    const valorOrigen = selectOrigen.value;
    const valorDestino = selectDestino.value;
    
    if (valorOrigen === 'auto') {
        mostrarError('No se puede intercambiar cuando el idioma de origen es "Detectar automáticamente"');
        return;
    }
    
    selectOrigen.value = valorDestino;
    selectDestino.value = valorOrigen;
});

obtenerElemento('btnTraducir').addEventListener('click', traducir);

async function traducir() {
    const texto = obtenerElemento('textInput').value.trim();
    const idiomaOrigen = obtenerElemento('fromLanguage').value;
    const idiomaDestino = obtenerElemento('toLanguage').value;
    
    if (texto === '') {
        mostrarError('Por favor, ingresa un texto para traducir');
        return;
    }
    
    if (idiomaOrigen === idiomaDestino && idiomaOrigen !== 'auto') {
        mostrarError('El idioma de origen y destino no pueden ser iguales');
        return;
    }
    
    const spinner = obtenerElemento('spinner');
    const btnTraducir = obtenerElemento('btnTraducir');
    spinner.classList.remove('d-none');
    btnTraducir.disabled = true;
    
    obtenerElemento('loading').classList.remove('d-none');
    obtenerElemento('errorMessage').innerHTML = '';
    obtenerElemento('results').classList.add('d-none');
    
    try {
        const url = translatorEndpoint.replace(/\/$/, '') + '/translate';
        
        const parametros = new URLSearchParams();
        parametros.append('api-version', '3.0');
        parametros.append('to', idiomaDestino);
        if (idiomaOrigen !== 'auto') {
            parametros.append('from', idiomaOrigen);
        }
        
        const headers = {
            'Ocp-Apim-Subscription-Key': translatorKey,
            'Ocp-Apim-Subscription-Region': translatorRegion,
            'Content-Type': 'application/json',
            'X-ClientTraceId': generarUUID()
        };
        
        const body = JSON.stringify([
            {
                'text': texto
            }
        ]);
        
        const respuesta = await fetch(url + '?' + parametros.toString(), {
            method: 'POST',
            headers: headers,
            body: body
        });
        
        if (!respuesta.ok) {
            const textoError = await respuesta.text();
            let mensajeError = 'Error ' + respuesta.status;
            
            try {
                const errorJson = JSON.parse(textoError);
                if (errorJson.error && errorJson.error.message) {
                    mensajeError = errorJson.error.message;
                }
            } catch (e) {
                if (textoError) mensajeError = textoError;
            }
            
            throw new Error(mensajeError);
        }
        
        const datos = await respuesta.json();
        
        if (!datos || !datos[0] || !datos[0].translations || datos[0].translations.length === 0) {
            mostrarError('No se pudo obtener la traducción');
            return;
        }
        
        const traduccion = datos[0].translations[0];
        const idiomaDetectado = datos[0].detectedLanguage?.language || idiomaOrigen;
        
        mostrarResultados(traduccion, idiomaDetectado, idiomaOrigen, idiomaDestino);
        
        window.lastTranslation = traduccion.text;
        
    } catch (error) {
        mostrarError(error.message);
    } finally {
        spinner.classList.add('d-none');
        btnTraducir.disabled = false;
        obtenerElemento('loading').classList.add('d-none');
    }
}

function mostrarResultados(traduccion, idiomaDetectado, idiomaOrigen, idiomaDestino) {
    const nombreOrigen = nombresIdiomas[idiomaDetectado] || idiomaDetectado;
    const nombreDestino = nombresIdiomas[idiomaDestino] || idiomaDestino;
    
    let html = '<div class="result-card mb-3 p-4 rounded">';
    html += '<div class="mb-3">';
    html += '<small class="text-muted d-block mb-2">';
    html += '<strong>De:</strong> ' + nombreOrigen;
    
    if (idiomaDetectado !== idiomaOrigen) {
        html += ' (detectado: ' + idiomaDetectado + ')';
    }
    
    html += '<span class="ms-3"><strong>A:</strong> ' + nombreDestino + '</span>';
    html += '</small>';
    html += '</div>';
    html += '<div class="translation-result p-3 rounded" style="background: #f8f9fa; border-left: 4px solid #667eea; font-size: 1.1rem; line-height: 1.6;">';
    html += traduccion.text;
    html += '</div>';
    html += '</div>';
    
    obtenerElemento('resultsContent').innerHTML = html;
    obtenerElemento('results').classList.remove('d-none');
}

obtenerElemento('btnLimpiar').addEventListener('click', function() {
    obtenerElemento('textInput').value = '';
    obtenerElemento('charCount').textContent = '0';
    obtenerElemento('results').classList.add('d-none');
    obtenerElemento('errorMessage').innerHTML = '';
    window.lastTranslation = null;
});
