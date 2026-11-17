import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ArticleMeasurement } from '@/types/article'

export type ProductionReportProduct = {
  number: string
  dirtyHeight: number
  dirtyWidth: number
  cleanHeight: number
  cleanWidth: number
  big: boolean
  small: boolean
  status: string
  createdAt: string
}

export type ProductionReportData = {
  machineName: string
  machineId: string
  operatorName: string
  operatorRef: string
  articleRef: string
  generatedAt: string

  measurements: {
    dirtyHeight: ArticleMeasurement | null
    dirtyWidth: ArticleMeasurement | null
    cleanHeight: ArticleMeasurement | null
    cleanWidth: ArticleMeasurement | null
  }

  products: ProductionReportProduct[]
}

const formatMeasurement = (measurement: ArticleMeasurement | null) => {
  if (!measurement) return 'Not configured'

  const minimum = measurement.nominal - measurement.toleranceMinus

  const maximum = measurement.nominal + measurement.tolerancePlus

  return [
    `Nominal: ${measurement.nominal}`,
    `Tolerance: +${measurement.tolerancePlus}/-${measurement.toleranceMinus}`,
    `Allowed: ${minimum} - ${maximum}`,
  ].join(' | ')
}

export function createProductionReportPdf(data: ProductionReportData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const totalProducts = data.products.length

  const nonConformingProducts = data.products.filter(
    (product) => product.status === 'NOT_CONFIRMED',
  ).length

  // 1. Report title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('PRODUCTION REPORT', 14, 17)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${data.generatedAt}`, 14, 24)

  // 2. Machine and operator information
  autoTable(doc, {
    startY: 30,
    theme: 'grid',
    head: [
      [
        'Machine',
        'Machine ID',
        'Operator',
        'Operator Reference',
        'Article Reference',
      ],
    ],
    body: [
      [
        data.machineName,
        data.machineId,
        data.operatorName,
        data.operatorRef,
        data.articleRef || 'Not selected',
      ],
    ],
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [35, 65, 100],
    },
  })

  // 3. Article measurements
  const metadataEndY = doc.lastAutoTable.finalY

  autoTable(doc, {
    startY: metadataEndY + 6,
    theme: 'grid',
    head: [['Measurement', 'Specification']],
    body: [
      ['Dirty Height', formatMeasurement(data.measurements.dirtyHeight)],
      ['Dirty Width', formatMeasurement(data.measurements.dirtyWidth)],
      ['Clean Height', formatMeasurement(data.measurements.cleanHeight)],
      ['Clean Width', formatMeasurement(data.measurements.cleanWidth)],
    ],
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [35, 65, 100],
    },
    columnStyles: {
      0: { cellWidth: 40 },
    },
  })

  // 4. Production summary
  const measurementsEndY = doc.lastAutoTable.finalY

  autoTable(doc, {
    startY: measurementsEndY + 6,
    theme: 'grid',
    head: [['Total Products', 'Non-conforming Products']],
    body: [[String(totalProducts), String(nonConformingProducts)]],
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [35, 65, 100],
    },
  })

  // 5. Products table
  const summaryEndY = doc.lastAutoTable.finalY
  autoTable(doc, {
    startY: summaryEndY + 6,
    head: [
      [
        'Number',
        'Dirty Height',
        'Dirty Width',
        'Clean Height',
        'Clean Width',
        'Big',
        'Small',
        'Status',
        'Created',
      ],
    ],

    body: data.products.map((product) => [
      product.number,
      String(product.dirtyHeight),
      String(product.dirtyWidth),
      String(product.cleanHeight),
      String(product.cleanWidth),
      product.big ? 'BIG' : '-',
      product.small ? 'SMALL' : '-',
      product.status === 'CONFIRMED' ? 'CONFIRMED' : 'NOT CONFIRMED',
      new Date(product.createdAt).toLocaleString('en-GB'),
    ]),

    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
    },

    headStyles: {
      fillColor: [35, 65, 100],
    },

    margin: {
      left: 10,
      right: 10,
      bottom: 15,
    },

    didDrawPage: (hookData) => {
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      doc.setFontSize(8)
      doc.text(`Page ${hookData.pageNumber}`, pageWidth - 25, pageHeight - 7)
    },
  })

  return doc
}
