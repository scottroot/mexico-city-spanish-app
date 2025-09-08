# ENHANCE REQUEST
fetch("https://api.us.elevenlabs.io/v1/enhance-dialogue", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    'xi-api-key: $ELEVENLABS_API_KEY'
  },
  "body": "{\"dialogue_blocks\":[\"La niña y el gato...\\n\\n\\n\\nAna es una niña. Vive en una casa pequeña con su mamá y su papá. Ana tiene un gato. El gato se llama Coco. Es blanco y negro.\\n\\nCada mañana, Ana dice: [happy] “Hola, Coco.” El gato corre a la cocina. Ana come pan y bebe leche. Coco bebe agua. Ana toca al gato y [chuckles] sonríe.\\n\\nUn día, Coco no está en la cocina. Ana busca en la sala. No está. Busca en el cuarto. No está. [sad] Ana está triste.\\n\\nDespués, escucha un sonido en el jardín. [surprised] “¡Miau, miau!” Es Coco. El gato corre hacia Ana. Ana abraza a Coco. [excited] ¡Está feliz!\\n\\nPor la noche, Ana dice a sus papás: [thoughtful] “Hoy Coco juega en el jardín.” Todos ríen en la mesa. Coco duerme en la silla. Ana también duerme feliz.\"]}",
  "method": "POST",
});
# RESPONSE
{
    "enhanced": true,
    "enhanced_blocks": [
        "La niña y el gato...\n\n\n\nAna es una niña. Vive en una casa pequeña con su mamá y su papá. Ana tiene un gato. El gato se llama Coco. Es blanco y negro.\n\nCada mañana, Ana dice: [happy] “Hola, Coco.” El gato corre a la cocina. Ana come pan y bebe leche. Coco bebe agua. Ana toca al gato y [chuckles] sonríe.\n\nUn día, Coco no está en la cocina. Ana busca en la sala. No está. Busca en el cuarto. No está. [sad] Ana está triste.\n\nDespués, escucha un sonido en el jardín. [surprised] “¡Miau, miau!” Es Coco. El gato corre hacia Ana. Ana abraza a Coco. [excited] ¡Está feliz!\n\nPor la noche, Ana dice a sus papás: [thoughtful] “Hoy Coco juega en el jardín.” Todos ríen en la mesa. Coco duerme en la silla. Ana también duerme feliz."
    ]
}

# SDK
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
const elevenlabs = new ElevenLabsClient({
  apiKey: 'YOUR_API_KEY',
});

