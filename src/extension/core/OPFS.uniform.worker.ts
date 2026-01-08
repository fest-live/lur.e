/// <reference lib="webworker" />
import { registerWorkerAPI } from "fest/uniform";
import { MessageEnvelope } from "fest/uniform/src/optimized-protocol";

// Import the handlers directly from the OPFS worker module
import { handlers } from './OPFS.worker.ts';

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
                results.push(result);
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