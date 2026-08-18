import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money, percent, prettyDate, prettyMonth, TYPE_LABELS } from "./format.js";

const COLORS = {
  teal: [15, 118, 110],
  blue: [37, 99, 235],
  navy: [15, 23, 42],
  slate: [100, 116, 139],
  light: [241, 245, 249],
  white: [255, 255, 255],
  green: [22, 163, 74],
  red: [220, 38, 38],
  orange: [217, 119, 6]
};

const addHeader = (doc, title, subtitle) => {
  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, 210, 36, "F");
  doc.setFillColor(...COLORS.teal);
  doc.rect(0, 36, 210, 4, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Business Finance Portal", 14, 16);
  doc.setFontSize(12);
  doc.text(title, 14, 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(subtitle, 14, 31);
};

const addFooter = (doc) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFillColor(...COLORS.light);
    doc.rect(0, 287, 210, 10, "F");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.slate);
    doc.text("Confidential business report", 14, 293);
    doc.text(`Page ${i} of ${pageCount}`, 196, 293, { align: "right" });
  }
};

const kpiBox = (doc, x, y, label, value, accent) => {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.6);
  doc.roundedRect(x, y, 44, 22, 2, 2, "FD");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.slate);
  doc.text(label, x + 3, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navy);
  doc.text(String(value), x + 3, y + 16, { maxWidth: 38 });
  doc.setFont("helvetica", "normal");
};

const drawBars = (doc, breakdown, y) => {
  const max = Math.max(...breakdown.map((item) => item.amount), 1);
  breakdown.forEach((item, index) => {
    const top = y + index * 10;
    const width = (item.amount / max) * 120;
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.navy);
    doc.text(TYPE_LABELS[item.type], 14, top + 4);
    doc.setFillColor(...(item.type === "income"
      ? COLORS.teal
      : item.type === "investment"
        ? COLORS.blue
        : item.type === "expense"
          ? COLORS.red
          : COLORS.orange));
    doc.roundedRect(52, top, Math.max(width, 1), 5, 1, 1, "F");
    doc.setTextColor(...COLORS.slate);
    doc.text(money(item.amount), 178, top + 4, { align: "right" });
  });
};

export const exportReportPdf = (report, rangeLabel) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const generated = prettyDate(report.period.generatedAt);
  const periodText = report.period.from
    ? `${prettyDate(report.period.from)} to ${prettyDate(report.period.to)}`
    : "All time";

  addHeader(doc, "Comprehensive Business Report", `${rangeLabel}  |  ${periodText}  |  Generated ${generated}`);

  const kpis = report.kpis;
  kpiBox(doc, 14, 48, "Income", money(kpis.income), COLORS.teal);
  kpiBox(doc, 61, 48, "Expenses", money(kpis.expense), COLORS.red);
  kpiBox(doc, 108, 48, "Net Profit", money(kpis.netProfit), kpis.netProfit >= 0 ? COLORS.green : COLORS.red);
  kpiBox(doc, 155, 48, "Cash Position", money(kpis.cashPosition), COLORS.blue);

  kpiBox(doc, 14, 74, "Investments", money(kpis.investment), COLORS.blue);
  kpiBox(doc, 61, 74, "Purchases", money(kpis.purchase), COLORS.orange);
  kpiBox(doc, 108, 74, "Profit Margin", percent(kpis.profitMargin), COLORS.teal);
  kpiBox(doc, 155, 74, "Records", String(kpis.transactionCount), COLORS.navy);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.navy);
  doc.text("Category Breakdown", 14, 108);
  drawBars(doc, report.breakdown, 114);

  autoTable(doc, {
    startY: 158,
    head: [["Month", "Income", "Investment", "Expense", "Purchase", "Net"]],
    body: report.monthly.length
      ? report.monthly.map((row) => [
          prettyMonth(row.month),
          money(row.income),
          money(row.investment),
          money(row.expense),
          money(row.purchase),
          money(row.net)
        ])
      : [["No monthly activity", "-", "-", "-", "-", "-"]],
    theme: "grid",
    headStyles: { fillColor: COLORS.teal, textColor: COLORS.white, fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 2.2 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  const topIncome = report.top.income.map((item) => [item.title, money(item.amount), prettyDate(item.date)]);
  const topExpense = report.top.expense.map((item) => [item.title, money(item.amount), prettyDate(item.date)]);
  const maxRows = Math.max(topIncome.length, topExpense.length, 1);
  const paired = Array.from({ length: maxRows }, (_, index) => [
    ...(topIncome[index] || ["-", "-", "-"]),
    ...(topExpense[index] || ["-", "-", "-"])
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Top Income", "Amount", "Date", "Top Expenses", "Amount", "Date"]],
    body: paired,
    theme: "striped",
    headStyles: { fillColor: COLORS.blue, textColor: COLORS.white },
    styles: { fontSize: 8, cellPadding: 2 }
  });

  doc.addPage();
  addHeader(doc, "Investor Capital Report", `${rangeLabel}  |  Generated ${generated}`);

  kpiBox(doc, 14, 48, "Investors", String(report.investors.total), COLORS.blue);
  kpiBox(doc, 61, 48, "Active Partners", String(report.investors.active), COLORS.teal);
  kpiBox(doc, 108, 48, "Total Capital", money(report.investors.totalCapital), COLORS.navy);
  kpiBox(doc, 155, 48, "Ownership Left", percent(report.investors.ownershipAvailable), COLORS.orange);

  autoTable(doc, {
    startY: 78,
    head: [["Investor", "Status", "Capital", "Ownership", "Joined", "Contact"]],
    body: report.investors.list.length
      ? report.investors.list.map((item) => [
          item.name,
          item.status,
          money(item.investedAmount),
          percent(item.ownershipPercent),
          prettyDate(item.joinDate),
          item.email || item.phone || "-"
        ])
      : [["No investors recorded", "-", "-", "-", "-", "-"]],
    theme: "grid",
    headStyles: { fillColor: [124, 58, 237], textColor: COLORS.white },
    styles: { fontSize: 8, cellPadding: 2.4 },
    alternateRowStyles: { fillColor: [245, 243, 255] }
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 12,
    head: [["Type", "Title", "Amount", "Date", "Notes"]],
    body: report.transactions.length
      ? report.transactions.map((item) => [
          TYPE_LABELS[item.type] || item.type,
          item.title,
          money(item.amount),
          prettyDate(item.date),
          item.notes || "-"
        ])
      : [["No transactions in this period", "-", "-", "-", "-"]],
    theme: "grid",
    headStyles: { fillColor: COLORS.navy, textColor: COLORS.white },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 4: { cellWidth: 48 } }
  });

  addFooter(doc);
  const fileName = `business-report-${toInputSafe(rangeLabel)}.pdf`;
  doc.save(fileName);
};

const toInputSafe = (value) =>
  String(value || "all-time")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
