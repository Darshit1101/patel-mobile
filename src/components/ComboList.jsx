import { Edit2, Trash2, Smartphone, Calendar, Settings, List, Plus } from 'lucide-react';

const ComboList = ({ combos, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your mobile combos...</p>
                    <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</p>
                </div>
            </div>
        );
    }

    if (!combos || combos.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Mobile Combos Yet</h3>
                    <p className="text-gray-500 mb-4">Start building your mobile device collection by creating your first combo above.</p>
                    <p className="text-gray-400 text-sm">Organize your devices into meaningful groups for better management</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    Your Mobile Combos
                    <span className="ml-auto text-sm font-normal bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {combos.length} {combos.length === 1 ? 'combo' : 'combos'}
                    </span>
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    Combo Name
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <List className="w-4 h-4" />
                                    Mobile Devices
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Created Date
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Actions
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {combos.map((combo) => (
                            <tr key={combo._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {combo.comboName}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {combo.mobileNames && combo.mobileNames.length > 0 ? (
                                            <div className="space-y-1">
                                                {combo.mobileNames.map((mobileName, index) => (
                                                    <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs inline-block mr-1 mb-1">
                                                        {mobileName}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic bg-gray-50 px-3 py-1 rounded-lg text-xs">
                                                No devices added yet
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-lg inline-block">
                                        {new Date(combo.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(combo)}
                                            className="group inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            title="Edit this combo"
                                        >
                                            <Edit2 size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                                            <span className="font-medium text-sm">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => onDelete(combo._id)}
                                            className="group inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            title="Delete this combo"
                                        >
                                            <Trash2 size={16} className="group-hover:scale-110 transition-transform duration-200" />
                                            <span className="font-medium text-sm">Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComboList;