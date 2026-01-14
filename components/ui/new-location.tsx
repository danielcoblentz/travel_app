"use client"

export default function NewLocationClient ({ tripId }: {tripId: string}) {
    const [isPending, startTransition]
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white p-8 shadow-lg rounded-lg">
                    <h1 className="text-3xl font-bold text-center mb-6">Add New Location</h1>

                    <form className="space-y-6" action={(formData: FormData) => {startTransition addLocation(formData, tripId)}>
                        <div>
                            <label className="block text-small font-medium text-grey 700 mb-2"> Address</label>
                            <input name="address" type="text" required className="w-full boarder-grey-300 px-4 py-2 rounded-md focsu:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <Button type=submit>{isPending ? "adding" : "add location" </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}