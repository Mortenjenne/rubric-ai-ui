import { Route, Routes } from 'react-router-dom'
import { UploadPage } from './features/upload/UploadPage'
import { ResultPage } from './features/result/ResultPage'
import { HistoryPage } from './features/history/HistoryPage'
import { Sidebar } from './shared/ui/Sidebar'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/evaluations/:evaluationId" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
