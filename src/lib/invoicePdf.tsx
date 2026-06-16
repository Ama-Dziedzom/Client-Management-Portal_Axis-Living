import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

// ─── Brand tokens ─────────────────────────────────────────
const C = {
    primary: '#2F402C',
    tan:     '#C6B9AA',
    muted:   '#6B7280',
    border:  '#E5E7EB',
    bg:      '#F2EBE3',
    text:    '#1C1C1C',
    white:   '#FFFFFF',
}

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: C.text,
        paddingTop: 48,
        paddingBottom: 64,
        paddingHorizontal: 48,
        backgroundColor: C.white,
    },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 36 },
    studioName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.primary, marginBottom: 6 },
    studioSub:  { fontSize: 9, color: C.muted, lineHeight: 1.6 },
    invoiceLabel: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.primary, textAlign: 'right' },
    invoiceNumber: { fontSize: 10, color: C.muted, textAlign: 'right', marginTop: 4 },

    // Meta bar
    metaBar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: C.border,
        paddingVertical: 14,
        marginBottom: 28,
        gap: 0,
    },
    metaCell: { flex: 1 },
    metaLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.tan, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    metaValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.text },

    // Bill-to
    billTo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
    billToLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.tan, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
    billToName:  { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.primary, marginBottom: 2 },
    billToSub:   { fontSize: 9, color: C.muted },

    // Table
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: C.border,
        paddingBottom: 7,
        marginBottom: 0,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: C.border,
        paddingVertical: 9,
    },
    colDesc:    { flex: 1, paddingRight: 8 },
    colQty:     { width: 36, textAlign: 'center' },
    colPrice:   { width: 80, textAlign: 'right' },
    colAmount:  { width: 80, textAlign: 'right' },
    thText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.tan, textTransform: 'uppercase', letterSpacing: 1 },
    tdText: { fontSize: 10, color: C.text },
    tdBold: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.primary },

    // Totals
    totalsBlock: { marginTop: 16, alignItems: 'flex-end' },
    totalRow:    { flexDirection: 'row', width: 200, justifyContent: 'space-between', paddingVertical: 4 },
    totalLabel:  { fontSize: 10, color: C.muted },
    totalValue:  { fontSize: 10, color: C.muted },
    grandRow:    { flexDirection: 'row', width: 200, justifyContent: 'space-between', paddingTop: 8, marginTop: 4, borderTopWidth: 1, borderColor: C.border },
    grandLabel:  { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.primary },
    grandValue:  { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.primary },

    // Notes
    notesSection: { marginTop: 28, padding: 14, backgroundColor: C.bg, borderRadius: 6 },
    notesLabel:   { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.tan, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    notesText:    { fontSize: 9, color: C.muted, lineHeight: 1.6 },

    // Payment details
    paySection:   { marginTop: 20 },
    payLabel:     { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.tan, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
    payBlock:     { marginBottom: 12 },
    payTypeLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, borderBottomWidth: 1, borderColor: C.border, paddingBottom: 4 },
    payRow:       { flexDirection: 'row', marginBottom: 3 },
    payKey:       { width: 90, fontSize: 9, color: C.muted },
    payVal:       { flex: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.text },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 32,
        left: 48,
        right: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: C.border,
        paddingTop: 10,
    },
    footerText: { fontSize: 8, color: C.muted },
})

// ─── Types ─────────────────────────────────────────────────
export interface InvoicePDFProps {
    invoiceNumber: string
    issueDate:     string
    dueDate:       string
    clientName:    string
    clientEmail:   string
    projectTitle:  string
    lineItems:     { description: string; quantity: number; unit_price: number; amount: number }[]
    subtotal:      number
    taxAmount:     number
    taxRate:       number
    total:         number
    currency:      string
    notes?:        string
    paymentDetails?: Record<string, string> | null
}

// ─── Helpers ───────────────────────────────────────────────
function fmt(amount: number, currency: string) {
    return new Intl.NumberFormat('en-ZM', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount)
}

// ─── Component ─────────────────────────────────────────────
export function InvoicePDF({
    invoiceNumber, issueDate, dueDate,
    clientName, clientEmail, projectTitle,
    lineItems, subtotal, taxAmount, taxRate, total, currency,
    notes, paymentDetails,
}: InvoicePDFProps) {
    const pd = paymentDetails
    const hasBank = pd?.bankAccountNumber
    const hasMomo = pd?.momoNumber

    return (
        <Document title={`Invoice ${invoiceNumber} — Axis Living`} author="Axis Living Studio">
            <Page size="A4" style={styles.page}>

                {/* ── Header ── */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.studioName}>AXIS LIVING</Text>
                        <Text style={styles.studioSub}>Studio 102, Innovation Hub{'\n'}Lusaka, Zambia{'\n'}billing@axisliving.com</Text>
                    </View>
                    <View>
                        <Text style={styles.invoiceLabel}>INVOICE</Text>
                        <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
                    </View>
                </View>

                {/* ── Bill to ── */}
                <View style={styles.billTo}>
                    <View>
                        <Text style={styles.billToLabel}>Bill To</Text>
                        <Text style={styles.billToName}>{clientName}</Text>
                        <Text style={styles.billToSub}>{clientEmail}</Text>
                    </View>
                </View>

                {/* ── Meta bar ── */}
                <View style={styles.metaBar}>
                    {[
                        { label: 'Issue Date', value: issueDate },
                        { label: 'Due Date',   value: dueDate },
                        { label: 'Project',    value: projectTitle },
                        { label: 'Currency',   value: currency },
                    ].map(({ label, value }) => (
                        <View key={label} style={styles.metaCell}>
                            <Text style={styles.metaLabel}>{label}</Text>
                            <Text style={styles.metaValue}>{value}</Text>
                        </View>
                    ))}
                </View>

                {/* ── Line items ── */}
                <View style={styles.tableHeader}>
                    <View style={styles.colDesc}><Text style={styles.thText}>Description</Text></View>
                    <View style={styles.colQty}><Text style={[styles.thText, { textAlign: 'center' }]}>Qty</Text></View>
                    <View style={styles.colPrice}><Text style={[styles.thText, { textAlign: 'right' }]}>Unit Price</Text></View>
                    <View style={styles.colAmount}><Text style={[styles.thText, { textAlign: 'right' }]}>Amount</Text></View>
                </View>

                {lineItems.map((item, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <View style={styles.colDesc}><Text style={styles.tdText}>{item.description || '—'}</Text></View>
                        <View style={styles.colQty}><Text style={[styles.tdText, { textAlign: 'center' }]}>{item.quantity}</Text></View>
                        <View style={styles.colPrice}><Text style={[styles.tdText, { textAlign: 'right' }]}>{fmt(item.unit_price, currency)}</Text></View>
                        <View style={styles.colAmount}><Text style={[styles.tdBold, { textAlign: 'right' }]}>{fmt(item.amount, currency)}</Text></View>
                    </View>
                ))}

                {/* ── Totals ── */}
                <View style={styles.totalsBlock}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>{fmt(subtotal, currency)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax ({taxRate}% VAT)</Text>
                        <Text style={styles.totalValue}>{fmt(taxAmount, currency)}</Text>
                    </View>
                    <View style={styles.grandRow}>
                        <Text style={styles.grandLabel}>Total Due</Text>
                        <Text style={styles.grandValue}>{fmt(total, currency)}</Text>
                    </View>
                </View>

                {/* ── Notes ── */}
                {notes ? (
                    <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Notes &amp; Terms</Text>
                        <Text style={styles.notesText}>{notes}</Text>
                    </View>
                ) : null}

                {/* ── Payment details ── */}
                {(hasBank || hasMomo) ? (
                    <View style={styles.paySection}>
                        <Text style={styles.payLabel}>How to Pay</Text>

                        {hasBank ? (
                            <View style={styles.payBlock}>
                                <Text style={styles.payTypeLabel}>Bank Transfer</Text>
                                {pd?.bankName && (
                                    <View style={styles.payRow}><Text style={styles.payKey}>Bank</Text><Text style={styles.payVal}>{pd.bankName}</Text></View>
                                )}
                                {pd?.bankAccountName && (
                                    <View style={styles.payRow}><Text style={styles.payKey}>Account Name</Text><Text style={styles.payVal}>{pd.bankAccountName}</Text></View>
                                )}
                                <View style={styles.payRow}><Text style={styles.payKey}>Account Number</Text><Text style={styles.payVal}>{pd!.bankAccountNumber}</Text></View>
                                {pd?.bankBranch && (
                                    <View style={styles.payRow}><Text style={styles.payKey}>Branch</Text><Text style={styles.payVal}>{pd.bankBranch}</Text></View>
                                )}
                            </View>
                        ) : null}

                        {hasMomo ? (
                            <View style={styles.payBlock}>
                                <Text style={styles.payTypeLabel}>{pd?.momoProvider || 'Mobile Money'}</Text>
                                <View style={styles.payRow}><Text style={styles.payKey}>Number</Text><Text style={styles.payVal}>{pd!.momoNumber}</Text></View>
                                {pd?.momoName && (
                                    <View style={styles.payRow}><Text style={styles.payKey}>Name</Text><Text style={styles.payVal}>{pd.momoName}</Text></View>
                                )}
                            </View>
                        ) : null}
                    </View>
                ) : null}

                {/* ── Footer ── */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Axis Living Studio · billing@axisliving.com</Text>
                    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>

            </Page>
        </Document>
    )
}
