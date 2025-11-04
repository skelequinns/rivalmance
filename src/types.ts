/***
 * Rivalmance Type Definitions
 * "I don't know whether I want to kiss you or kill you."
 */

export interface RivalmanceConfig {
    startingAffection?: number;
    startingRivalry?: number;
    startingRespect?: number;
    chaosThreshold?: number;
    frustrationMultiplier?: number;
}

export interface RivalmanceMessageState {
    affection: number;          // 0-100: How much char is attracted to user
    rivalry: number;            // 0-100: Intensity of competitive tension
    respect: number;            // 0-100: How much char respects user as equal
    frustration: number;        // 0-100: Char's frustration with their feelings
    chaosLevel: number;         // 0-10: How erratic/chaotic char's behavior is
    acceptedFeelings: boolean;  // Has char accepted their feelings?
    relationshipStage: RelationshipStage;
    lastInteractionType: InteractionType;
    lastChanges: {              // Track most recent changes for UI display
        affection: number;
        rivalry: number;
        respect: number;
        frustration: number;
    };
    significantMoments: string[]; // Accumulated moments up to this message
}

export interface RivalmanceChatState {
    totalInteractions: number;
}

export type RelationshipStage = 'denial' | 'confusion' | 'resistance' | 'acceptance';
export type InteractionType = 'competitive' | 'romantic' | 'confrontational' | 'neutral';

export interface RivalmanceUpdate {
    affection_change?: number;
    rivalry_change?: number;
    respect_change?: number;
    interaction_type?: InteractionType;
    significant_moment?: string;
}

export const DEFAULT_CONFIG: Required<RivalmanceConfig> = {
    startingAffection: 5,
    startingRivalry: 80,
    startingRespect: 20,
    chaosThreshold: 50,
    frustrationMultiplier: 1.5
};
