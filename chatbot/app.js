const SECRET_KEY = config.chatbot.secretKey;
const BOT_NAME = config.chatbot.botName;

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = 'Error: ' + message;
  errorDiv.style.display = 'block';
}

async function initWebChat() {
  try {
    const response = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al obtener token: ' + response.status + ' - ' + errorText);
    }

    const data = await response.json();
    const token = data.token;

    window.WebChat.renderWebChat({
      directLine: window.WebChat.createDirectLine({
        token: token
      }),
      styleOptions: {
        botAvatarInitials: '🧙',
        userAvatarInitials: '👤',
        bubbleBackground: '#E8E8E8',
        bubbleBorderRadius: 10,
        bubbleFromUserBackground: '#0078D4',
        bubbleFromUserTextColor: 'white',
        sendBoxButtonColor: '#0078D4',
        sendBoxButtonColorOnHover: '#005A9E'
      }
    }, document.getElementById('webchat'));

  } catch (error) {
    console.error('Error al inicializar Web Chat:', error);
    showError('No se pudo conectar con el bot. Verifica que el secret key sea correcto y que el bot esté habilitado en Azure Portal.');
    
    const webchatDiv = document.getElementById('webchat');
    webchatDiv.innerHTML = '<iframe src="https://webchat.botframework.com/embed/' + BOT_NAME + '?s=' + SECRET_KEY + '" style="min-width: 400px; width: 100%; height: 100%; border: none;"></iframe>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWebChat);
} else {
  initWebChat();
}
