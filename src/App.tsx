import { ExperimentModule } from './components/ExperimentModule'

export default function App() {
  return (
    <div className='min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 space-y-5'>
      <ExperimentModule />
      <ExperimentModule />
      <ExperimentModule />
    </div>
  )
}
