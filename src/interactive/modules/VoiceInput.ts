export interface VoiceInputOptions {
    language?: string;
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
}

export class VoiceInputManager {
    private recognition: any = null;
    private isListening: boolean = false;
    private options: VoiceInputOptions;

    constructor(options: VoiceInputOptions = {}) {
        this.options = {
            language: 'en-US',
            continuous: false,
            interimResults: false,
            maxAlternatives: 1,
            ...options
        };

        this.initializeRecognition();
    }

    /**
     * Initialize speech recognition if supported
     */
    private initializeRecognition(): void {
        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = this.options.language;
        this.recognition.continuous = this.options.continuous;
        this.recognition.interimResults = this.options.interimResults;
        this.recognition.maxAlternatives = this.options.maxAlternatives;
    }

    /**
     * Check if speech recognition is supported
     */
    isSupported(): boolean {
        return this.recognition !== null;
    }

    /**
     * Start listening for speech input
     */
    startListening(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.recognition) {
                reject(new Error('Speech recognition not supported'));
                return;
            }

            if (this.isListening) {
                reject(new Error('Already listening'));
                return;
            }

            let done = false;
            const finish = (value: string | null) => {
                if (done) return;
                done = true;
                this.isListening = false;
                try {
                    this.recognition.stop();
                } catch {
                    // ignore
                }
                if (value) {
                    resolve(value);
                } else {
                    reject(new Error('No speech detected'));
                }
            };

            // Set up event handlers
            this.recognition.onresult = (e: any) => {
                const text = String(e?.results?.[0]?.[0]?.transcript || "").trim();
                finish(text || null);
            };

            this.recognition.onerror = () => finish(null);
            this.recognition.onend = () => finish(null);

            // Start recognition
            try {
                this.isListening = true;
                this.recognition.start();
            } catch (error) {
                this.isListening = false;
                reject(error);
            }
        });
    }

    /**
     * Stop listening
     */
    stopListening(): void {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch {
                // ignore
            }
            this.isListening = false;
        }
    }

    /**
     * Check if currently listening
     */
    getIsListening(): boolean {
        return this.isListening;
    }

    /**
     * Set recognition language
     */
    setLanguage(language: string): void {
        this.options.language = language;
        if (this.recognition) {
            this.recognition.lang = language;
        }
    }

    /**
     * Get available languages (limited support in browsers)
     */
    getAvailableLanguages(): string[] {
        // Most browsers don't expose available languages
        // This is a common set supported by Chrome
        return [
            'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-IE',
            'es-ES', 'es-US', 'es-MX', 'es-AR', 'es-CO', 'es-CL',
            'fr-FR', 'fr-CA', 'de-DE', 'it-IT', 'pt-BR', 'pt-PT',
            'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW', 'ar-SA',
            'hi-IN', 'nl-NL', 'sv-SE', 'no-NO', 'da-DK', 'fi-FI'
        ];
    }

    /**
     * Clean up resources
     */
    destroy(): void {
        this.stopListening();
        this.recognition = null;
    }
}

/**
 * Get speech prompt with timeout
 */
export async function getSpeechPrompt(
    options: VoiceInputOptions & { timeout?: number } = {}
): Promise<string | null> {
    const { timeout = 10000, ...voiceOptions } = options;

    const voiceManager = new VoiceInputManager(voiceOptions);

    if (!voiceManager.isSupported()) {
        console.warn('Speech recognition not supported');
        return null;
    }

    try {
        // Create a promise that resolves when speech is detected or times out
        const speechPromise = voiceManager.startListening();

        // Create a timeout promise
        const timeoutPromise = new Promise<string>((_, reject) => {
            setTimeout(() => {
                voiceManager.stopListening();
                reject(new Error('Speech recognition timeout'));
            }, timeout);
        });

        // Race between speech detection and timeout
        return await Promise.race([speechPromise, timeoutPromise]);

    } catch (error) {
        console.warn('Speech recognition failed:', error);
        return null;
    } finally {
        voiceManager.destroy();
    }
}

/**
 * Check if speech recognition is available
 */
export function isSpeechRecognitionAvailable(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
}

/**
 * Get user media permission for microphone (if needed)
 */
export async function requestMicrophonePermission(): Promise<boolean> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately after getting permission
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch {
        return false;
    }
}