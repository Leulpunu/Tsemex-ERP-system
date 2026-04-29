
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat" 
style={{ backgroundImage: "linear-gradient(135deg, #ebecf4 0%, #dfdae4 100%)" }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-white/30">
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Tsemex ERP" 
            className="mx-auto h-20 w-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
            TSEMEX ERP
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

