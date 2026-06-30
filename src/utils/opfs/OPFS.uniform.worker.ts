/// <reference lib="webworker" />
import { registerWorkerAPI } from "fest/uniform";
import type { MessageEnvelope } from "fest/uniform";

// Import the handlers directly from the OPFS worker module
import { handlers } from './OPFS.worker.js';

// Register all OPFS handlers with the uniform worker API
if (handlers) {
    registerWorkerAPI(handlers);
}

// Handle optimized protocol messages
const processMessage = async (envelope: MessageEnvelope) => {
    try {
        if (envelope.type === "batch") {
            // Handle batched messages
            const results = [];
            for (const msg of envelope.payload) {
                const result = await processSingleMessage(msg);
                results.push(result as never);
            }
            return results;
        } else {
            return await processSingleMessage(envelope);
        }
    } catch (error) {
        console.error("[OPFS Worker] Message processing error:", error);
        throw error;
    }
};

const processSingleMessage = async (envelope: MessageEnvelope) => {
    const handler = handlers[envelope.type];
    if (!handler) {
        throw new Error(`Unknown message type: ${envelope.type}`);
    }

    return await handler(envelope.payload);
};

// Register the message processor
(globalThis as any).processMessage = processMessage;

// Dynamically import OPFS functionality
const initWorker = async () => {
    try {
        // Import the OPFS module dynamically
        const opfsModule = await import('./OPFS.worker.ts');

        // Get the handlers from the imported module
        const handlers = opfsModule.handlers;

        // Register all OPFS handlers with the uniform worker API
        if (handlers) {
            registerWorkerAPI(handlers);
        }

        console.log('[OPFS Worker] Initialized with handlers:', Object.keys(handlers || {}));
    } catch (error) {
        console.error('[OPFS Worker] Failed to initialize:', error);
    }
};

// Initialize the worker
initWorker();