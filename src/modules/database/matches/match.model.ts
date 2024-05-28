import { Choice } from '@/types/Choice'
import { WithId } from '@modules/database/types/withId'

export interface HistoryMatchPlayer {
  uid: string
  name: string
  score: number
  gain: number
}

export enum SidesEnum {
  White = 0,
  Black = 1,
}

export enum GameMode {
  Casual = 0b00,
  Ranked = 0b10,
  PvP = 0b00,
  PvC = 0b01,
}

export enum HistoryMatchEventsEnum {
  Choice,
  Forfeit,
  Timeout,
  Message,
}

type BaseMatchEvent = {
  event: HistoryMatchEventsEnum
  side: SidesEnum
  time: number
}

export type HistoryMatchEvent = BaseMatchEvent &
  (
    | {
        event: HistoryMatchEventsEnum.Choice
        choice: Choice
      }
    | {
        event: HistoryMatchEventsEnum.Message
        message: string
      }
    | {
        event: HistoryMatchEventsEnum.Timeout | HistoryMatchEventsEnum.Forfeit
      }
  )

/** Represents a match registry in the History. */
export interface MatchModel extends WithId {
  white: HistoryMatchPlayer
  black: HistoryMatchPlayer
  events: HistoryMatchEvent[]
  winner: SidesEnum | null
  gameMode: GameMode
  timestamp: Date
}
