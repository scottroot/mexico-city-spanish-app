// Function that does the Elevenlabs TTS for the provided text and saves the results to a file: audio.mp3, alignment.json, normalized-alignment.json

import { generateTTS } from './activities/stories/tts/elevenlabs';
import { promises as fs } from 'fs';
import path from 'path';


const text = `Un día en el parque

María vive en la Ciudad de México. Ella tiene diez años. María va al parque todos los domingos. El parque se llama Chapultepec. Es grande y bonito. Hay muchos árboles y flores. María juega con su hermano, Carlos. Carlos tiene ocho años. Ellos corren y ríen. También les gusta ver a los patos en el lago. Los patos son grises y blancos. María dice: "¡Mira, Carlos! ¡Los patos son divertidos!" Carlos responde: "Sí, son divertidos!"  

En el parque, hay un vendedor de elotes. María y Carlos ven al hombre. Él vende elotes con queso. María dice: "Quiero un elote, por favor." Carlos también quiere uno. El vendedor sonríe y dice: "Claro, aquí tienes." María y Carlos comen elotes. Están muy ricos.  

Después de comer, María ve a un grupo de niños. Ellos juegan a la pelota. María pregunta: "¿Puedo jugar?" Los niños dicen: "Sí, ven!"  

María juega con los niños. Carlos mira y aplaude. Ellos juegan hasta que el sol se pone. El parque se llena de luces. Es un día feliz. María dice: "Me gusta el parque. Me gusta jugar con amigos." Carlos está de acuerdo. Ellos regresan a casa contentos. El parque siempre es divertido.`;


async function testTTSGeneration() {
  const result = await generateTTS({ text, tempDir: './' });
  console.log(result);
}

testTTSGeneration();