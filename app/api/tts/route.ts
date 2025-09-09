import { NextRequest, NextResponse } from 'next/server';
import { type DeepgramModel } from '@/lib/deepgram';
const { createClient } = require("@deepgram/sdk");


const DEEPGRAM_CLIENT = createClient(process.env.DEEPGRAM_API_KEY);
const DEEPGRAM_ENCODING = "linear16";
const DEEPGRAM_CONTAINER = "wav";
const DEEPGRAM_SAMPLE_RATE = 48000;
const DEEPGRAM_BIT_RATE = 128000
// linear16	wav(default),none	8000,16000,24000,(default),32000,48000	Not Applicable
// mulaw	wav(default),none	8000(default),16000	Not Applicable
// alaw	wav(default),none	8000(default),16000	Not Applicable
// mp3(default)	Not Applicable	Not Configurable ( set to22050)	32000,48000 (default)
// opus	ogg(default)	Not Configurable (set to 48000)	Default: 12000 Range: >= 4000and <= 650000
// flac	Not Applicable	8000,16000,22050,32000,48000	Not Applicable
// aac	Not Applicable	Not Configurable (set to 22050)	Default:48000, Range: >=4000and <= 192000;


interface TTSRequest {
  text: string;
  model?: string;
}

interface TTSResponse {
  success: boolean;
  audioData?: string;
  contentType?: string;
  error?: string;
  fallback?: boolean;
}

export async function GET(request: NextRequest): Promise<NextResponse<TTSResponse> | NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    console.log('TTS request:', text);
    const modelParam = searchParams.get('model');
    
    if (!text) return NextResponse.json({ success: false, error: 'Text query parameter is required' }, { status: 400 });
    
    const model: DeepgramModel = (modelParam || process.env.DEEPGRAM_VOICE_MAN || 'aura-2-luna-es') as DeepgramModel;

    const response = await DEEPGRAM_CLIENT.speak.request(
      { text: `${text.replace("_", " ")}.` },
      { 
        model,
        encoding: DEEPGRAM_ENCODING,
        sample_rate: DEEPGRAM_SAMPLE_RATE,
        filler_words: false
      }
    );

    const stream = await response.getStream();
    
    return new NextResponse(stream, {
        headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
        'ETag': `"${Buffer.from(text + model).toString('base64')}"`, // Unique ETag for each text+model combination
        'Vary': 'Accept-Encoding'
        }
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<TTSResponse>> {
  try {
    const { text, model: modelParam }: TTSRequest = await request.json();
    
    if (!text) return NextResponse.json({ success: false, error: 'Text query parameter is required' }, { status: 400 });

    const model: DeepgramModel = (modelParam || process.env.DEEPGRAM_VOICE_WOMAN || 'aura-2-luna-es') as DeepgramModel;

    console.log('Server-side TTS request:', { text, model: model });

    const response = await DEEPGRAM_CLIENT.speak.request(
      { text },
      { model, encoding: DEEPGRAM_ENCODING,  sample_rate: DEEPGRAM_SAMPLE_RATE }
    );

    const stream = await response.getStream();
    
    return new NextResponse(stream, {
        headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=3600'
        }
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      },
      { status: 500 }
    );
  }
}
