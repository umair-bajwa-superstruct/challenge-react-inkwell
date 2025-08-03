export type IterationStatus = 'ready' | 'loading'

export interface Iteration {
  id: number
  title: string
  status: IterationStatus
}
