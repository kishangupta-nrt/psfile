import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const CHECK_ABILITY_KEY = 'checkAbility';

export interface AbilityRequirement {
  action: string;
  resource: string;
}

/** Mark a route as public (JwtGuard skips verification). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** CASL-style requirement checked by RolesGuard against req.user.abilities. */
export const CheckAbility = (action: string, resource: string) =>
  SetMetadata(CHECK_ABILITY_KEY, { action, resource } as AbilityRequirement);
