import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/Layouts/AdminLayout'
import StudentLayout from './components/Layouts/StudentLayout'
import AdminDashboard from './components/Pages/Admin/AdminDashboard'
import AdminExams from './components/Pages/Admin/AdminExams'
import AdminResults from './components/Pages/Admin/AdminResults'
import AdminStudents from './components/Pages/Admin/AdminStudents'
import Home from './components/Pages/Home/Home'
import ExamAttempt from './components/Pages/Student/ExamAttempt'
import Results from './components/Pages/Student/Results'
import StudentExams from './components/Pages/Student/StudentExams'
import StudentProfile from './components/Pages/Student/StudentProfile'
import Login from './components/ui/Login/Login'
import Register from './components/ui/Register/Register'
import { decodeJwtPayload, isAuthenticated } from './lib/auth'

function RootRedirect() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={decodeJwtPayload()?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
}

function StudentRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (decodeJwtPayload()?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (decodeJwtPayload()?.role !== 'admin') {
    return <Navigate to="/student/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        <Route path="/student" element={<StudentRoute><StudentLayout /></StudentRoute>}>
          <Route path="dashboard" element={<Home />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="exams/:id" element={<ExamAttempt />} />
          <Route path="results" element={<Results />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="exams" element={<AdminExams />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="results" element={<AdminResults />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
