const { endpoint, apiKey } = config.computerVision;

document.getElementById('btnAnalizar').onclick = async () => {
    const urlInput = document.getElementById('urlInput').value.trim();
    const fileInput = document.getElementById('fileInput').files[0];
    const spinner = document.getElementById('spinner');
    const btn = document.getElementById('btnAnalizar');
    
    if (!urlInput && !fileInput) {
        mostrarError('Ingresa una URL o selecciona un archivo');
        return;
    }
    
    spinner.classList.remove('d-none');
    btn.disabled = true;
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('errorMessage').innerHTML = '';
    document.getElementById('results').classList.add('d-none');
    
    try {
        const endpointUrl = endpoint.replace(/\/$/, '');
        const apiUrl = `${endpointUrl}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color,Objects,Tags,Faces&details=Landmarks&language=en`;
        
        let headers = { 'Ocp-Apim-Subscription-Key': apiKey };
        let body;
        let contentType;
        
        if (urlInput) {
            contentType = 'application/json';
            headers['Content-Type'] = contentType;
            body = JSON.stringify({ url: urlInput });
            document.getElementById('imageContainer').innerHTML = `<img src="${urlInput}" class="img-fluid rounded shadow" style="max-height: 400px;">`;
            document.getElementById('imagePreview').classList.remove('d-none');
        } else {
            contentType = 'application/octet-stream';
            headers['Content-Type'] = contentType;
            body = await fileInput.arrayBuffer();
            const reader = new FileReader();
            reader.onload = e => {
                document.getElementById('imageContainer').innerHTML = `<img src="${e.target.result}" class="img-fluid rounded shadow" style="max-height: 400px;">`;
                document.getElementById('imagePreview').classList.remove('d-none');
            };
            reader.readAsDataURL(fileInput);
        }
        
        const res = await fetch(apiUrl, { method: 'POST', headers, body });
        
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        
        const data = await res.json();
        mostrarResultados(data);
        
        const fileForOCR = urlInput ? null : fileInput;
        const urlForOCR = urlInput ? urlInput : null;
        analizarTexto(fileForOCR, urlForOCR);
    } catch (error) {
        mostrarError(error.message);
    } finally {
        spinner.classList.add('d-none');
        btn.disabled = false;
        document.getElementById('loading').classList.add('d-none');
    }
};

function mostrarResultados(datos) {
    let html = '';
    
    if (datos.description?.captions?.length) {
        const conf = ((datos.description.captions[0].confidence || 0) * 100).toFixed(0);
        html += `<div class="result-card mb-3 p-3 rounded">
            <strong class="text-primary d-block mb-2">📝 Caption</strong>
            <p class="mb-0">${datos.description.captions[0].text} <span class="badge bg-success">${conf}%</span></p>
        </div>`;
    }
    
    if (datos.tags?.length) {
        html += `<div class="result-card mb-3 p-3 rounded">
            <strong class="text-primary d-block mb-2">🏷️ Tags</strong>
            <div>${datos.tags.slice(0, 10).map(t => `<span class="badge bg-info me-1 mb-1">${t.name}</span>`).join('')}</div>
        </div>`;
    }
    
    if (datos.objects?.length) {
        html += `<div class="result-card mb-3 p-3 rounded">
            <strong class="text-primary d-block mb-2">🔍 Objects</strong>
            <div>${datos.objects.map(o => `<span class="badge bg-warning text-dark me-1 mb-1">${o.object}</span>`).join('')}</div>
        </div>`;
    }
    
    if (datos.faces?.length) {
        html += `<div class="result-card mb-3 p-3 rounded">
            <strong class="text-primary d-block mb-2">👤 Faces</strong>
            <p class="mb-0"><span class="badge bg-danger">${datos.faces.length} cara(s) detectada(s)</span></p>
        </div>`;
    }
    
    document.getElementById('resultsContent').innerHTML = html || '<p class="text-muted">No se encontraron resultados</p>';
    document.getElementById('results').classList.remove('d-none');
}

async function analizarTexto(archivo, urlImagen) {
    try {
        const endpointUrl = endpoint.replace(/\/$/, '');
        const apiUrl = `${endpointUrl}/vision/v3.2/read/analyze`;
        
        let headers = { 'Ocp-Apim-Subscription-Key': apiKey };
        let body;
        
        if (urlImagen) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify({ url: urlImagen });
        } else {
            headers['Content-Type'] = 'application/octet-stream';
            body = await archivo.arrayBuffer();
        }
        
        const res = await fetch(apiUrl, { method: 'POST', headers, body });
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        
        const operationLocation = res.headers.get('Operation-Location');
        if (!operationLocation) throw new Error('No se obtuvo Operation-Location');
        
        let result = await obtenerResultadoOCR(operationLocation);
        mostrarTextoOCR(result);
    } catch (error) {
        console.error('Error en OCR:', error);
    }
}

async function obtenerResultadoOCR(operationLocation) {
    const headers = { 'Ocp-Apim-Subscription-Key': apiKey };
    
    while (true) {
        const res = await fetch(operationLocation, { headers });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        
        const data = await res.json();
        if (data.status === 'succeeded') return data;
        if (data.status === 'failed') throw new Error('OCR failed');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function mostrarTextoOCR(datos) {
    if (datos.analyzeResult?.readResults?.length) {
        let textoCompleto = '';
        datos.analyzeResult.readResults.forEach(page => {
            if (page.lines) {
                page.lines.forEach(line => {
                    if (line.text) {
                        textoCompleto += line.text + ' ';
                    }
                });
            }
        });
        
        if (textoCompleto.trim()) {
            const html = `<div class="result-card mb-3 p-3 rounded">
                <strong class="text-primary d-block mb-2">📄 Texto Detectado (OCR)</strong>
                <p class="mb-0" style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">${textoCompleto.trim()}</p>
            </div>`;
            
            const resultsContent = document.getElementById('resultsContent');
            resultsContent.innerHTML += html;
            document.getElementById('results').classList.remove('d-none');
        }
    }
}

function mostrarError(mensaje) {
    document.getElementById('errorMessage').innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Error:</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}
