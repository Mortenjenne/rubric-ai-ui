import { Route, Routes } from 'react-router-dom'
import { UploadPage } from './features/upload/UploadPage'
import { ResultPage } from './features/result/ResultPage'
import { HistoryPage } from './features/history/HistoryPage'
import { Nav } from './shared/ui/Nav'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/evaluations/:evaluationId" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
