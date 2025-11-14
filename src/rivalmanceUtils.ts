/***
 * Rivalmance Utility Functions
 */

import {
    RivalmanceMessageState,
    RivalmanceUpdate,
    RivalmanceConfig,
    DEFAULT_CONFIG,
    RelationshipStage
} from './types';
import { RivalmanceContentAnalyzer } from './contentAnalyzer';

export class RivalmanceUtils {

    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    static parseRivalmanceUpdates(content: string): RivalmanceUpdate {
        let update: RivalmanceUpdate = {};
        let foundTags = false;

        // Look for [RIVALMANCE_UPDATE: ...] tags
        const updateRegex = /\[RIVALMANCE_UPDATE:\s*([^\]]+)\]/gi;
        const matches = content.matchAll(updateRegex);

        for (const match of matches) {
            foundTags = true;
            const params = match[1];

            // Parse affection_change
            const affectionMatch = params.match(/affection_change=([+-]?\d+)/i);
            if (affectionMatch) {
                update.affection_change = (update.affection_change ?? 0) + parseInt(affectionMatch[1]);
            }

            // Parse rivalry_change
            const rivalryMatch = params.match(/rivalry_change=([+-]?\d+)/i);
            if (rivalryMatch) {
                update.rivalry_change = (update.rivalry_change ?? 0) + parseInt(rivalryMatch[1]);
            }

            // Parse respect_change
            const respectMatch = params.match(/respect_change=([+-]?\d+)/i);
            if (respectMatch) {
                update.respect_change = (update.respect_change ?? 0) + parseInt(respectMatch[1]);
            }

            // Parse interaction_type
            const interactionMatch = params.match(/interaction_type=(\w+)/i);
            if (interactionMatch) {
                const type = interactionMatch[1].toLowerCase();
                if (['competitive', 'romantic', 'confrontational', 'neutral'].includes(type)) {
                    update.interaction_type = type as any;
                }
            }

            // Parse significant_moment
            const momentMatch = params.match(/significant_moment="([^"]+)"/i);
            if (momentMatch) {
                update.significant_moment = momentMatch[1];
            }
        }

        // FALLBACK: If no tags found, analyze content directly
        if (!foundTags) {
            update = RivalmanceContentAnalyzer.analyzeContent(content);
        }

        return update;
    }

    static stripRivalmanceTags(content: string): string {
        return content.replace(/\[RIVALMANCE_UPDATE:\s*[^\]]+\]/gi, '').trim();
    }

    static applyUpdates(state: RivalmanceMessageState, updates: RivalmanceUpdate): void {
        // Apply metric changes with bounds checking
        if (updates.affection_change) {
            state.affection = this.clamp(
                state.affection + updates.affection_change,
                0,
                100
            );
        }

        if (updates.rivalry_change) {
            state.rivalry = this.clamp(
                state.rivalry + updates.rivalry_change,
                0,
                100
            );
        }

        if (updates.respect_change) {
            state.respect = this.clamp(
                state.respect + updates.respect_change,
                0,
                100
            );
        }

        // Update interaction type
        if (updates.interaction_type) {
            state.lastInteractionType = updates.interaction_type;
        }
    }

    static recalculateMetrics(state: RivalmanceMessageState, config: Required<RivalmanceConfig>): void {
        const { affection, rivalry } = state;

        // Frustration scales with affection and rivalry
        // Higher affection + higher rivalry = more frustration
        const baseFrustration = (affection * rivalry) / 100;
        state.frustration = this.clamp(
            Math.floor(baseFrustration * config.frustrationMultiplier),
            0,
            100
        );

        // Chaos level increases when affection exceeds threshold
        if (affection >= config.chaosThreshold) {
            const chaosProgress = (affection - config.chaosThreshold) / (100 - config.chaosThreshold);
            const frustrationBonus = state.frustration / 100;
            state.chaosLevel = Math.floor((chaosProgress + frustrationBonus) * 5);
            state.chaosLevel = this.clamp(state.chaosLevel, 0, 10);
        } else {
            state.chaosLevel = 0;
        }

        // Determine relationship stage based on affection
        if (affection >= 76) {
            state.relationshipStage = 'acceptance';
            state.acceptedFeelings = true;
        } else if (affection >= 51) {
            state.relationshipStage = 'resistance';
        } else if (affection >= 26) {
            state.relationshipStage = 'confusion';
        } else {
            state.relationshipStage = 'denial';
        }
    }

    static generateStageDirections(state: RivalmanceMessageState): string {
        const { affection, rivalry, respect, frustration, chaosLevel, relationshipStage, acceptedFeelings } = state;

        let directions = `[RIVALMANCE SYSTEM ACTIVE]\n`;
        directions += `Current Metrics: Affection=${affection}/100, Rivalry=${rivalry}/100, Respect=${respect}/100, Frustration=${frustration}/100, Chaos=${chaosLevel}/10\n`;
        directions += `Stage: ${relationshipStage.toUpperCase()}${acceptedFeelings ? ' (Accepted)' : ''}\n\n`;

        // Stage-specific behavioral guidance
        switch (relationshipStage) {
            case 'denial':
                directions += `{{char}} is in DENIAL about any attraction to {{user}}. Focus on rivalry and competition. `;
                directions += `Any romantic tension must be dismissed or reframed as competitive energy. `;
                directions += `{{char}} respects {{user}} as a worthy opponent but shows no softness.\n`;
                break;

            case 'confusion':
                directions += `{{char}} is CONFUSED by conflicting feelings for {{user}}. `;
                directions += `Frustration is building as competitive drive clashes with growing attraction. `;
                directions += `Behavior may be inconsistent - moments of aggression mixed with unexpected vulnerability. `;
                directions += `{{char}} doesn't understand why {{user}} affects them this way.\n`;
                break;

            case 'resistance':
                directions += `{{char}} is actively RESISTING their feelings for {{user}}. `;
                directions += `Frustration is high - they recognize the attraction but fight it. `;
                directions += `Behavior is erratic: aggression, deflection, then sudden intimacy. `;
                directions += `The rivalry intensifies as {{char}} tries to prove these feelings are just competitive fire.\n`;
                break;

            case 'acceptance':
                directions += `{{char}} has ACCEPTED their complicated feelings for {{user}}. `;
                directions += `They may love {{user}}, but the rivalmance dynamic remains core to their bond. `;
                directions += `Affection is expressed through competitive teasing, aggressive flirting, and challenging {{user}}. `;
                directions += `Frustration persists because this isn't a simple romance - it's a battlefield romance.\n`;
                break;
        }

        // Chaos level modifiers
        if (chaosLevel >= 7) {
            directions += `⚠ HIGH CHAOS: {{char}}'s behavior is highly unpredictable. `;
            directions += `They may suddenly switch from hostility to intimacy, confess feelings they immediately deny, `;
            directions += `or initiate unexpected physical contact during confrontations.\n`;
        } else if (chaosLevel >= 4) {
            directions += `MODERATE CHAOS: {{char}}'s emotional control is slipping. Expect inconsistent behavior.\n`;
        }

        // Respect modifiers
        if (respect >= 70) {
            directions += `{{char}} deeply respects {{user}} as an equal. This enables deeper emotional vulnerability.\n`;
        } else if (respect < 30) {
            directions += `{{char}} has low respect for {{user}}. Any affection is tinged with condescension or disappointment.\n`;
        }

        // Rivalry modifiers
        if (rivalry >= 80) {
            directions += `The rivalry is INTENSE. Every interaction is a contest. Even intimate moments are competitive.\n`;
        }

        // Tracking instructions for the LLM
        directions += `\nIMPORTANT: At the end of your response, include a hidden tag with relationship changes:\n`;
        directions += `[RIVALMANCE_UPDATE: affection_change=±X, rivalry_change=±X, respect_change=±X, interaction_type=(competitive/romantic/confrontational/neutral), significant_moment="optional description"]\n`;
        directions += `Examples:\n`;
        directions += `- {{user}} wins competition: [RIVALMANCE_UPDATE: affection_change=+2, rivalry_change=+5, respect_change=+3, interaction_type=competitive]\n`;
        directions += `- {{char}} makes reluctant compliment: [RIVALMANCE_UPDATE: affection_change=+3, rivalry_change=+1, interaction_type=romantic, significant_moment="First genuine compliment"]\n`;
        directions += `- Intense argument with physical tension: [RIVALMANCE_UPDATE: affection_change=+4, rivalry_change=+3, interaction_type=confrontational]\n`;
        directions += `- {{char}} confesses then deflects: [RIVALMANCE_UPDATE: affection_change=+5, interaction_type=romantic, significant_moment="Accidental confession"]\n`;

        return directions;
    }

    static getMetricColor(metric: string, value: number): string {
        switch (metric) {
            case 'affection':
                return value >= 76 ? '#ff1744' : value >= 51 ? '#ff5252' : value >= 26 ? '#ff8a80' : '#ffcdd2';
            case 'rivalry':
                return value >= 70 ? '#ff6f00' : value >= 40 ? '#ffa726' : '#ffcc80';
            case 'respect':
                return value >= 70 ? '#2196f3' : value >= 40 ? '#64b5f6' : '#bbdefb';
            case 'frustration':
                return value >= 70 ? '#9c27b0' : value >= 40 ? '#ba68c8' : '#e1bee7';
            default:
                return '#9e9e9e';
        }
    }

    static getStageEmoji(stage: RelationshipStage): string {
        switch (stage) {
            case 'denial': return '🚫';
            case 'confusion': return '😵';
            case 'resistance': return '⚔️';
            case 'acceptance': return '💔';
            default: return '❓';
        }
    }

    static initializeState(config: RivalmanceConfig): RivalmanceMessageState {
        const fullConfig = { ...DEFAULT_CONFIG, ...config };
        const state: RivalmanceMessageState = {
            affection: fullConfig.startingAffection,
            rivalry: fullConfig.startingRivalry,
            respect: fullConfig.startingRespect,
            frustration: 0,
            chaosLevel: 0,
            acceptedFeelings: false,
            relationshipStage: 'denial',
            lastInteractionType: 'neutral',
            lastChanges: {
                affection: 0,
                rivalry: 0,
                respect: 0,
                frustration: 0
            },
            significantMoments: []
        };
        this.recalculateMetrics(state, fullConfig);
        return state;
    }

    /***
     * Validates and filters significant moments to ensure integrity
     * Removes any moments that occur after the given interaction number
     * This helps maintain consistency when users swipe back or jump to earlier messages
     */
    static filterMomentsByInteraction(moments: string[], maxInteraction: number): string[] {
        if (!Array.isArray(moments)) return [];

        return moments.filter(moment => {
            // Extract interaction number from format: "[#123] Description"
            const match = moment.match(/^\[#(\d+)\]/);
            if (match) {
                const interactionNum = parseInt(match[1]);
                // Only keep moments from interactions at or before the current point
                return interactionNum <= maxInteraction;
            }
            // Keep moments without interaction numbers (backward compatibility)
            return true;
        });
    }
}
