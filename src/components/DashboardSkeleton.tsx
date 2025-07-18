export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg h-96">
          <div className="p-4 border-b">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg px-4 py-2 w-3/4">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gray-200 rounded-lg px-4 py-2 w-2/3">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}