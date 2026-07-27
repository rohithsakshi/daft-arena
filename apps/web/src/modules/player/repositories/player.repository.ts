// @ts-nocheck
import { BaseRepository } from '../../../lib/db/BaseRepository';
import { PlayerModel, IPlayer } from '../models/Player.schema';
export class PlayerRepository extends BaseRepository<IPlayer> { constructor() { super(PlayerModel); } }
