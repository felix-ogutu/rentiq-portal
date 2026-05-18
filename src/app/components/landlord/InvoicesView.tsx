import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Loader2,
    Mail,
    Plus,
    Link as LinkIcon,
} from "lucide-react";

import { toast } from "sonner";

import {
    useInvoices,
    useCreateInvoice,
    useSendInvoiceViaEmail,
    useGeneratePaymentLink,
} from "../../hooks/useInvoices";

import { useTenants } from "../../hooks/useTenants";

import {
    InvoiceCreateRequest,
    InvoiceFilter,
    InvoiceStatus,
} from "../../types/invoice";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export function InvoicesView() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState<InvoiceFilter>({
        page: 0,
        size: 20,
    });

    const [openCreate, setOpenCreate] = useState(false);

    const { data, isLoading } = useInvoices(filters);
    const { data: tenantsData } = useTenants({
        page: 0,
        size: 100,
    });

    const createInvoiceMutation = useCreateInvoice();
    const sendEmailMutation = useSendInvoiceViaEmail();
    const generateLinkMutation = useGeneratePaymentLink();

    const invoices = data?.data ?? [];
    const stats = data?.stats;
    const tenants = tenantsData?.data ?? [];

    const [formData, setFormData] = useState<InvoiceCreateRequest>({
        tenantId: 0,
        waterAmount: 0,
        securityAmount: 0,
        dueDate: "",
    });

    // Create Invoice
    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createInvoiceMutation.mutateAsync(formData);
            toast.success("Invoice created successfully");

            setOpenCreate(false);
            setFormData({
                tenantId: 0,
                waterAmount: 0,
                securityAmount: 0,
                dueDate: "",
            });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create invoice");
        }
    };

    // Send Invoice via Email
    const handleSendEmail = async (id: number) => {
        try {
            await sendEmailMutation.mutateAsync({ id });
            toast.success("Invoice sent via email successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to send email");
        }
    };

    // Generate Payment Link & Redirect
    // Generate Payment Link & Redirect
    const handleGenerateLink = async (id: number) => {
        try {
            toast.loading("Generating payment link...", { id: "generate-link" });

            const result = await generateLinkMutation.mutateAsync({ id });

            toast.dismiss("generate-link");

            if (result?.token) {
                toast.success("Payment link generated successfully");
                navigate(`/invoices/${result.token}`);
            } else {
                toast.error("Received invalid response from server");
                console.error("Invalid response:", result);
            }
        } catch (err: any) {
            toast.dismiss("generate-link");

            const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to generate payment link";

            toast.error(errorMessage);

            console.error("Generate Link Error:", {
                error: err,
                response: err?.response?.data,
                status: err?.response?.status
            });
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <p className="text-gray-600">Manage billing and payments</p>
                </div>

                <Button onClick={() => setOpenCreate(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Invoice
                </Button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Total Invoices</p>
                        <p className="text-2xl font-bold">{stats?.totalInvoices ?? 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Paid</p>
                        <p className="text-2xl font-bold text-green-600">{stats?.paid ?? 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-red-500">{stats?.pending ?? 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Partial</p>
                        <p className="text-2xl font-bold text-amber-500">{stats?.partial ?? 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Total Paid</p>
                        <p className="text-xl font-bold text-green-600">
                            KES {stats?.totalPaid ?? 0}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Outstanding</p>
                        <p className="text-xl font-bold text-red-600">
                            KES {stats?.totalOutstanding ?? 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* FILTERS */}
            <div className="grid md:grid-cols-2 gap-4">
                <select
                    className="border rounded px-3 py-2"
                    value={filters.tenantId ?? ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            tenantId: e.target.value ? Number(e.target.value) : undefined,
                        }))
                    }
                >
                    <option value="">All Tenants</option>
                    {tenants.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.fullName}
                        </option>
                    ))}
                </select>

                <select
                    className="border rounded px-3 py-2"
                    value={filters.status ?? ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            status: (e.target.value as InvoiceStatus) || undefined,
                        }))
                    }
                >
                    <option value="">All Status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="PAID">PAID</option>
                </select>
            </div>

            {/* INVOICES TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                        <FileText size={18} />
                        Invoices List
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin h-8 w-8" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Paid</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell>#{inv.id}</TableCell>
                                        <TableCell>{inv.tenantName}</TableCell>
                                        <TableCell>{inv.propertyName || "-"}</TableCell>
                                        <TableCell>{inv.unitNumber || "-"}</TableCell>
                                        <TableCell>KES {inv.totalAmount}</TableCell>
                                        <TableCell>KES {inv.paidAmount}</TableCell>
                                        <TableCell>KES {inv.balance}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={
                                                    inv.status === "PAID"
                                                        ? "bg-green-100 text-green-700"
                                                        : inv.status === "PARTIAL"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-red-100 text-red-700"
                                                }
                                            >
                                                {inv.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleSendEmail(inv.id)}
                                            >
                                                <Mail size={14} className="mr-1" />
                                                Email
                                            </Button>

                                            <Button
                                                size="sm"
                                                onClick={() => handleGenerateLink(inv.id)}
                                            >
                                                <LinkIcon size={14} className="mr-1" />
                                                Pay Link
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* CREATE INVOICE DIALOG */}
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateInvoice} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tenant</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={formData.tenantId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tenantId: Number(e.target.value),
                                    })
                                }
                                required
                            >
                                <option value={0}>Select Tenant</option>
                                {tenants.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Water Amount (KES)</label>
                            <Input
                                type="number"
                                value={formData.waterAmount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        waterAmount: Number(e.target.value),
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Security Amount (KES)</label>
                            <Input
                                type="number"
                                value={formData.securityAmount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        securityAmount: Number(e.target.value),
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Due Date</label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        dueDate: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={createInvoiceMutation.isPending}>
                                {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}