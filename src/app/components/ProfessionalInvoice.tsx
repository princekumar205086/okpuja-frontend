"use client";
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Professional color scheme
const colors = {
  primary: '#1a365d',      // Dark Blue
  secondary: '#d69e2e',    // Gold
  accent: '#2f855a',       // Green
  danger: '#c53030',       // Red
  dark: '#2d3748',         // Dark Gray
  medium: '#718096',       // Medium Gray
  light: '#f7fafc',        // Light Gray
  white: '#ffffff',
  border: '#e2e8f0',
  text: '#1a202c',
  subtle: '#edf2f7'
};

// Tailwind-inspired styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: colors.white,
    padding: 0,
    fontSize: 12,
  },
  
  // Header with professional design
  header: {
    backgroundColor: colors.primary,
    padding: '40px 30px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.secondary,
  },
  
  brandSection: {
    flexDirection: 'column',
  },
  
  brandName: {
    fontSize: 28,
    fontWeight: 'extrabold',
    color: colors.white,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  
  brandTagline: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'extrabold',
    color: colors.white,
    marginBottom: 6,
    letterSpacing: 1,
  },
  
  invoiceDetails: {
    fontSize: 10,
    color: colors.white,
    marginBottom: 3,
    opacity: 0.95,
    letterSpacing: 0.5,
  },
  
  // Status banner with subtle design
  statusSection: {
    padding: '16px 0',
    alignItems: 'center',
    backgroundColor: colors.subtle,
    marginBottom: 24,
  },
  
  statusBadge: {
    padding: '8px 24px',
    borderRadius: 20,
    minWidth: 240,
    alignItems: 'center',
    backgroundColor: colors.dark,
  },
  
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  
  // Main content
  mainContent: {
    padding: '0 30px',
  },
  
  // Billing section with card design
  billingSection: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 24,
  },
  
  billingCard: {
    flex: 1,
    backgroundColor: colors.subtle,
    borderRadius: 8,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },
  
  infoLabel: {
    fontSize: 9,
    color: colors.medium,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  
  infoValue: {
    fontSize: 11,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 1.4,
  },
  
  infoValueBold: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 10,
    fontWeight: 'bold',
    lineHeight: 1.4,
  },
  
  // Table design with professional look
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },
  
  tableContainer: {
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    padding: '12px 16px',
  },
  
  tableHeaderCell: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  tableRow: {
    flexDirection: 'row',
    padding: '12px 16px',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 32,
    alignItems: 'center',
  },
  
  tableRowEven: {
    backgroundColor: colors.light,
  },
  
  tableCellLabel: {
    fontSize: 9,
    color: colors.medium,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  tableCellValue: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.4,
  },
  
  // Description box
  descriptionCard: {
    backgroundColor: colors.light,
    borderRadius: 6,
    padding: 20,
    marginBottom: 28,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  
  // Total section with emphasis
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: '20px 32px',
    minWidth: 240,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  
  totalLabel: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  totalValue: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'extrabold',
  },
  
  totalCurrency: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: 'bold',
    marginRight: 8,
  },
  
  // Professional footer
  footer: {
    backgroundColor: colors.dark,
    padding: 24,
    marginTop: 'auto',
  },
  
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },
  
  footerSection: {
    flex: 1,
  },
  
  footerTitle: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  footerText: {
    fontSize: 9,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  
  // Watermark with subtle effect
  watermark: {
    position: 'absolute',
    top: '45%',
    left: '25%',
    transform: 'rotate(-45deg)',
    fontSize: 72,
    color: colors.border,
    opacity: 0.03,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

interface InvoiceProps {
  bookingDetails: any;
}

const ProfessionalInvoiceDocument: React.FC<InvoiceProps> = ({ bookingDetails }) => {
  const paymentDetails = bookingDetails.payment_details || bookingDetails.payment || {};
  const status = bookingDetails.status || 'CONFIRMED';
  const isConfirmed = status === 'CONFIRMED';
  
  // Service details
  const serviceData = [
    { label: 'Service Name', value: bookingDetails.cart?.puja_service?.title || 'N/A' },
    { label: 'Category', value: bookingDetails.cart?.puja_service?.category_detail?.name || 'N/A' },
    { label: 'Package Type', value: bookingDetails.cart?.package?.package_type || 'STANDARD' },
    { label: 'Date & Time', value: `${new Date(bookingDetails.selected_date).toLocaleDateString('en-IN')} at ${bookingDetails.selected_time}` },
    { label: 'Location', value: bookingDetails.cart?.package?.location || 'N/A' },
    { label: 'Language', value: bookingDetails.cart?.package?.language || 'HINDI' },
    { label: 'Duration', value: `${bookingDetails.cart?.puja_service?.duration_minutes || 60} minutes` },
    { label: 'Pandits', value: `${bookingDetails.cart?.package?.priest_count || 1} Priest(s)` },
    { label: 'Materials', value: bookingDetails.cart?.package?.includes_materials ? 'Included' : 'Not Included' },
  ];
  
  // Payment details
  const paymentData = [
    { label: 'Transaction ID', value: paymentDetails.transaction_id || paymentDetails.payment_id || 'N/A' },
    { label: 'Payment Method', value: paymentDetails.payment_method || 'PhonePe' },
    { label: 'Payment Status', value: paymentDetails.status || 'SUCCESS' },
    { label: 'Payment Date', value: new Date(paymentDetails.payment_date || bookingDetails.created_at).toLocaleDateString('en-IN') },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>OKPUJA</Text>
        
        {/* Professional Header */}
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>OKPUJA</Text>
            <Text style={styles.brandTagline}>VASTU | PUJA | ASTROLOGY</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceDetails}>Invoice: #{bookingDetails.book_id}</Text>
            <Text style={styles.invoiceDetails}>Date: {new Date().toLocaleDateString('en-IN')}</Text>
            <Text style={styles.invoiceDetails}>Time: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </View>

        {/* Status Banner */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: isConfirmed ? colors.accent : colors.danger }]}>
            <Text style={styles.statusText}>
              {status} • {isConfirmed ? 'PAYMENT SUCCESSFUL' : 'PAYMENT FAILED'}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Billing Information */}
          <View style={styles.billingSection}>
            <View style={styles.billingCard}>
              <Text style={styles.sectionHeader}>Client Information</Text>
              <Text style={styles.infoLabel}>Customer Name</Text>
              <Text style={styles.infoValueBold}>
                {bookingDetails.user?.username || bookingDetails.user?.email?.split('@')[0] || 'Valued Customer'}
              </Text>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{bookingDetails.user?.email || 'N/A'}</Text>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{bookingDetails.user?.phone || 'N/A'}</Text>
              {bookingDetails.address && (
                <>
                  <Text style={styles.infoLabel}>Service Address</Text>
                  <Text style={styles.infoValue}>
                    {[
                      bookingDetails.address.address_line1,
                      bookingDetails.address.city,
                      bookingDetails.address.state,
                      bookingDetails.address.postal_code
                    ].filter(Boolean).join(', ')}
                  </Text>
                </>
              )}
            </View>
            
            <View style={styles.billingCard}>
              <Text style={styles.sectionHeader}>Service Provider</Text>
              <Text style={styles.infoLabel}>Organization</Text>
              <Text style={styles.infoValueBold}>OKPUJA Spiritual Services Pvt. Ltd.</Text>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>support@okpuja.com</Text>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>+91 98765 43210</Text>
              <Text style={styles.infoLabel}>Service Area</Text>
              <Text style={styles.infoValue}>Nationwide Services</Text>
              <Text style={styles.infoLabel}>GSTIN</Text>
              <Text style={styles.infoValue}>22AAAAA0000A1Z5</Text>
            </View>
          </View>

          {/* Service Details */}
          <Text style={styles.tableTitle}>Service Specifications</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '40%' }]}>Field</Text>
              <Text style={[styles.tableHeaderCell, { width: '60%' }]}>Value</Text>
            </View>
            {serviceData.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                <Text style={[styles.tableCellLabel, { width: '40%' }]}>{item.label}</Text>
                <Text style={[styles.tableCellValue, { width: '60%' }]}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Payment Information */}
          <Text style={styles.tableTitle}>Transaction Details</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '40%' }]}>Field</Text>
              <Text style={[styles.tableHeaderCell, { width: '60%' }]}>Value</Text>
            </View>
            {paymentData.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                <Text style={[styles.tableCellLabel, { width: '40%' }]}>{item.label}</Text>
                <Text style={[styles.tableCellValue, { width: '60%' }]}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Package Description */}
          {bookingDetails.cart?.package?.description && (
            <View style={styles.descriptionCard}>
              <Text style={styles.sectionHeader}>Package Inclusions</Text>
              <Text style={styles.infoValue}>
                {bookingDetails.cart.package.description.replace(/<[^>]*>/g, '')}
              </Text>
            </View>
          )}

          {/* Total Amount */}
          <View style={styles.totalContainer}>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Amount Paid</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.totalCurrency}>RS.</Text>
                <Text style={styles.totalValue}>{bookingDetails.total_amount}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Professional Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Blessings & Gratitude</Text>
              <Text style={styles.footerText}>We are honored to serve your spiritual needs.</Text>
              <Text style={styles.footerText}>May the divine grace fill your life with</Text>
              <Text style={styles.footerText}>peace, prosperity, and happiness.</Text>
              <Text style={styles.footerText}>Thank you for trusting OKPUJA.</Text>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Customer Support</Text>
              <Text style={styles.footerText}>Email: support@okpuja.com</Text>
              <Text style={styles.footerText}>Phone: +91 98765 43210</Text>
              <Text style={styles.footerText}>Hours: 6AM-10PM, 365 days</Text>
              <Text style={styles.footerText}>Registered Office: Delhi, India</Text>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Legal Information</Text>
              <Text style={styles.footerText}>• GSTIN: 22AAAAA0000A1Z5</Text>
              <Text style={styles.footerText}>• Cancellation policy applies</Text>
              <Text style={styles.footerText}>• Terms at www.okpuja.com/terms</Text>
              <Text style={styles.footerText}>• Invoice generated electronically</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ProfessionalInvoiceDocument;