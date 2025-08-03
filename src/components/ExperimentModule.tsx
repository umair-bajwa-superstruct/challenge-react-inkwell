import { useState } from 'react'
import { Lock, Unlock, Plus, Circle } from 'lucide-react'
import type { Iteration } from '../types/experimentTypes'

export interface ExperimentModuleProps {}

export function ExperimentModule({}: ExperimentModuleProps) {
  const [locked, setLocked] = useState<boolean>(false)
  const [iterations, setIterations] = useState<Iteration[]>([
    { id: 1, title: 'Iteration title', status: 'ready' },
    { id: 2, title: 'Iteration title', status: 'ready' },
    { id: 3, title: 'Iteration title', status: 'ready' }
  ])
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [newIterationTitle, setNewIterationTitle] = useState<string>('')
  const [showGenerateUI, setShowGenerateUI] = useState<boolean>(false)
  const [lengthOption, setLengthOption] = useState<'short' | 'medium' | 'long' | null>('short')
  const [inputActive, setInputActive] = useState<boolean>(false)

  const addIteration = (): void => {
    const nextId = iterations.length + 1
    const title = newIterationTitle.trim() || 'Untitled iteration'
    const newIteration: Iteration = { id: nextId, title, status: 'loading' }
    setIterations([...iterations, newIteration])
    setNewIterationTitle('')
    setIsAdding(false)
    setShowGenerateUI(false)
    setInputActive(false)
    setLengthOption('short')

    setTimeout(() => {
      setIterations((prev) =>
        prev.map((iter) => (iter.id === nextId ? { ...iter, status: 'ready' } : iter))
      )
    }, 2000)
  }

  const isEmpty: boolean = iterations.length === 0

  return (
    <div className='bg-zinc-900 rounded-2xl w-full max-w-md'>
      <div className='flex justify-between items-center p-6 cursor-pointer select-none'>
        <h2
          className={`text-xl ${locked ? 'text-gray-400' : ''}  font-semibold`}
          onClick={() => setExpanded(!expanded)}
        >
          Experiment Module
        </h2>
        {locked ? (
          <Lock className='w-5 h-5 text-gray-400' onClick={() => setLocked(!locked)} />
        ) : (
          <Unlock className='w-5 h-5 text-gray-400' onClick={() => setLocked(!locked)} />
        )}
      </div>

      {expanded && (
        <div className='flex flex-col space-y-6 p-6 pt-0'>
          {/* Iterations List */}
          <div
            className={`rounded-xl divide-y ${
              locked ? 'divide-zinc-700 bg-zinc-900' : 'divide-zinc-800 bg-zinc-900'
            } flex flex-col overflow-hidden`}
          >
            {isEmpty && !locked && !isAdding && (
              <div className='flex items-center justify-center text-gray-500 italic py-12 text-sm'>
                No iterations yet. Add one to get started.
              </div>
            )}

            {locked && (
              <div className='flex items-center justify-center text-gray-500 italic py-12 text-sm'>
                Module is locked. Unlock to add or edit iterations.
              </div>
            )}

            {!locked &&
              !isEmpty &&
              iterations.map((iter) => (
                <div key={iter.id} className='flex justify-between items-center px-5 py-4 bg-black'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <span className='text-xs text-gray-400 font-mono min-w-[3rem]'>
                      EM-{iter.id}
                    </span>
                    <span
                      className={`text-sm truncate ${
                        locked ? 'text-gray-500' : 'text-white font-semibold'
                      }`}
                      title={iter.title}
                    >
                      {iter.title}
                    </span>
                  </div>
                  {iter.status === 'ready' && (
                    <div className='flex items-center gap-2 text-xs text-green-400 font-medium select-none'>
                      <span>Selection</span>
                      <Circle className='w-3 h-3 text-green-500 fill-green-500' />
                    </div>
                  )}
                  {iter.status === 'loading' && (
                    <div className='text-xs text-gray-400 italic select-none'>Loading...</div>
                  )}
                </div>
              ))}
          </div>
          {isAdding && !showGenerateUI && (
            <div>
              {!inputActive ? (
                <div
                  className='bg-black rounded-xl p-4 text-lg text-gray-400 outline-none border border-zinc-700 hover:border-zinc-400 transition w-full cursor-pointer flex items-center justify-center min-h-[60px]'
                  style={{ fontFamily: 'inherit', fontWeight: 400, letterSpacing: 0.2 }}
                  onClick={(e) => {
                    // Only activate input if not clicking the generate span
                    if ((e.target as HTMLElement).id !== 'generate-link') {
                      setInputActive(true)
                    }
                  }}
                >
                  <span>
                    To add a new iteration, start typing a prompt or{' '}
                    <span
                      id='generate-link'
                      className='underline cursor-pointer text-gray-300 hover:text-green-400 transition'
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowGenerateUI(true)
                      }}
                    >
                      generate one
                    </span>
                    .
                  </span>
                </div>
              ) : (
                <div className='relative'>
                  <input
                    type='text'
                    className='bg-black rounded-xl p-4 text-sm text-gray-200 italic outline-none border border-zinc-700 focus:border-zinc-400 transition w-full pr-32'
                    placeholder='Enter iteration title'
                    value={newIterationTitle}
                    onChange={(e) => setNewIterationTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addIteration()
                      }
                    }}
                    autoFocus
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 flex gap-2'>
                    <button
                      className='text-gray-400 tracking-wider hover:text-gray-300 transition text-xs font-semibold px-2 py-1 rounded'
                      onClick={() => {
                        setInputActive(false)
                        setNewIterationTitle('')
                        setIsAdding(false)
                      }}
                      type='button'
                    >
                      CANCEL
                    </button>
                    <button
                      className='text-white tracking-wider font-semibold hover:underline transition text-xs px-2 py-1 rounded'
                      onClick={addIteration}
                      type='button'
                    >
                      DONE
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {isAdding && showGenerateUI && (
            <div className='bg-black rounded-xl p-6 flex flex-col gap-6 border border-zinc-700 w-full max-w-lg mx-auto'>
              <div className='flex items-center gap-4'>
                <span className='text-xs text-gray-400 font-mono min-w-[3rem]'>
                  EM-{iterations.length + 1}
                </span>
                <span className='text-2xl text-white font-light'>
                  {newIterationTitle || 'Iteration title'}
                </span>
              </div>
              <div className='flex gap-4'>
                <button
                  className={`flex-1 rounded-xl px-6 py-3 border-2 text-lg font-bold tracking-wide ${
                    lengthOption === 'short'
                      ? 'border-green-500 text-green-400 bg-zinc-900'
                      : 'border-zinc-700 text-gray-400 bg-black'
                  } transition`}
                  onClick={() => setLengthOption('short')}
                  type='button'
                >
                  SHORT
                </button>
                <button
                  className={`flex-1 rounded-xl px-6 py-3 border-2 text-lg font-bold tracking-wide ${
                    lengthOption === 'medium'
                      ? 'border-green-500 text-green-400 bg-zinc-900'
                      : 'border-zinc-700 text-gray-400 bg-black'
                  } transition`}
                  onClick={() => setLengthOption('medium')}
                  type='button'
                >
                  MEDIUM LENGTH
                </button>
              </div>
              <button
                className={`w-full rounded-xl px-6 py-3 border-2 text-lg font-bold tracking-wide ${
                  lengthOption === 'long'
                    ? 'border-green-500 text-green-400 bg-zinc-900'
                    : 'border-zinc-700 text-gray-500 bg-black'
                } transition`}
                onClick={() => setLengthOption('long')}
                type='button'
              >
                VERY VERY VERY LONG (UP TO 35 CHAR)
              </button>
              <div className='flex justify-between items-center pt-2'>
                <button
                  className='text-gray-400 tracking-wider font-semibold hover:text-gray-300 transition'
                  onClick={() => {
                    setIsAdding(false)
                    setShowGenerateUI(false)
                    setNewIterationTitle('')
                    setInputActive(false)
                    setLengthOption('short')
                  }}
                  type='button'
                >
                  REMOVE
                </button>
                <button
                  className='text-white tracking-wider font-semibold hover:underline transition'
                  onClick={addIteration}
                  type='button'
                >
                  DONE
                </button>
              </div>
            </div>
          )}
          <div className='flex justify-between items-center text-sm pt-2'>
            {isAdding ? null : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setLocked(!locked)
                  }}
                  className={`tracking-wider font-semibold ${
                    locked
                      ? 'text-green-400 hover:text-green-500'
                      : 'text-gray-400 hover:text-gray-300'
                  } transition`}
                >
                  LOCK
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!locked && !isEmpty) setIterations([])
                  }}
                  disabled={locked || isEmpty}
                  className={`tracking-wider font-semibold ${
                    locked || isEmpty
                      ? 'text-gray-700 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-300 cursor-pointer'
                  } transition`}
                >
                  RESET
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsAdding(true)
                  }}
                  disabled={locked}
                  className={`tracking-wider font-semibold flex items-center gap-2 ${
                    locked
                      ? 'text-gray-700 cursor-not-allowed'
                      : 'text-white hover:text-gray-100 cursor-pointer'
                  } transition`}
                >
                  <Plus className='w-4 h-4' /> ADD ITERATION
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
