import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePaymentInvoice, useInitiatePayment } from "../../hooks/useInvoices";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function PaymentLinkView() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const { data: invoice, isLoading, isError } = usePaymentInvoice(token);
    const initiatePayment = useInitiatePayment();

    const [form, setForm] = useState({
        amount: 0,
        phoneNumber: "",
    });

    // Autofill amount from invoice
    useEffect(() => {
        if (invoice?.totalAmount) {
            setForm(prev => ({ ...prev, amount: invoice.totalAmount }));
        }
    }, [invoice]);

    const handlePayment = async () => {
        if (!form.phoneNumber || !form.amount) {
            toast.error("Please enter phone number and amount");
            return;
        }

        try {
            await initiatePayment.mutateAsync({
                token: token!,
                data: {
                    amount: form.amount,
                    phoneNumber: form.phoneNumber,
                },
            });

            toast.success("Payment initiated successfully! Check your phone.");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Payment initiation failed");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4" size={48} />
                    <p>Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (isError || !invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-xl font-semibold mb-2">Invalid or Expired Link</h2>
                        <p className="text-gray-600">This payment link is invalid or has expired.</p>
                        <Button onClick={() => navigate('/')} className="mt-6">
                            Go Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-lg w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Pay Invoice</CardTitle>
                    <p className="text-gray-600 mt-1">Secure Payment Portal</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Invoice Details */}
                    <div className="bg-gray-100 p-5 rounded-xl">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Tenant</span>
                            <span className="font-medium">{invoice.tenantName}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Property Name</span>
                            <span className="font-medium">{invoice.propertyName}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Amount Due</span>
                            <span className="text-2xl font-bold">KES {invoice.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status : {invoice.status}</span>
                            <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle size={18} /> Due Paid :: {invoice.dueDate}
                            </span>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number (M-Pesa)</label>
                            <Input
                                placeholder="254712345678"
                                value={form.phoneNumber}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter number in international format</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Amount (KES)</label>
                            <Input
                                type="number"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                            />
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={initiatePayment.isPending || !form.phoneNumber}
                            className="w-full py-6 text-lg font-semibold"
                            style={{ backgroundColor: '#272757' }}
                        >
                            {initiatePayment.isPending ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                `Pay KES ${form.amount.toLocaleString()}`
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-xs text-gray-500">
                        Secured by Rentiq • Powered by M-Pesa
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}