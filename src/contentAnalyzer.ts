/***
 * Content Analysis for Rivalmance Updates
 * Fallback system when LLM doesn't include tags
 */

import { RivalmanceUpdate, InteractionType } from './types';

export class RivalmanceContentAnalyzer {

    /***
     * Analyze message content for rivalmance indicators when tags are missing
     */
    static analyzeContent(content: string): RivalmanceUpdate {
        const update: RivalmanceUpdate = {};
        const lowerContent = content.toLowerCase();

        // Detect interaction type
        update.interaction_type = this.detectInteractionType(lowerContent);

        // Detect affection changes
        const affectionChange = this.detectAffectionChange(lowerContent, content);
        if (affectionChange !== 0) {
            update.affection_change = affectionChange;
        }

        // Detect rivalry changes
        const rivalryChange = this.detectRivalryChange(lowerContent);
        if (rivalryChange !== 0) {
            update.rivalry_change = rivalryChange;
        }

        // Detect respect changes
        const respectChange = this.detectRespectChange(lowerContent, content);
        if (respectChange !== 0) {
            update.respect_change = respectChange;
        }

        // Detect significant moments
        const moment = this.detectSignificantMoment(lowerContent, content);
        if (moment) {
            update.significant_moment = moment;
        }

        return update;
    }

    private static detectInteractionType(content: string): InteractionType {
        // Competitive indicators
        const competitive = [
            'compete', 'competition', 'challenge', 'bet', 'race', 'fight', 'battle',
            'win', 'won', 'lose', 'lost', 'beat', 'defeat', 'victory', 'rematch',
            'score', 'points', 'game', 'contest', 'rival', 'opponent'
        ];

        // Romantic indicators
        const romantic = [
            'love', 'feel', 'heart', 'blush', 'kiss', 'touch', 'hold', 'embrace',
            'close', 'warm', 'soft', 'gentle', 'tender', 'cute', 'attractive',
            'beautiful', 'handsome', 'care', 'worried', 'miss'
        ];

        // Confrontational indicators
        const confrontational = [
            'angry', 'furious', 'frustrated', 'annoyed', 'irritated', 'mad',
            'hate', 'despise', 'argue', 'argument', 'yell', 'shout', 'scream',
            'glare', 'snap', 'growl', 'snarl', 'confront', 'accuse'
        ];

        const competitiveScore = this.countMatches(content, competitive);
        const romanticScore = this.countMatches(content, romantic);
        const confrontationalScore = this.countMatches(content, confrontational);

        // Return highest scoring type
        const max = Math.max(competitiveScore, romanticScore, confrontationalScore);
        if (max === 0) return 'neutral';
        if (competitiveScore === max) return 'competitive';
        if (confrontationalScore === max) return 'confrontational';
        return 'romantic';
    }

    private static detectAffectionChange(lowerContent: string, originalContent: string): number {
        let change = 0;

        // Positive affection indicators
        const positiveIndicators = [
            { pattern: /\b(blush|blushing|blushed)\b/g, value: 3 },
            { pattern: /\b(can't stop thinking|keep thinking)\b/g, value: 4 },
            { pattern: /\b(feelings? for|attracted to|drawn to)\b/g, value: 5 },
            { pattern: /\b(love|in love)\b/g, value: 6 },
            { pattern: /\b(heart (skips|races|pounds))\b/g, value: 3 },
            { pattern: /\b(cute|adorable)\b/g, value: 2 },
            { pattern: /\b(close|closer|proximity)\b/g, value: 2 },
            { pattern: /\b(compliment|praise)\b/i, value: 2 }
        ];

        // Reluctant affection (still counts but with frustration)
        const reluctantIndicators = [
            { pattern: /\bi (hate|can't stand) (that|how|when) (you|i)\b/g, value: 3 },
            { pattern: /\b(damn it|dammit|why do i)\b/g, value: 2 },
            { pattern: /\b(not that i care|don't get the wrong idea)\b/g, value: 2 }
        ];

        // Physical proximity/contact
        const physicalIndicators = [
            { pattern: /\b(grab|grasp|hold|touch|stroke|caress)\b/g, value: 3 },
            { pattern: /\b(lean (in|close)|move closer)\b/g, value: 2 },
            // High value for contextual kiss (action-based)
            { pattern: /(\*[^*]*kiss[^*]*\*|lips\s+(met|touched|pressed|brushed)|lean(ed)?\s+in\s+(and\s+)?kiss)/g, value: 5 },
            // Lower value for just mentioning kiss without action context
            { pattern: /\b(kiss|kissed|kissing)\b/g, value: 1 }
        ];

        // Count all matches
        for (const indicator of [...positiveIndicators, ...reluctantIndicators, ...physicalIndicators]) {
            const matches = lowerContent.match(indicator.pattern);
            if (matches) {
                change += matches.length * indicator.value;
            }
        }

        // Negative affection indicators
        const negativeIndicators = [
            { pattern: /\b(disgust|disgusting|repulsive)\b/g, value: -3 },
            { pattern: /\b(hate you|despise you)\b/g, value: -2 }
        ];

        for (const indicator of negativeIndicators) {
            const matches = lowerContent.match(indicator.pattern);
            if (matches) {
                change += matches.length * indicator.value;
            }
        }

        // Cap the change per interaction
        return Math.max(-5, Math.min(5, change));
    }

    private static detectRivalryChange(content: string): number {
        let change = 0;

        // Competition increases rivalry
        const rivalryIndicators = [
            { pattern: /\b(challenge|rematch|next time)\b/g, value: 2 },
            { pattern: /\b(won't lose|will win|i'll beat you)\b/g, value: 3 },
            { pattern: /\b(rivalry|rival|opponent|enemy)\b/g, value: 2 },
            { pattern: /\b(bring it on|come at me)\b/g, value: 2 },
            { pattern: /\b(compete|competition|contest)\b/g, value: 2 }
        ];

        for (const indicator of rivalryIndicators) {
            const matches = content.match(indicator.pattern);
            if (matches) {
                change += matches.length * indicator.value;
            }
        }

        // Cap the change
        return Math.min(5, change);
    }

    private static detectRespectChange(lowerContent: string, originalContent: string): number {
        let change = 0;

        // Respect gain indicators
        const respectIndicators = [
            { pattern: /\b(impressive|skilled|talented|capable)\b/g, value: 3 },
            { pattern: /\b(worthy opponent|equal)\b/g, value: 4 },
            { pattern: /\b(admit|acknowledge|recognize).*(skill|talent|ability)\b/g, value: 3 },
            { pattern: /\b(respect|admire)\b/g, value: 3 },
            { pattern: /\b(not bad|well done|good job)\b/g, value: 2 }
        ];

        for (const indicator of respectIndicators) {
            const matches = lowerContent.match(indicator.pattern);
            if (matches) {
                change += matches.length * indicator.value;
            }
        }

        // Respect loss indicators
        const disrespectIndicators = [
            { pattern: /\b(pathetic|weak|incompetent)\b/g, value: -3 },
            { pattern: /\b(disappoint|disappointing|letdown)\b/g, value: -2 },
            { pattern: /\b(waste of time|not worth it)\b/g, value: -2 }
        ];

        for (const indicator of disrespectIndicators) {
            const matches = lowerContent.match(indicator.pattern);
            if (matches) {
                change += matches.length * indicator.value;
            }
        }

        // Cap the change
        return Math.max(-5, Math.min(5, change));
    }

    private static detectSignificantMoment(lowerContent: string, originalContent: string): string | null {
        // First confession/admission of feelings
        if (/\b(i love|i'm in love|i have feelings for)\b/.test(lowerContent)) {
            return "Confession of feelings";
        }

        // First kiss - improved detection with context
        if (this.isActualKiss(lowerContent)) {
            const hasTemporalContext =
                /\b(first|finally|at last)\b/.test(lowerContent);

            if (hasTemporalContext) {
                return "First kiss";
            }
        }

        // Reluctant admission
        if (/\b(i hate that i|why do i|damn it.*i)\b/.test(lowerContent) &&
            /\b(feel|care|think about|worry)\b/.test(lowerContent)) {
            return "Reluctant admission of caring";
        }

        // Major confrontation
        if (/\b(had enough|that's it|i'm done)\b/.test(lowerContent) &&
            /\b(you|this|us)\b/.test(lowerContent)) {
            return "Major confrontation";
        }

        return null;
    }

    private static countMatches(content: string, patterns: string[]): number {
        let count = 0;
        for (const pattern of patterns) {
            if (content.includes(pattern)) {
                count++;
            }
        }
        return count;
    }

    /***
     * Determine if content describes an actual kiss (not just mentioning the word)
     * Uses scoring system to differentiate between actual kisses and false positives
     */
    private static isActualKiss(lowerContent: string): boolean {
        let score = 0;

        // Must contain kiss word
        if (!/\b(kiss|kissed|kissing)\b/.test(lowerContent)) return false;

        // Positive indicators (+points)
        if (/\*[^*]*(kiss|lips)[^*]*\*/.test(lowerContent)) score += 3; // Action text in asterisks
        if (/\b(lips?|mouth)\s+(met|touched|pressed|brushed|captured)\b/.test(lowerContent)) score += 3;
        if (/\b(lean(ed|s|ing)?\s+(in|close)|pull(ed|s|ing)?\s+(close|in)|move(d|s)?\s+closer)\b/.test(lowerContent)) score += 2;
        if (/\b(gentle|passionate|soft|warm|sweet|tender|quick|sudden)\s+(kiss|lips)\b/.test(lowerContent)) score += 2;
        if (/\b(taste|breath|heartbeat|chest)\b/.test(lowerContent)) score += 1;
        if (/\b(close|closer|inches away)\b/.test(lowerContent)) score += 1;

        // Negative indicators (-points)
        if (/\b(don't|won't|can't|shouldn't|never|not|no)\s+\w*\s*kiss\b/.test(lowerContent)) score -= 5;
        if (/\b(about|mention|talk|say|word|idea of|thought of)\s+\w*\s*kiss/.test(lowerContent)) score -= 3;
        if (/\b(refuse|avoid|resist|pull away|reject|deny)\b/.test(lowerContent)) score -= 3;
        if (/"[^"]*kiss[^"]*"/.test(lowerContent)) score -= 2; // Just dialogue

        return score >= 3;
    }
}
