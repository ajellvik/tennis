import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Video, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ analysisId }: { analysisId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || processing) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/results/${analysisId}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your analysis is starting now!",
        });
        setLocation(`/results/${analysisId}`);
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-tennis-green hover:bg-tennis-light-green"
        size="lg"
      >
        <CreditCard className="mr-2 h-5 w-5" />
        {processing ? "Processing..." : "Pay $10.00 & Start Analysis"}
      </Button>
    </form>
  );
}

export default function Payment() {
  const [match, params] = useRoute("/payment/:id");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const analysisId = params?.id ? parseInt(params.id) : null;

  useEffect(() => {
    if (!analysisId) return;

    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          analysisId,
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Payment Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [analysisId, toast]);

  if (!match || !analysisId) {
    return <div>Invalid analysis ID</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-tennis-green border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clientSecret) {
    return <div>Failed to load payment form</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Analysis</h1>
          <p className="text-xl text-gray-600">Secure payment processing powered by Stripe</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Video className="text-tennis-green h-6 w-6 mr-3" />
                  <div>
                    <div className="font-semibold">Tennis Video Analysis</div>
                    <div className="text-sm text-gray-500">World ranking estimation</div>
                  </div>
                </div>
                <div className="font-semibold">$10.00</div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-tennis-green">$10.00</span>
                </div>
              </div>

              <div className="p-4 bg-tennis-green/10 rounded-lg">
                <div className="flex items-center text-tennis-green">
                  <Shield className="mr-2 h-5 w-5" />
                  <span className="font-semibold">Secure Payment</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm analysisId={analysisId} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
