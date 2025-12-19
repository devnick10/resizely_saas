import { CheckCircle } from "lucide-react";
import { PricingCardButton } from "./PricingCardButton";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  popular?: boolean;
  pro?: boolean;
  free?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = (props) => {
  return (
    <div
      className={`bg-white dark:bg-muted p-8 rounded-lg border ${
        props.popular
          ? "border-primary shadow-lg relative"
          : "border-gray-200 dark:border-gray-700 shadow-sm"
      } flex flex-col h-full transition-colors`}
    >
      {props.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{props.title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">{props.price}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">{props.description}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {props.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2" />
            <span className="text-gray-700 dark:text-gray-200">{feature}</span>
          </li>
        ))}
      </ul>
      <PricingCardButton
        buttonText={props.buttonText}
        buttonVariant={props.buttonVariant}
      />
    </div>
  );
};
