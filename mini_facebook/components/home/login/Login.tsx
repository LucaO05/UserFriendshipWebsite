export function Login() {
    return (
        <>
            <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Username
                </label>
                <input
                    type="text"
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Firstname
                </label>
                <input
                    type="text"
                    placeholder="your first name"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Lastname
                </label>
                <input
                    type="text"
                    placeholder="your last name"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
            </div>
        </>
    )
}