import Image from "next/image";


interface TopicCard {
    title: string;
    description: string;
    image: string;
}

const TopicCard = ({ title, description, image }: TopicCard) => (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-6">
        <div className="w-24 h-24 relative flex-shrink-0">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover rounded-xl"
            />
        </div>
        <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-3">{description}</p>
            <button className="text-sm text-gray-700 hover:text-gray-900">
                Learn More
            </button>
        </div>
    </div>
);

export default TopicCard;