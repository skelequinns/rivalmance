import {ReactElement} from "react";
import {StageBase, StageResponse, InitialData, Message} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";
import {
    RivalmanceConfig,
    RivalmanceMessageState,
    RivalmanceChatState,
    DEFAULT_CONFIG
} from './types';
import { RivalmanceUtils } from './rivalmanceUtils';

/***
 * Using 'any' to work with existing chub_meta.yaml schema
 * Actual structure defined in types.ts
 */
type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

/***
 * Rivalmance Stage Implementation
 * "I don't know whether I want to kiss you or kill you."
 *
 * A romance that develops through rivalry and competition.
 */
export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {

    private currentState: RivalmanceMessageState;
    private currentChatState: RivalmanceChatState;
    private config: Required<RivalmanceConfig>;

    constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
        super(data);

        const { config, messageState, chatState } = data;

        // Parse config with defaults
        this.config = { ...DEFAULT_CONFIG, ...(config || {}) };

        // Initialize or restore message state
        if (messageState && this.isValidRivalmanceState(messageState)) {
            this.currentState = messageState as RivalmanceMessageState;
            // Ensure backward compatibility - add lastChanges if missing
            if (!this.currentState.lastChanges) {
                this.currentState.lastChanges = {
                    affection: 0,
                    rivalry: 0,
                    respect: 0,
                    frustration: 0
                };
            }
        } else {
            this.currentState = RivalmanceUtils.initializeState(this.config);
        }

        // Initialize or restore chat state
        if (chatState && chatState.significantMoments) {
            this.currentChatState = chatState as RivalmanceChatState;
        } else {
            this.currentChatState = {
                significantMoments: [],
                totalInteractions: 0
            };
        }
    }

    private isValidRivalmanceState(state: any): boolean {
        return state &&
               typeof state.affection === 'number' &&
               typeof state.rivalry === 'number' &&
               typeof state.respect === 'number';
    }

    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
        return {
            success: true,
            error: null,
            initState: { initialized: true },
            chatState: this.currentChatState,
        };
    }

    async setState(state: MessageStateType): Promise<void> {
        if (state != null && this.isValidRivalmanceState(state)) {
            // Fully restore the state, ensuring lastChanges exists for backward compatibility
            this.currentState = {
                ...this.currentState,
                ...state,
                lastChanges: state.lastChanges || {
                    affection: 0,
                    rivalry: 0,
                    respect: 0,
                    frustration: 0
                }
            };
        }
    }

    async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        // Generate stage directions based on current relationship state
        const stageDirections = RivalmanceUtils.generateStageDirections(this.currentState);

        // Increment interaction counter
        this.currentChatState.totalInteractions++;

        return {
            stageDirections: stageDirections,
            messageState: this.currentState,
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: this.currentChatState,
        };
    }

    async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const { content } = botMessage;

        // Store old values to calculate changes
        const oldAffection = this.currentState.affection;
        const oldRivalry = this.currentState.rivalry;
        const oldRespect = this.currentState.respect;
        const oldFrustration = this.currentState.frustration;

        // Parse rivalmance updates from the LLM response
        const updates = RivalmanceUtils.parseRivalmanceUpdates(content);

        // Apply updates to state
        RivalmanceUtils.applyUpdates(this.currentState, updates);

        // Recalculate derived metrics
        RivalmanceUtils.recalculateMetrics(this.currentState, this.config);

        // Calculate and store the changes for UI display
        this.currentState.lastChanges = {
            affection: this.currentState.affection - oldAffection,
            rivalry: this.currentState.rivalry - oldRivalry,
            respect: this.currentState.respect - oldRespect,
            frustration: this.currentState.frustration - oldFrustration
        };

        // Add significant moment to chat history if present
        if (updates.significant_moment) {
            this.currentChatState.significantMoments.push(
                `[#${this.currentChatState.totalInteractions}] ${updates.significant_moment}`
            );
        }

        // Strip the rivalmance tags from the message before displaying
        const cleanedMessage = RivalmanceUtils.stripRivalmanceTags(content);

        return {
            stageDirections: null,
            messageState: this.currentState,
            modifiedMessage: cleanedMessage !== content ? cleanedMessage : null,
            systemMessage: null,
            error: null,
            chatState: this.currentChatState
        };
    }

    render(): ReactElement {
        const {
            affection,
            rivalry,
            respect,
            frustration,
            chaosLevel,
            relationshipStage,
            lastInteractionType,
            acceptedFeelings,
            lastChanges
        } = this.currentState;

        const { significantMoments, totalInteractions } = this.currentChatState;

        // Helper to format change display
        const formatChange = (value: number): string => {
            if (value === 0) return '';
            return value > 0 ? `+${value}` : `${value}`;
        };

        // Check if any changes occurred
        const hasChanges = lastChanges && (
            lastChanges.affection !== 0 ||
            lastChanges.rivalry !== 0 ||
            lastChanges.respect !== 0 ||
            lastChanges.frustration !== 0
        );

        return (
            <div className="rivalmance-container">
                <div className="rivalmance-header">
                    <h2>⚔️ Rivalmance ❤️</h2>
                    <p className="tagline">"I don't know whether I want to kiss you or kill you."</p>
                </div>

                <div className="metrics-panel">
                    <div className="metric">
                        <div className="metric-label">
                            <span>Affection</span>
                            <span className="metric-value">{affection}/100</span>
                        </div>
                        <div className="metric-bar-container">
                            <div
                                className="metric-bar"
                                style={{
                                    width: `${affection}%`,
                                    backgroundColor: RivalmanceUtils.getMetricColor('affection', affection)
                                }}
                            />
                        </div>
                    </div>

                    <div className="metric">
                        <div className="metric-label">
                            <span>Rivalry</span>
                            <span className="metric-value">{rivalry}/100</span>
                        </div>
                        <div className="metric-bar-container">
                            <div
                                className="metric-bar"
                                style={{
                                    width: `${rivalry}%`,
                                    backgroundColor: RivalmanceUtils.getMetricColor('rivalry', rivalry)
                                }}
                            />
                        </div>
                    </div>

                    <div className="metric">
                        <div className="metric-label">
                            <span>Respect</span>
                            <span className="metric-value">{respect}/100</span>
                        </div>
                        <div className="metric-bar-container">
                            <div
                                className="metric-bar"
                                style={{
                                    width: `${respect}%`,
                                    backgroundColor: RivalmanceUtils.getMetricColor('respect', respect)
                                }}
                            />
                        </div>
                    </div>

                    <div className="metric">
                        <div className="metric-label">
                            <span>Frustration</span>
                            <span className="metric-value">{frustration}/100</span>
                        </div>
                        <div className="metric-bar-container">
                            <div
                                className="metric-bar"
                                style={{
                                    width: `${frustration}%`,
                                    backgroundColor: RivalmanceUtils.getMetricColor('frustration', frustration)
                                }}
                            />
                        </div>
                    </div>
                </div>

                {hasChanges && (
                    <div className="recent-changes-panel">
                        <div className="recent-changes-header">Recent Changes:</div>
                        <div className="recent-changes-list">
                            {lastChanges.affection !== 0 && (
                                <span className={`change-item ${lastChanges.affection > 0 ? 'positive' : 'negative'}`}>
                                    Affection {formatChange(lastChanges.affection)}
                                </span>
                            )}
                            {lastChanges.rivalry !== 0 && (
                                <span className={`change-item ${lastChanges.rivalry > 0 ? 'positive' : 'negative'}`}>
                                    Rivalry {formatChange(lastChanges.rivalry)}
                                </span>
                            )}
                            {lastChanges.respect !== 0 && (
                                <span className={`change-item ${lastChanges.respect > 0 ? 'positive' : 'negative'}`}>
                                    Respect {formatChange(lastChanges.respect)}
                                </span>
                            )}
                            {lastChanges.frustration !== 0 && (
                                <span className={`change-item ${lastChanges.frustration > 0 ? 'warning' : 'positive'}`}>
                                    Frustration {formatChange(lastChanges.frustration)}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="status-panel">
                    <div className="status-item">
                        <span className="status-label">Stage:</span>
                        <span className="status-value">
                            {RivalmanceUtils.getStageEmoji(relationshipStage)} {relationshipStage.toUpperCase()}
                            {acceptedFeelings && <span className="badge">Accepted</span>}
                        </span>
                    </div>

                    {chaosLevel > 0 && (
                        <div className="status-item">
                            <span className="status-label">Chaos:</span>
                            <span className={`status-value chaos-level-${chaosLevel >= 7 ? 'high' : chaosLevel >= 4 ? 'medium' : 'low'}`}>
                                {'⚡'.repeat(Math.min(chaosLevel, 10))} {chaosLevel}/10
                                {chaosLevel >= 7 && <span className="badge warning">HIGH</span>}
                            </span>
                        </div>
                    )}

                    <div className="status-item">
                        <span className="status-label">Last Interaction:</span>
                        <span className="status-value interaction-type">
                            {lastInteractionType}
                        </span>
                    </div>

                    <div className="status-item">
                        <span className="status-label">Total Interactions:</span>
                        <span className="status-value">{totalInteractions}</span>
                    </div>
                </div>

                {significantMoments.length > 0 && (
                    <details className="moments-panel">
                        <summary>
                            Significant Moments ({significantMoments.length})
                        </summary>
                        <ul className="moments-list">
                            {significantMoments.slice(-10).reverse().map((moment, i) => (
                                <li key={i}>{moment}</li>
                            ))}
                        </ul>
                    </details>
                )}

                <div className="info-panel">
                    <small>
                        <strong>How it works:</strong> The AI tracks your rivalmance through competitive tension.
                        Affection grows but never softens the rivalry. Higher affection = more frustration and chaos.
                    </small>
                </div>
            </div>
        );
    }
}
