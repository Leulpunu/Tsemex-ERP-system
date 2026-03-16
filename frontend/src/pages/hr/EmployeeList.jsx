import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus } from 'lucide-react'

const EmployeeList = () => {
  const employees = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', position: 'Project Manager', department: 'Construction' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', position: 'HR Manager', department: 'HR' },
    { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', position: 'Accountant', department: 'Finance' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <Link
          to="/employees/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="text-blue-600" size={16} />
                    </div>
                    <span className="ml-3 font-medium text-gray-800">{employee.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{employee.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{employee.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No employees found.</p>
        </div>
      )}
    </div>
  )
}

export default EmployeeList
