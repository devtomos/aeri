import {
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandInteractionDataBasicOption,
    type APIApplicationCommandInteractionDataOption,
    type APIApplicationCommandInteractionDataSubcommandOption,
    type APIChatInputApplicationCommandInteraction,
    type APIInteraction,
    type APIMessageApplicationCommandInteraction,
    type APIMessageComponentButtonInteraction,
    type APIMessageComponentSelectMenuInteraction,
    type APIModalSubmitInteraction,
    type APIUserApplicationCommandInteraction,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ComponentType,
    InteractionType,
    type Snowflake,
} from "@discordjs/core";

export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Subcommand,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): APIApplicationCommandInteractionDataBasicOption[] | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.SubcommandGroup,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): APIApplicationCommandInteractionDataSubcommandOption[] | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Number,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): number | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Mentionable,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Integer,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): number | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Attachment,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Role,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.User,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Channel,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): Snowflake | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.Boolean,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): boolean | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType.String,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): string | null;
export function getCommandOption(
    name: string,
    type: ApplicationCommandOptionType,
    options?: APIApplicationCommandInteractionDataOption[] | undefined,
): any | null {
    if (!options) return null;

    const option = options.find((option) => option.name === name);

    if (option?.type !== type) return null;

    if (
        option.type === ApplicationCommandOptionType.Subcommand ||
        option.type === ApplicationCommandOptionType.SubcommandGroup
    )
        return option.options;
    return option.value;
}

export function isAutocompleteInteraction(
    interaction: APIInteraction,
): interaction is APIApplicationCommandAutocompleteInteraction {
    return interaction.type === InteractionType.ApplicationCommandAutocomplete;
}

export function isChatInputInteraction(
    interaction: APIInteraction,
): interaction is APIChatInputApplicationCommandInteraction {
    return (
        interaction.type === InteractionType.ApplicationCommand &&
        interaction.data.type === ApplicationCommandType.ChatInput
    );
}

export function isModalInteraction(interaction: APIInteraction): interaction is APIModalSubmitInteraction {
    return interaction.type === InteractionType.ModalSubmit;
}

export function isUserContextInteraction(
    interaction: APIInteraction,
): interaction is APIUserApplicationCommandInteraction {
    return (
        interaction.type === InteractionType.ApplicationCommand && interaction.data.type === ApplicationCommandType.User
    );
}

export function isMessageContextInteraction(
    interaction: APIInteraction,
): interaction is APIMessageApplicationCommandInteraction {
    return (
        interaction.type === InteractionType.ApplicationCommand &&
        interaction.data.type === ApplicationCommandType.Message
    );
}

export function isButtonInteraction(interaction: APIInteraction): interaction is APIMessageComponentButtonInteraction {
    return (
        interaction.type === InteractionType.MessageComponent &&
        interaction.data.component_type === ComponentType.Button
    );
}

export function isSelectMenuInteraction(
    interaction: APIInteraction,
): interaction is APIMessageComponentSelectMenuInteraction {
    return (
        interaction.type === InteractionType.MessageComponent &&
        (interaction.data.component_type === ComponentType.StringSelect ||
            interaction.data.component_type === ComponentType.UserSelect ||
            interaction.data.component_type === ComponentType.RoleSelect ||
            interaction.data.component_type === ComponentType.ChannelSelect ||
            interaction.data.component_type === ComponentType.MentionableSelect)
    );
}

export enum InteractType {
    Autocomplete = 0,
    ChatInput = 1,
    UserContext = 2,
    MessageContext = 3,
    Button = 4,
    SelectMenu = 5,
    Unknown = 6,
}

export function determineInteractionType(interaction: APIInteraction): InteractType {
    if (isAutocompleteInteraction(interaction)) return InteractType.Autocomplete;
    if (isChatInputInteraction(interaction)) return InteractType.ChatInput;
    if (isUserContextInteraction(interaction)) return InteractType.UserContext;
    if (isMessageContextInteraction(interaction)) return InteractType.MessageContext;
    if (isButtonInteraction(interaction)) return InteractType.Button;
    if (isSelectMenuInteraction(interaction)) return InteractType.SelectMenu;

    return InteractType.Unknown;
}

export function intervalTime(seconds: number, granularity = 2): string {
    const intervals: [string, number][] = [
        ["weeks", 604800],
        ["days", 86400],
        ["hours", 3600],
        ["minutes", 60],
        ["seconds", 1],
    ];

    const result: string[] = [];
    let secondsLeft = seconds;

    for (const [name, count] of intervals) {
        const value = Math.floor(secondsLeft / count);
        if (value) {
            secondsLeft -= value * count;
            let formattedName = name;
            if (value === 1) {
                formattedName = name.slice(0, -1); // Remove 's' for singular
            }
            result.push(`${value} ${formattedName}`);
        }
    }

    return result.slice(0, granularity).join(", ");
}