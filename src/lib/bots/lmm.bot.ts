import { IClientAdapter } from '@modules/match/lib/adapters/client.adapter'
import { PerspectiveGameState } from '@modules/match/types/perspective.game.state'
import { Choice } from '@/types/Choice'
import { createTree } from '../LMM'
import { BaseBot } from '@/lib/bots/base.bot'
import { MatchHandler } from '@modules/match/lib/match.handler'

function getMatchChoices(state: PerspectiveGameState, side: 'white' | 'black') {
  const white = side === 'white' ? state.playerChoices : state.oponentChoices
  const black = side === 'black' ? state.playerChoices : state.oponentChoices

  const result: Choice[] = []
  for (let i = 0; i < black.length; i++) {
    result.push(white[i], black[i])
  }
  if (white.length > black.length) result.push(white[black.length])
  return result
}

export class LmmBot extends BaseBot {
  private state: PerspectiveGameState

  constructor(private depth: number = 2) {
    super()
  }

  observe(match: MatchHandler) {
    // dn
  }

  getClientAdapter(): IClientAdapter {
    const self = this
    return {
      // TODO: Test arrow functions
      sendMessage(message: string) {
        //dn
      },
      sendOpponentUid() {
        //dn
      },
      sendRatingsVariation() {
        //dn
      },
      sendState(state) {
        if (!self.matchHandlerAdapter)
          throw new Error('Match adapter not found')
        if (state.turn) {
          const side =
            state.oponentChoices.length > state.playerChoices.length
              ? 'black'
              : 'white'

          const matchChoices = getMatchChoices(state, side)
          const tree = createTree(
            Math.min(self.depth, 9 - matchChoices.length),
            matchChoices,
          )

          const values: {
            loses: Choice[]
            draws: Choice[]
            wins: Choice[]
          } = {
            loses: [],
            draws: [],
            wins: [],
          }

          const winNumber = side === 'white' ? 1 : -1

          for (const branchId of Object.keys(tree.branches)) {
            if (!tree.branches[branchId]) continue
            if (tree.branches[branchId].value === winNumber) {
              values.wins.push(parseInt(branchId) as Choice)
            } else if (tree.branches[branchId].value === 0) {
              values.draws.push(parseInt(branchId) as Choice)
            } else {
              values.loses.push(parseInt(branchId) as Choice)
            }
          }

          if (values.wins.length) {
            self.matchHandlerAdapter.makeChoice(
              values.wins[Math.floor(Math.random() * values.wins.length)],
            )
          } else if (values.draws.length) {
            self.matchHandlerAdapter.makeChoice(
              values.draws[Math.floor(Math.random() * values.draws.length)],
            )
          } else if (values.loses.length) {
            self.matchHandlerAdapter.makeChoice(
              values.loses[Math.floor(Math.random() * values.loses.length)],
            )
          }
        }
      },
    }
  }
}
