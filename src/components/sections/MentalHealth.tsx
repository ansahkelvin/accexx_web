import TopicCard from "@/components/card/TopicCard";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Check} from "lucide-react";

export default function MentalHealthSection() {
    const topics = [
        {
            title: "Personality Disorders",
            description: "Personality disorders are a group of mental illnesses.",
            image: "https://images.unsplash.com/photo-1623650430273-dbd48d9986c0?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Depression",
            description: "Depression is a common and serious medical illness that negatively.",
            image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Anxiety",
            description: "Anxiety is a feeling of fear, dread & uneasiness.",
            image: "https://images.unsplash.com/photo-1624133172024-87559cb5eeb2?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Mood Swings",
            description: "Personality disorders are a group of mental illnesses.",
            image: "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    const activities = [
        "Complete Daily Task",
        "Care of Time Management",
        "Healthy Food",
        "Proper Sound Sleep",
        "Daily Morning Walk",
        "Drinking Water",
        "Family Time",
        "Gym Workout"
    ];

    return (
        <div className="w-full max-w-[2560px] mx-auto">
            {/* Topics Section */}
            <div className="bg-gradient-to-br from-[#9871FF] to-[#7B4AFF] px-4 md:px-10 lg:px-24 py-16">
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12">
                    Find providers who can<br />help with these topics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {topics.map((topic, index) => (
                        <TopicCard key={index} {...topic} />
                    ))}
                </div>
            </div>

            {/* Natural Life Section */}
            <div className="px-4 md:px-10 lg:px-24 py-16">
                <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                        Create natural life after treated<br />from mental health medicare
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Medicare patient care is paramount - the driving force in everything we do.
                        LifeStance is committed to state-of-the-art clinical excellence.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 mt-16">
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2">
                        <h3 className="text-2xl font-semibold mb-6">Primary Instruction</h3>
                        <p className="text-gray-600 mb-8">
                            The primary care mental health workers provide one-to-one support to
                            people within GP practices, helping with discharge from secondary care,
                            liaising between services and providing ongoing mental health support.
                        </p>
                        <p className="text-gray-600 mb-8">
                            Listen with curiosity and empathize with them. It may be helpful to tell
                            your child about other people who experience similar problems. If you or
                            someone else your child trusts have mental health conditions, explain that
                            the same way you would tell them about diabetes.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {activities.map((activity, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-700">{activity}</span>
                                </div>
                            ))}
                        </div>
                        <Button className="bg-[#9871ff] hover:bg-gray-800">
                            Book Now
                        </Button>
                    </div>

                    {/* Right Image */}
                    <div className="w-full lg:w-1/2">
                        <div className="h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1524758870432-af57e54afa26?q=80&w=2558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Natural Life"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}