export type TokenType =
  | '+1'
  | '0'
  | '-1'
  | '-2'
  | '-3'
  | '-4'
  | '-5'
  | '-6'
  | '-7'
  | '-8'
  | 'success'
  | 'skull'
  | 'cultist'
  | 'tablet'
  | 'stone'
  | 'thing'
  | 'fail'
  | 'blessed'
  | 'cursed'
  | 'frost'
export interface Token {
  type: TokenType,
  image: TokenImage
}

interface TokenImage {
  front: string
  back: string
}

export interface BagConfig {
  difficulty: 'easy' | 'medium' | 'hard'
  tokens: Token[]
}