import { loadStripe } from "@stripe/stripe-js";
import { useStripe, Elements } from "@stripe/react-stripe-js";
import MonthlyFeeContent from "./MonthlyFee";

const MonthlyFee = () => {
    
    const stripePromise = loadStripe("pk_test_51QVllgLGRlPpjKfjb0kJx1duZJodKVhBPgUrlEqAWHSweobrx0xToWMeFmfwbfMQ72QOzSOTnDyqjR5Fq6XODa1H007P3RGFcj");

    return (
            <Elements stripe={stripePromise}>
                <MonthlyFeeContent />
            </Elements>
    );
}

export default MonthlyFee;