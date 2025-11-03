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
            { pattern: /\b(kiss|kissed|kissing)\b/g, value: 5 }
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

        // First kiss
        if (/\b(kiss|kissed|kissing)\b/.test(lowerContent) &&
            /\b(first|finally|at last)\b/.test(lowerContent)) {
            return "First kiss";
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
}
