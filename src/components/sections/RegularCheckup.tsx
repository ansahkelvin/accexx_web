import Image from "next/image";

export default function RegularCheckup() {
    return (
        <section className="p-16">
            <div className="flex flex-col">
                <Image className="w-[500px] rounded-2xl h-[400px] object-cover" src={"https://images.unsplash.com/photo-1643663439099-6e153739c471?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={"Regular Check up"} width={300} height={300} />
                <p className="text-md text-gray-600 pt-3 max-w-sm">We only have the best doctors in the service to provide the best services to our clients</p>
            </div>
            <div>

            </div>
        </section>
    )
}