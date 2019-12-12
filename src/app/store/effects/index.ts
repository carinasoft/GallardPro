import { RouterEffects } from './router.effect';
import { IndentEffects } from './indent/indent.effect';

export const effects: any[] = [
    RouterEffects,
    IndentEffects
];

export * from './router.effect';
export * from './indent/indent.effect';

