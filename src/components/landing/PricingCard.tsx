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
      className={`rounded-lg border bg-white p-8 dark:bg-muted ${
        props.popular
          ? "relative border-primary shadow-lg"
          : "border-gray-200 shadow-sm dark:border-gray-700"
      } flex h-full flex-col transition-colors`}
    >
      {props.popular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold">{props.title}</h3>
        <div className="mb-2 flex items-baseline">
          <span className="text-3xl font-bold">{props.price}</span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">{props.description}</p>
      </div>
      <ul className="mb-8 flex-grow space-y-3">
        {props.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-primary" />
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
