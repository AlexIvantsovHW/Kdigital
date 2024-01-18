import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
const signData =
  'data:image/png;base64,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'

export const downloadPDF = async (commentRef: any) => {
  const input = commentRef?.current

  try {
    if (!input) {
      console.error('Input element not found')
      return
    }

    const [canvas] = await Promise.all([html2canvas(input)])

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4', true)

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = canvas.width
    const imgHeight = canvas.height

    const leftMargin = 15
    const rightMargin = 15

    const ratio = Math.min(
      (pdfWidth - leftMargin - rightMargin) / imgWidth,
      pdfHeight / imgHeight,
    )

    const imgX =
      leftMargin + (pdfWidth - leftMargin - rightMargin - imgWidth * ratio) / 2
    const imgY = 30

    pdf.addImage(
      imgData,
      'PNG',
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
    )

    pdf.addImage(signData, 'JPEG', 0, 270, 210, 10)

    pdf.save('invoice.pdf')
  } catch (error) {
    console.error('Error while generating PDF:', error)
  }
}
