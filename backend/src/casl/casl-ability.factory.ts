import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { User, Role } from '../users/user.entity';

type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = MongoAbility<[string, Subjects]>;

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    return build({
      detectSubjectType: (item: any) => item.constructor as ExtractSubjectType<Subjects>
    });
  }
}
